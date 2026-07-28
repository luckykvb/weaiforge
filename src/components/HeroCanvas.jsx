import { useEffect, useRef } from 'react'
import { getAccentRgb, getStoredTheme, THEME_EVENT } from '../theme'

// Generative "neural field": drifting nodes wired by proximity, with a few
// slow light trails. Self-contained (no assets), DPR-capped, pauses off-screen,
// and stays static under prefers-reduced-motion.
export default function HeroCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: true })
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    let dpr = 1
    let nodes = []
    let trails = []
    let raf = 0
    let running = true
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 }

    const ACCENT = getAccentRgb(getStoredTheme()).split(',').map((n) => Number(n.trim()))
    const onThemeChange = (e) => {
      const rgb = getAccentRgb(e.detail.theme).split(',').map((n) => Number(n.trim()))
      ACCENT[0] = rgb[0]
      ACCENT[1] = rgb[1]
      ACCENT[2] = rgb[2]
    }
    window.addEventListener(THEME_EVENT, onThemeChange)

    function resize() {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }

    function seed() {
      const density = Math.min(Math.max(Math.round((width * height) / 15000), 30), 90)
      nodes = Array.from({ length: density }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.4 + 0.6,
        p: Math.random(),
      }))
      trails = Array.from({ length: 5 }, () => spawnTrail())
    }

    function spawnTrail() {
      const horizontal = Math.random() > 0.5
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: horizontal ? (Math.random() > 0.5 ? 1 : -1) * (0.6 + Math.random()) : 0,
        vy: horizontal ? 0 : (Math.random() > 0.5 ? 1 : -1) * (0.6 + Math.random()),
        len: 60 + Math.random() * 120,
        life: 0,
        max: 240 + Math.random() * 180,
      }
    }

    const LINK = 130

    function frame() {
      ctx.clearRect(0, 0, width, height)
      pointer.x += (pointer.tx - pointer.x) * 0.05
      pointer.y += (pointer.ty - pointer.y) * 0.05
      const px = (pointer.x - 0.5) * 26
      const py = (pointer.y - 0.5) * 26

      // trails (drawn under the node web)
      trails.forEach((t, i) => {
        t.x += t.vx
        t.y += t.vy
        t.life += 1
        const fade = Math.sin((t.life / t.max) * Math.PI)
        const grad = ctx.createLinearGradient(t.x, t.y, t.x - t.vx * t.len, t.y - t.vy * t.len)
        grad.addColorStop(0, `rgba(${ACCENT[0]},${ACCENT[1]},${ACCENT[2]},${0.5 * fade})`)
        grad.addColorStop(1, `rgba(${ACCENT[0]},${ACCENT[1]},${ACCENT[2]},0)`)
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.moveTo(t.x, t.y)
        ctx.lineTo(t.x - t.vx * t.len, t.y - t.vy * t.len)
        ctx.stroke()
        if (t.life > t.max || t.x < -200 || t.x > width + 200 || t.y < -200 || t.y > height + 200) {
          trails[i] = spawnTrail()
        }
      })

      // node movement
      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0 || n.x > width) n.vx *= -1
        if (n.y < 0 || n.y > height) n.vy *= -1
        n.p += 0.01
      }

      // links
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 < LINK * LINK) {
            const alpha = (1 - Math.sqrt(d2) / LINK) * 0.22
            ctx.strokeStyle = `rgba(${ACCENT[0]},${ACCENT[1]},${ACCENT[2]},${alpha})`
            ctx.lineWidth = 0.7
            ctx.beginPath()
            ctx.moveTo(a.x + px, a.y + py)
            ctx.lineTo(b.x + px, b.y + py)
            ctx.stroke()
          }
        }
      }

      // nodes
      for (const n of nodes) {
        const twinkle = 0.5 + 0.5 * Math.sin(n.p)
        ctx.beginPath()
        ctx.arc(n.x + px, n.y + py, n.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${ACCENT[0]},${ACCENT[1]},${ACCENT[2]},${0.35 + twinkle * 0.5})`
        ctx.fill()
      }

      if (running) raf = requestAnimationFrame(frame)
    }

    function drawStatic() {
      // Single calm frame for reduced-motion users.
      frameOnce()
    }
    function frameOnce() {
      running = false
      ctx.clearRect(0, 0, width, height)
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 < LINK * LINK) {
            const alpha = (1 - Math.sqrt(d2) / LINK) * 0.18
            ctx.strokeStyle = `rgba(${ACCENT[0]},${ACCENT[1]},${ACCENT[2]},${alpha})`
            ctx.lineWidth = 0.7
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }
      for (const n of nodes) {
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${ACCENT[0]},${ACCENT[1]},${ACCENT[2]},0.55)`
        ctx.fill()
      }
    }

    function onMove(e) {
      pointer.tx = e.clientX / window.innerWidth
      pointer.ty = e.clientY / window.innerHeight
    }

    resize()
    if (reduce) {
      drawStatic()
    } else {
      raf = requestAnimationFrame(frame)
      window.addEventListener('pointermove', onMove, { passive: true })
    }

    const onResize = () => {
      cancelAnimationFrame(raf)
      resize()
      if (reduce) drawStatic()
      else {
        running = true
        raf = requestAnimationFrame(frame)
      }
    }
    window.addEventListener('resize', onResize)

    // Pause the loop when the hero scrolls out of view.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (reduce) return
        if (entry.isIntersecting && !running) {
          running = true
          raf = requestAnimationFrame(frame)
        } else if (!entry.isIntersecting) {
          running = false
          cancelAnimationFrame(raf)
        }
      },
      { threshold: 0 },
    )
    io.observe(canvas)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener(THEME_EVENT, onThemeChange)
      io.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className="hero__canvas" aria-hidden="true" />
}
