// Optional Vercel function. Credentials stay on the server, never in VITE_* variables.
export function createContactHandler({ env = process.env, send = fetch } = {}) {
  return async function contact(req, res) {
    res.setHeader('Cache-Control', 'no-store')
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      return res.status(405).json({ error: 'Method not allowed' })
    }
    if (!env.RESEND_API_KEY || !env.CONTACT_FROM || !env.CONTACT_TO || !env.CONTACT_ORIGIN) {
      return res.status(503).json({ error: 'Enquiries are unavailable. Please email us directly.' })
    }
    if (req.headers.origin !== env.CONTACT_ORIGIN) return res.status(403).json({ error: 'Origin not allowed' })
    if (!(req.headers['content-type'] || '').startsWith('application/json')) return res.status(415).json({ error: 'Expected JSON' })
    let body
    try {
      const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body)
      if (!raw || Buffer.byteLength(raw) > 12000) return res.status(413).json({ error: 'Request too large' })
      body = typeof req.body === 'string' ? JSON.parse(raw) : req.body
    } catch { return res.status(400).json({ error: 'Invalid request' }) }
    if (!body || typeof body !== 'object' || Array.isArray(body)) return res.status(400).json({ error: 'Invalid request' })
    // Reject bot submissions without forwarding them or claiming delivery.
    if (body.website) return res.status(400).json({ error: 'Invalid request' })
    const { name, email, interest, message } = body
    const interests = ['Discovery and prototype', 'Workflow development', 'Embedded AI engineering']
    if (typeof name !== 'string' || !name.trim() || name.length > 100 || /[\r\n]/.test(name) ||
        typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        !interests.includes(interest) || typeof message !== 'string' || message.trim().length < 10 || message.length > 5000) {
      return res.status(400).json({ error: 'Check the enquiry fields' })
    }
    try {
      const response = await send('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(10000),
        body: JSON.stringify({ from: env.CONTACT_FROM, to: [env.CONTACT_TO], reply_to: email,
          subject: `Website enquiry: ${interest}`, text: `Name: ${name.trim()}\nEmail: ${email}\nInterest: ${interest}\n\n${message.trim()}` }),
      })
      if (!response.ok) return res.status(502).json({ error: 'Enquiry not sent. Please try again or email us.' })
      const result = await response.json()
      if (!result.id) return res.status(502).json({ error: 'Delivery was not confirmed. Please email us.' })
      return res.status(200).json({ ok: true })
    } catch { return res.status(502).json({ error: 'Enquiry not sent. Please try again or email us.' }) }
  }
}
export default createContactHandler()
