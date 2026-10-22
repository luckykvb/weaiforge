# WeAIForge

Company website for agentic AI delivery and forward-deployed AI engineering.
Built with React and Vite. No backend or live AI integration is required.

## Development

```sh
npm install
npm run dev
npm run build
npm run preview
```

Deploy `dist/` to a static host. Vercel clean URLs are configured in `vercel.json`.

## Pages

- `/` — company, offerings, workflow simulation, approach, and contact
- `/ai-agents` — agentic solution entry point
- `/forward-deployed-engineering` — embedded engineering entry point
- `/privacy` and `/terms` — legal information

The two service entry points use the shared site layout with service-specific headlines and descriptions.

## Website direction

The current composition and content strategy are documented in `docs/website-direction.md`. The site leads with business outcomes and a large interactive workspace, followed by a media feature, offset engagement options, delivery approach, and project enquiry. The original brand palette and theme selection remain active.

## Editing

- `src/App.jsx`: active company site, business positioning, engagement options, delivery approach, FAQ, and enquiry form
- `src/components/WorkflowPreview.jsx`: three selectable local workflow examples, timed sample steps, approval, and reset
- `src/components/OperationsShowcase.jsx`: fictional order-exception walkthrough with playback, source records, draft review, revision return, and sample action history
- `src/styles/forge.css`: responsive layouts using the original WeAIForge theme tokens and logo
- `src/siteConfig.js`: contact details and legal update date
- `index.html`, `ai-agents.html`, `forward-deployed-engineering.html`: SEO metadata
- `src/pages/Legal.jsx`: privacy and terms content

The homepage uses a readable, theme-aware interactive product workspace. A featured section includes a 20-second MP4 assembled from five browser-captured workflow states (with poster, controls, and English captions). Media uses the established light theme. See `public/media/README.md` for provenance and rebuild instructions. The detailed simulator is available under “Try the interactive workflow.”

The workflow spotlight is a browser simulation with synthetic data. Visitors can step through it or play the walkthrough; playback stops at human review. Approval completes the sample case, while requesting revision returns to the read-only draft. Restart clears the walkthrough state. It does not call a model, connect to a CRM, or send external messages. It is not a client project or a working backend agent. The simulated approval and completion states are illustrative.

Contact enquiries open a populated email draft; visitors must send it through their email app. There is no form submission service. Calendly scheduling is available when its event URL is configured.

Legacy components in `src/sections` and `src/components` are retained but are not rendered by the new company site.

## Calendly scheduling

Set `calendlyUrl` in `src/siteConfig.js` to the real HTTPS Calendly event URL. This enables the booking section and routes the header and hero booking buttons to it. The calendar loads only when visitors choose “Choose a time”; a direct Calendly link is available as a fallback. No API key is needed. Without a valid event URL, existing enquiry links remain active.
