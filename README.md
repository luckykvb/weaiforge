# Axon — AI Solutions Studio landing site

A single-page marketing site built with **Vite + React**. Dark, engineering-grade
visual identity with a generative neural-particle hero, scroll reveals, and a
fully responsive layout.

> **Axon** is a placeholder brand. See "Rebranding" below to swap it out.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle → dist/
npm run preview  # preview the production build
```

Deploy the `dist/` folder to any static host (Netlify, Vercel, GitHub Pages, S3).

## Rebranding & content — where to edit

Everything you'll want to change at launch is in a few obvious spots:

| What | Where |
|------|-------|
| Brand name, tagline, contact email, booking URL, nav & social links | `src/siteConfig.js` |
| Accent color & all design tokens (colors, type scale, spacing, radii) | `src/styles/tokens.css` |
| Fonts | `index.html` (Google Fonts link) + `--font-*` in `tokens.css` |
| Case studies (incl. AICines) | `src/sections/CaseStudies.jsx` — search `TODO` |
| Founder bio & photo | `src/sections/About.jsx` — search `TODO` |
| Pricing tiers | `src/sections/Engagement.jsx` |
| Section copy | the matching file in `src/sections/` |

Search the codebase for `TODO` to find every placeholder that expects real content
(founder photo, case-study media, booking embed).

### Swap the booking link
`bookingUrl` in `src/siteConfig.js` currently points at `#book`. Replace it with your
Calendly / Cal.com URL, or drop an embed into `src/sections/FinalCTA.jsx` (marked with
a `TODO`).

## Structure

```
src/
  siteConfig.js         # brand + contact — single source of truth
  main.jsx              # entry; CSS load order (tokens → global → sections)
  App.jsx               # section composition
  components/
    HeroCanvas.jsx      # generative neural-particle background (self-contained)
    Icon.jsx            # custom line-icon set
    Reveal.jsx          # scroll-reveal wrapper
  hooks/useReveal.js    # IntersectionObserver reveal (respects reduced-motion)
  sections/             # one file per page section
  styles/
    tokens.css          # design tokens (edit here to re-theme)
    global.css          # base + shared component rules (.btn, .card, .reveal)
    sections.css        # per-section styles (loaded last so its rules win)
```

## Notes

- **Accessibility:** visible keyboard focus, `aria` labels on interactive controls,
  and `prefers-reduced-motion` disables the canvas animation and scroll reveals.
- **Performance:** the hero canvas caps device-pixel-ratio and pauses when scrolled
  out of view. No external assets beyond the web fonts.
- **CSS load order matters** — `main.jsx` imports `tokens → global → sections` so
  section media queries correctly override the shared `.btn`/`.card` rules.
