// Single source of truth for brand + contact details.
// Swap these values to rebrand the whole site.

export const siteConfig = {
  brand: 'weaiforge',
  // One-line positioning used in a few meta spots.
  tagline: 'AI systems studio',

  contactEmail: 'weaiforge@gmail.com',
  // Opens a pre-filled email so the button always works. To use a scheduler
  // instead, set this to your Calendly / Cal.com link.
  bookingUrl:
    'mailto:weaiforge@gmail.com?subject=' +
    encodeURIComponent('Discovery call request') +
    '&body=' +
    encodeURIComponent(
      "Hi WeAIForge,\n\nI'd like to book a discovery call.\n\nName:\nCompany:\nThe problem we want to solve:\nPreferred times:\n",
    ),

  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
  legalUpdated: 'October 12, 2026',

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
