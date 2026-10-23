# Website product media

Active media comes from the actual browser-rendered OperationsShowcase component, using fictional records. It does not show a live AI integration or a client deployment.

- operations-product.webp: review-state screenshot framed in the established light/terracotta theme.
- product-frames/01.png through 05.png: five browser captures of receive, investigate, draft, review, and completion states.
- order-workflow.mp4: 20-second silent walkthrough assembled from those screenshots with chapter captions and crossfades; this is a screenshot sequence, not a continuous screen recording.
- order-workflow-poster.jpg: opening frame.
- order-workflow.vtt: English captions.

Rebuild with `python3 scripts/build_showcase_video.py` in an environment with Pillow and ffmpeg. The font paths currently target macOS Arial.

The previously generated logistics artwork is no longer referenced by the site or the video build. It is retained as an unused earlier asset.

## Appearance variants

The dark variant uses actual captures in `product-frames-dark/`, recorded in the dark Amber palette. Build it with `python3 scripts/build_showcase_video.py --mode dark`. This creates `order-workflow-dark.mp4` and `order-workflow-poster-dark.jpg`. The page selects the matching video and poster when light/dark appearance changes. Accent colors inside recorded footage are fixed, while the surrounding live interface follows the selected accent.
