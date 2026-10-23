# WeAIForge

Focused company website for custom AI workflows and engineering, built with React and Vite. No backend or live model is required.

## Development

```sh
npm install
npm run dev
npm run build
npm run preview
```

Deploy `dist/` to a static host. Vercel clean URLs are configured in `vercel.json`.

## Pages

- `/` — offer, one interactive demonstration, prototype engagement, working practices, FAQ, and contact.
- `/ai-agents` — workflow development, with specific production-scope details.
- `/forward-deployed-engineering` — embedded engineering, with working arrangements, delivery, and handover details.
- `/privacy` and `/terms` — legal information.

The content and design brief is in `docs/website-direction.md`.

## Editing

- `src/App.jsx`: company positioning, engagement, service details, FAQ, and enquiry form.
- `src/components/OperationsShowcase.jsx`: the single fictional order-enquiry demonstration.
- `src/components/CalendlyBooking.jsx`: opt-in scheduler, shown within contact.
- `src/components/ThemeSwitcher.jsx` and `src/theme.js`: Light/Dark/System preference and independent accent selection.
- `src/styles/forge.css`: active layouts using the original theme tokens and logo.
- `src/siteConfig.js`: contact details and legal date.
- HTML entry points: page-specific SEO metadata and pre-paint appearance initialization.

## Demonstration

The sample runs in the browser with fictional data. Visitors can select any workflow stage with clickable tabs, use arrow keys/Home/End, advance manually, or play to the review checkpoint. The Complete tab shows a pending state until “Approve & complete sample” is selected. Navigation and primary actions are above the workspace so visitors can see which content they control. Requesting revision opens an editable sample response. Blank replies cannot advance; approval records the simulated outcome and reveals the sample action sequence. Restart restores the original sample. No model is called, records updated externally, or message sent.

Earlier multi-example components, screenshot videos, and generated artwork are retained as unused assets. They are not imported by the active site. See `public/media/README.md` for their provenance.

## Preferences

New visitors follow their system's color scheme. The appearance menu offers Light, Dark, and System; explicit Light/Dark choices override OS changes. Accent color is stored independently. Preferences persist in the same browser and restore before paint across the main, service, and legal pages.

## Contact and scheduling

Email enquiries open a populated draft for the visitor to review and send; there is no form submission backend. `calendlyUrl` in `src/siteConfig.js` enables the optional booking area. Calendly loads only after “Choose a time”; a direct link is available as a fallback. Without a valid event URL, primary links lead to the contact section.
