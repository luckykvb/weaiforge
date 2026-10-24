// Single source of truth for brand + contact details.
// Swap these values to rebrand the whole site.

export const siteConfig = {
  brand: 'WeAIForge',
  // One-line positioning used in a few meta spots.
  tagline: 'Agentic AI & forward-deployed engineering',

  contactEmail: 'info@weaiforge.com',
  // Set to your real Calendly event URL to enable on-site scheduling.
  calendlyUrl: 'https://calendly.com/weaiforge-ai/discovery-call',
  // Opens a pre-filled email so the button always works. To use a scheduler
  // instead, set this to your Calendly / Cal.com link.
  bookingUrl:
    'mailto:info@weaiforge.com?subject=' +
    encodeURIComponent('Discovery call request') +
    '&body=' +
    encodeURIComponent(
      "Hi WeAIForge,\n\nI'd like to book a discovery call.\n\nName:\nCompany:\nThe problem we want to solve:\nPreferred times:\n",
    ),

  // Standalone service pages (own URL, own search ranking).
  pages: [{ label: 'AI Agents', href: '/ai-agents' }],

  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
  legalUpdated: 'October 21, 2026',

  social: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/weaiforge/' },
    { label: 'Instagram', href: 'https://www.instagram.com/weaiforge/' },
  ],

  nav: [
    { label: 'Solutions', href: '#solutions' },
    { label: 'Process', href: '#process' },
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ],
}
