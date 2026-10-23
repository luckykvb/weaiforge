import { siteConfig } from '../siteConfig'
import PageShell from '../components/PageShell'

const email = siteConfig.contactEmail

const PAGES = {
  privacy: {
    title: 'Privacy Policy',
    intro: `This policy explains what ${siteConfig.brand} ("we", "us") collects when you visit weaiforge.com or contact us, and how we use it.`,
    sections: [
      {
        h: 'Information we collect',
        body: [
          'Information you send us. If you email us or book a discovery call, we receive your email address and whatever you choose to share, such as your name, company and a description of your project.',
          'Technical data. Our hosting provider (Vercel) automatically logs standard request data such as IP address, browser type and pages requested, to deliver and secure the site.',
          'Interactive demonstration. The workflow simulation uses synthetic data and runs in your browser. It does not connect to external business systems.',
        ],
      },
      {
        h: 'What we do not do',
        body: [
          'We do not sell your personal information. The site does not use advertising trackers, and we do not run analytics cookies at the time of writing. If that changes, we will update this page.',
        ],
      },
      {
        h: 'How we use information',
        body: [
          'We use what you send us to reply to your enquiry, scope and deliver work you ask us to do, and keep the site secure and working. We keep correspondence for as long as needed for those purposes or to meet legal obligations.',
        ],
      },
      {
        h: 'Third-party services',
        body: [
          'The site is hosted on Amazon Web Services (S3 and CloudFront). Fonts are loaded from Google Fonts, which means your browser requests them from Google and Google may receive your IP address. When you choose to load the booking calendar, your browser connects to Calendly. Calendly processes scheduling details you submit through its calendar. Email is handled by our email provider. These providers process data under their own privacy policies.',
        ],
      },
      {
        h: 'Client data',
        body: [
          'If we build or operate a system for you, how we handle your business data is set out in our agreement with you. We treat client data as confidential and use it only to deliver the agreed work.',
        ],
      },
      {
        h: 'Your choices',
        body: [
          `You can ask us to access, correct or delete the personal information we hold about you by emailing ${email}. Depending on where you live, you may have further rights under local data-protection law.`,
        ],
      },
      {
        h: 'Changes and contact',
        body: [
          `We may update this policy and will change the date above when we do. Questions: ${email}.`,
        ],
      },
    ],
  },
  terms: {
    title: 'Terms of Service',
    intro: `These terms govern your use of weaiforge.com. By using the site you agree to them. Work we do for clients is covered by a separate written agreement.`,
    sections: [
      {
        h: 'Use of the site',
        body: [
          'You may browse and share the site for lawful purposes. Do not attempt to disrupt it, probe it for vulnerabilities without permission, or scrape it in a way that harms its operation.',
        ],
      },
      {
        h: 'Information only',
        body: [
          'The content here describes our services and illustrative workflows. It is provided for information, is not a binding offer, and does not create a client relationship. A project begins only when we both agree a scope and terms in writing.',
        ],
      },
      {
        h: 'Intellectual property',
        body: [
          `The site's text, design, logo and graphics belong to ${siteConfig.brand} or its licensors. Third-party names and trademarks mentioned belong to their owners. You may not copy or reuse our content without permission, except for brief quotation with attribution.`,
        ],
      },
      {
        h: 'No warranty',
        body: [
          'The site is provided "as is". We aim to keep it accurate and available but do not promise it will be error-free or uninterrupted.',
        ],
      },
      {
        h: 'Limitation of liability',
        body: [
          'To the extent permitted by law, we are not liable for any indirect or consequential loss arising from your use of the site or reliance on its content.',
        ],
      },
      {
        h: 'Links to other sites',
        body: [
          'The site may link to third-party sites such as social profiles. We do not control them and are not responsible for their content or practices.',
        ],
      },
      {
        h: 'Changes and contact',
        body: [
          `We may update these terms and will change the date above when we do. Continued use means you accept the updated terms. Questions: ${email}.`,
        ],
      },
    ],
  },
}

export default function Legal({ page }) {
  const doc = PAGES[page]
  return (
    <PageShell>
      <main className="container legal">
        <p className="eyebrow">Legal</p>
        <h1 className="legal__title">{doc.title}</h1>
        <p className="legal__meta">Last updated: {siteConfig.legalUpdated}</p>
        <p className="legal__intro">{doc.intro}</p>

        {doc.sections.map((s) => (
          <section key={s.h} className="legal__section">
            <h2>{s.h}</h2>
            {s.body.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </section>
        ))}
      </main>
    </PageShell>
  )
}
