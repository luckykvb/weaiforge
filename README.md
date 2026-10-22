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

## Editing

- `src/App.jsx`: active company site, offerings, FAQ, simulation, and enquiry form
- `src/styles/forge.css`: responsive layouts using the original WeAIForge theme tokens and logo
- `src/siteConfig.js`: contact details and legal update date
- `index.html`, `ai-agents.html`, `forward-deployed-engineering.html`: SEO metadata
- `src/pages/Legal.jsx`: privacy and terms content

The workflow is a manually stepped browser simulation with synthetic data. It does not call a model, connect to a CRM, or send external messages. It is not a client project or a working backend agent. The simulated approval and completion states are illustrative.

Contact enquiries open a populated email draft; visitors must send it through their email app. There is no form submission service or calendar integration.

Legacy components in `src/sections` and `src/components` are retained but are not rendered by the new company site.
