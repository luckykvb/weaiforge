# WeAIForge

Focused company website for custom AI workflows and engineering, built with React and Vite. The demonstration needs no live model. Optional server-side enquiry delivery is prepared but disabled by default.

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

The sample runs in the browser with fictional data. Visitors can select any stage through clickable tabs or arrow keys/Home/End. It opens with a proposed action visible, uses three predefined scenarios and provides distinct investigation, review and completion states. The final stage awaits explicit approval. Editing clears approval, switching scenarios resets the draft, and blank actions cannot proceed. No model is called and no external records or messages are changed.

Earlier multi-example components, screenshot videos, and generated artwork are retained as unused assets. They are not imported by the active site. See `public/media/README.md` for their provenance.

## Preferences

New visitors follow their system's color scheme. The appearance menu offers Light, Dark, and System; explicit Light/Dark choices override OS changes. Accent color is stored independently. Preferences persist in the same browser and restore before paint across the main, service, and legal pages.

## Contact and scheduling

The default contact section offers direct email and optional scheduling. Direct form delivery is available only after configuring the optional backend described below. `calendlyUrl` in `src/siteConfig.js` enables the optional booking area. Calendly loads only after “Choose a time”; a direct link is available as a fallback. Without a valid event URL, primary links lead to the contact section.

## Optional direct enquiry delivery

The default contact area offers scheduling and direct email, with no pretend submission form. The prepared direct form is disabled until hosting is configured. For a Vercel deployment, `api/contact.js` can send to a fixed inbox through Resend's email API (https://resend.com/docs/api-reference/emails/send-email).

Server-only hosting environment variables:
- `RESEND_API_KEY`: sending key from your chosen Resend account.
- `CONTACT_FROM`: sender address on your verified sending domain.
- `CONTACT_TO`: your receiving inbox.
- `CONTACT_ORIGIN`: exact public origin, such as `https://weaiforge.com` (no trailing slash).

Once delivery is configured and tested in staging, set `VITE_CONTACT_ENABLED=true` and rebuild. Never put credentials in `VITE_*` variables. Vite alone does not serve the function; use a Vercel preview to test it end to end. Configure hosting-level rate limits before enabling a public form. An origin check and honeypot are included, but are not a substitute for rate limiting. Review privacy disclosures for the chosen provider before launch. A successful response means the email provider accepted the enquiry, not guaranteed inbox delivery.

Run `node --test tests/contact.test.js` for mocked validation and delivery-failure checks; these do not send email. No account is created or email service activated by this code.
