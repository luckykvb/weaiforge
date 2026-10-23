"""Assemble a captioned walkthrough from screenshots of the actual demo UI.
Requires Pillow, ffmpeg, and the five browser captures in public/media/product-frames.
"""
from pathlib import Path
import subprocess
import argparse
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/media'
parser = argparse.ArgumentParser()
parser.add_argument('--mode', choices=['light', 'dark'], default='light')
mode = parser.parse_args().mode
suffix = '-dark' if mode == 'dark' else ''
colors = ({'bg':'#1b1a17', 'surface':'#2f2b23', 'text':'#f0f1e9', 'muted':'#b3c0b6', 'accent':'#e8bd7d', 'line':'#49453b'}
          if mode == 'dark' else
          {'bg':'#ffffff', 'surface':'#f6e5d6', 'text':'#20302d', 'muted':'#4a6a64', 'accent':'#b5522e', 'line':'#eee7e1'})
W, H, FPS, DURATION = 1280, 800, 24, 20
FONT = '/System/Library/Fonts/Supplemental/Arial.ttf'
BOLD = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
def font(size, bold=False):
    return ImageFont.truetype(BOLD if bold else FONT, size)

chapters = [
    ('Receive the request', 'A delayed order becomes a case with a clear starting point.'),
    ('Connect the records', 'Investigate the order and the latest shipping information.'),
    ('Prepare the update', 'Create a proposed response grounded in both source records.'),
    ('Pause for human review', 'Check the wording and delivery date before approving.'),
    ('Record the outcome', 'Sample approval recorded. No external message was sent.'),
]
shots = [Image.open(OUT / f'product-frames{suffix}/0{i+1}.png').convert('RGB') for i in range(5)]
# Use a real review-state screenshot as the hero image, with no invented UI.
hero = Image.new('RGB', (1280, 800), colors['surface'])
shot = ImageOps.contain(shots[3], (1216, 736), Image.Resampling.LANCZOS)
hero.paste(shot, ((1280-shot.width)//2, (800-shot.height)//2))
hero.save(OUT / f'operations-product{suffix}.webp', quality=92)
process = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-vcodec', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-', '-an', '-c:v', 'libx264', '-preset', 'fast', '-crf', '21', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(OUT / f'order-workflow{suffix}.mp4')], stdin=subprocess.PIPE)
previous = None
for frame in range(FPS * DURATION):
    t = frame / FPS
    chapter = min(int(t / 4), 4)
    local = t % 4
    im = Image.new('RGB', (W,H), colors['bg'])
    d = ImageDraw.Draw(im)
    d.text((40, 24), 'WEAIFORGE / PRODUCT WALKTHROUGH', font=font(12,True), fill=colors['muted'])
    d.text((977,24), 'CONCEPT / SAMPLE DATA', font=font(12), fill=colors['muted'])
    d.text((40, 56), chapters[chapter][0], font=font(32,True), fill=colors['text'])
    d.text((1190,63), f'0{chapter+1}', font=font(23,True), fill=colors['accent'])
    d.rounded_rectangle((28,112,1252,708), radius=8, fill=colors['surface'])
    shot = ImageOps.contain(shots[chapter], (1192,564), Image.Resampling.LANCZOS)
    im.paste(shot, ((W-shot.width)//2, 128+(564-shot.height)//2))
    d.text((40, 730), chapters[chapter][1], font=font(19), fill=colors['muted'])
    for i in range(5):
        x = 40 + i * 244
        d.rectangle((x, 778, x+224, 781), fill=colors['line'])
        progress = 1 if i<chapter else local/4 if i==chapter else 0
        if progress: d.rectangle((x,778,x+max(1,int(224*progress)),781),fill=colors['accent'])
    if local < .25 and chapter>0 and previous is not None:
        im = Image.blend(previous, im, local/.25)
    if frame == 0: im.save(OUT / f'order-workflow-poster{suffix}.jpg',quality=92)
    if frame % (4*FPS) == 4*FPS-1: previous=im.copy()
    process.stdin.write(im.tobytes())
process.stdin.close()
if process.wait(): raise SystemExit('ffmpeg encoding failed')
print('Created product screenshot, poster, and screenshot walkthrough.')
