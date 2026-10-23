import { useState } from 'react'
import { siteConfig } from '../siteConfig'

export function getCalendlyUrl(value) {
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' || url.hostname !== 'calendly.com' || url.pathname === '/') return null
    return url
  } catch {
    return null
  }
}

export default function CalendlyBooking({ compact = false }) {
  const [opened, setOpened] = useState(false)
  const url = getCalendlyUrl(siteConfig.calendlyUrl)
  if (!url) return null

  return (
    <section id="book" className={`booking-section ${compact ? 'booking-compact' : ''}`} aria-labelledby="booking-title">
      <div>
        {!compact && <p className="eyebrow">LET’S FIND A TIME</p>}
        <h2 id="booking-title">{compact ? 'Prefer a call?' : 'Book a discovery call.'}</h2>
        <p>We’ll discuss the current process, available data, and what a useful prototype could test.</p>
      </div>
      {opened ? (
        <div className="booking-calendar">
          <iframe src={url.toString()} title="Schedule a discovery call with WeAIForge on Calendly" />
          <p className="form-note">Calendar not loading? <a className="text-link" href={url.toString()} target="_blank" rel="noopener noreferrer">Open Calendly in a new tab ↗</a></p>
        </div>
      ) : (
        <div className="booking-launch">
          <button type="button" className="button primary" onClick={() => setOpened(true)}>Choose a time <span aria-hidden="true">↗</span></button>
          <p className="form-note">Loads Calendly’s scheduling calendar. Booking details are handled by Calendly.</p>
          <a className="text-link" href={url.toString()} target="_blank" rel="noopener noreferrer">Or open Calendly in a new tab ↗</a>
        </div>
      )}
    </section>
  )
}
