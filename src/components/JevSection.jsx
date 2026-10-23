function DecisionGraphic() {
  return <svg className="jev-graphic" viewBox="0 0 780 540" role="img" aria-labelledby="jev-graphic-title jev-graphic-description">
    <title id="jev-graphic-title">Where Jev fits in a customer operations workflow</title>
    <desc id="jev-graphic-description">A customer request and its records enter Jev. A structured routing decision selects a customer update, an investigation, or human review. An illustrative architecture, not a live integration.</desc>
    <defs><pattern id="jev-grid" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="var(--border-strong)"/></pattern><marker id="jev-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)"/></marker></defs>
    <rect width="780" height="540" fill="url(#jev-grid)"/>
    <g fill="none" stroke="var(--accent)" strokeWidth="1.5" markerEnd="url(#jev-arrow)">
      <path d="M196 270H274"/>
      <path d="M456 270H498V130H545"/>
      <path d="M456 270H545"/>
      <path d="M456 270H498V410H545"/>
    </g>
    <g className="jev-svg-card"><rect x="30" y="210" width="166" height="120" rx="5"/><text x="50" y="241" className="jev-svg-label">INPUT</text><text x="50" y="271">Customer request</text><text x="50" y="298" className="jev-svg-muted">+ relevant records</text></g>
    <g className="jev-svg-core"><rect x="274" y="174" width="182" height="192" rx="8"/><text x="300" y="211" className="jev-svg-label">DECISION MODEL</text><text x="299" y="278" className="jev-svg-name">Jev</text><path d="M300 300H430" stroke="var(--border-strong)"/><text x="300" y="329" className="jev-svg-muted">Classify. Choose. Route.</text></g>
    <g className="jev-svg-card"><rect x="545" y="83" width="205" height="94" rx="5"/><circle cx="566" cy="107" r="3" fill="var(--accent)"/><text x="579" y="112" className="jev-svg-label">RECORDS AVAILABLE</text><text x="565" y="145">Prepare an update</text>
    <rect x="545" y="223" width="205" height="94" rx="5"/><circle cx="566" cy="247" r="3" fill="var(--accent)"/><text x="579" y="252" className="jev-svg-label">INFORMATION MISSING</text><text x="565" y="285">Investigate first</text>
    <rect x="545" y="363" width="205" height="94" rx="5"/><circle cx="566" cy="387" r="3" fill="var(--accent)"/><text x="579" y="392" className="jev-svg-label">APPROVAL REQUIRED</text><text x="565" y="425">Hand off to a person</text></g>
    <text x="30" y="508" className="jev-svg-label">ILLUSTRATIVE ARCHITECTURE / HUMAN REVIEW BEFORE ACTION</text>
  </svg>
}

function MobileDecisionGraphic() {
  return <svg className="jev-graphic-mobile" viewBox="0 0 360 490" role="img" aria-label="Customer records enter Jev, which routes the request to an update, investigation or human review. Illustrative architecture.">
    <g fill="none" stroke="var(--accent)" strokeWidth="1.5"><path d="M180 80V115M180 235V260M40 280V410M40 280H60M40 345H60M40 410H60M180 260H40V280"/></g>
    <g className="jev-svg-card"><rect x="55" y="20" width="250" height="60" rx="5"/><text x="75" y="46">Customer request</text><text x="75" y="65" className="jev-svg-muted">+ relevant records</text></g>
    <g className="jev-svg-core"><rect x="90" y="115" width="180" height="120" rx="6"/><text x="110" y="140" className="jev-svg-label">DECISION MODEL</text><text x="108" y="194" className="jev-svg-name">Jev</text><text x="110" y="217" className="jev-svg-muted">Classify. Choose. Route.</text></g>
    <g className="jev-svg-card"><rect x="60" y="260" width="255" height="44" rx="4"/><text x="78" y="287">Prepare an update</text><rect x="60" y="325" width="255" height="44" rx="4"/><text x="78" y="352">Investigate first</text><rect x="60" y="390" width="255" height="44" rx="4"/><text x="78" y="417">Hand off to a person</text></g>
    <text x="25" y="470" className="jev-svg-label">ILLUSTRATIVE / HUMAN REVIEW BEFORE ACTION</text>
  </svg>
}

export default function JevSection() {
  return <section id="jev" className="jev-section page-gutter" aria-labelledby="jev-heading">
    <div className="jev-section-copy"><p className="eyebrow">JEV / DECISION ROUTING</p><h2 id="jev-heading">Route requests to<br/>the right next step.</h2><p className="jev-intro">An update when the records are clear. An investigation when they aren’t. A person when judgement is needed.</p><p>Jev returns structured decisions that software can use to classify requests and choose the next step. We can explore where it fits alongside your existing tools, drafting models, and approval rules.</p><a className="text-link" href="#demo">Try the routing example <span aria-hidden="true">↓</span></a><p className="jev-section-note">A proposed use of Jev. The interactive example uses simulated decisions, with no live model connected.</p></div>
    <figure className="jev-figure"><div className="jev-figure-header"><span>REQUEST → DECISION → NEXT STEP</span><a href="https://typesafe.ai/" target="_blank" rel="noreferrer">Jev by TypeSafe AI ↗</a></div><DecisionGraphic/><MobileDecisionGraphic/><figcaption>Choose a route with Jev. Draft with a language model. Keep people in control of consequential actions.</figcaption></figure>
  </section>
}
