import { useEffect, useState } from 'react'

const DEFAULT_DRAFT = 'Hi Jamie,\n\nYour shipment missed a connection at the regional sorting hub. The latest shipping record now estimates delivery on Friday, 23 October.\n\nI’m sorry for the delay. We’ll keep this case open until the delivery is confirmed.\n\nNorthline Customer Operations'

const steps = [
  { title: 'Receive', heading: 'A customer asks about a late order.', description: 'An incoming customer email opens a case linked to the order. The workflow starts with a specific request, rather than an open-ended task.', event: 'Customer request linked to order #1042' },
  { title: 'Investigate', heading: 'Check the order and shipment records.', description: 'The sample customer and shipment records reveal a missed connection and a revised delivery date. Source references stay attached to the case.', event: 'Customer and shipment records retrieved' },
  { title: 'Draft', heading: 'Prepare a response using the delivery estimate.', description: 'The proposed response explains the delay and the updated delivery date. It makes no promise of a refund or compensation.', event: 'Customer update prepared for review' },
  { title: 'Review', heading: 'Review the draft before approving.', description: 'Review the message and its supporting records. Approve the sample update or send it back for revision before completing the walkthrough.', event: 'Paused at the approval checkpoint' },
  { title: 'Complete', heading: 'Approval recorded in the sample.', description: 'The sample case records the approval and proposed next action. This demonstration has no external connections and sends no email.', event: 'Approval recorded; sample case marked ready' },
]

export default function OperationsShowcase() {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [revision, setRevision] = useState(false)
  const [draft, setDraft] = useState(DEFAULT_DRAFT)
  const [approved, setApproved] = useState(false)
  const [navigationError, setNavigationError] = useState('')
  const current = step === 4 && !approved ? {
    heading: 'Approve the reply to complete the sample.',
    description: 'Review the draft below, then choose “Approve & complete sample”. You can also return it for revision. Nothing is sent outside this demo.',
    event: 'Final step: awaiting your approval',
  } : step === 3 && approved ? {
    heading: 'Review the approved sample reply.',
    description: 'This reply has already been approved. View completion, or request a revision to reopen the draft and clear its approval.',
    event: 'Viewing the approved sample reply',
  } : steps[step]
  useEffect(() => {
    if (!playing || step >= 3 || (step === 2 && !draft.trim())) return
    const timer = window.setTimeout(() => setStep(s => s + 1), 3500)
    return () => window.clearTimeout(timer)
  }, [playing, step, draft])
  useEffect(() => { if (step >= 3) setPlaying(false) }, [step])

  function goToStep(target) {
    setPlaying(false)
    if (target >= 3 && !draft.trim()) {
      setStep(2)
      setRevision(true)
      setNavigationError('Add a response before moving to review or completion.')
      document.getElementById('workflow-tab-2')?.focus()
      return false
    }
    setNavigationError('')
    setStep(target)
    return true
  }

  function handleTabKey(event, index) {
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End']
    if (!keys.includes(event.key)) return
    event.preventDefault()
    const target = event.key === 'Home' ? 0 : event.key === 'End' ? 4 : (index + (event.key === 'ArrowRight' ? 1 : -1) + steps.length) % steps.length
    const selected = goToStep(target) ? target : 2
    document.getElementById(`workflow-tab-${selected}`)?.focus()
  }

  function approve() {
    if (!draft.trim()) return
    setApproved(true)
    setRevision(false)
    setPlaying(false)
    setNavigationError('')
    setStep(4)
    document.getElementById('workflow-tab-4')?.focus()
  }

  function requestRevision() {
    setApproved(false)
    setRevision(true)
    goToStep(2)
  }

  function restart() {
    setStep(0)
    setPlaying(false)
    setRevision(false)
    setDraft(DEFAULT_DRAFT)
    setApproved(false)
    setNavigationError('')
  }

  return <section id="demo" className="workflow-demo page-gutter">
    <div className="demo-heading"><div><p className="eyebrow">EXAMPLE WORKFLOW</p><h2>From a delivery enquiry<br/>to a reviewed reply.</h2></div><p>An operations team needs to check an order, investigate a delay, and update the customer. Explore how those steps can come together in one workflow.</p></div>
    <div className="demo-toolbar"><div className="demo-disclosure"><span>Concept demonstration</span><p>Fictional records. Runs in your browser; no live model, integrations, or messages.</p></div>{step < 3 && <button className="button secondary" disabled={step === 2 && !draft.trim()} onClick={() => setPlaying(p => !p)}>{playing ? 'Pause sample' : 'Play sample'}</button>}</div>
    <div className="ops-walkthrough">
      <div className="ops-steps" role="tablist" aria-label="Workflow stages">{steps.map((item, i) => <button type="button" role="tab" id={`workflow-tab-${i}`} aria-controls="workflow-panel" aria-selected={i === step} tabIndex={i === step ? 0 : -1} key={item.title} onClick={() => goToStep(i)} onKeyDown={event => handleTabKey(event, i)}><span aria-hidden="true">{i < Math.min(step, 3) || (i === 3 && approved) ? '✓' : `0${i + 1}`}</span>{item.title}</button>)}</div>
      {navigationError && <p className="ops-navigation-error" role="alert">{navigationError}</p>}
      <div id="workflow-panel" role="tabpanel" aria-labelledby={`workflow-tab-${step}`} tabIndex={0}>
      <div className="ops-narrative"><div aria-live="polite"><h3>{current.heading}</h3><p>{current.description}</p></div><div className="ops-controls">
        {step < 3 && <button className="button primary" onClick={() => goToStep(step + 1)} disabled={step === 2 && !draft.trim()}>Next step →</button>}
        {step >= 3 && !approved && <button className="button primary" onClick={approve} disabled={!draft.trim()}>Approve & complete sample</button>}
        {step >= 3 && <button className="button secondary" onClick={requestRevision}>Request revision</button>}
        {step === 3 && approved && <button className="button primary" onClick={() => goToStep(4)}>View completion</button>}
        {step > 0 && <button className="text-link" onClick={restart}>Restart sample</button>}
        {step === 4 && approved && <a className="text-link" href="#contact">Discuss a workflow like this ↗</a>}
      </div></div>
    <div className="ops-workspace">
      <div className="ops-toolbar"><span><b className="status-dot"/> NORTHLINE / SAMPLE OPERATIONS DESK</span><span>CASE EX-1042</span></div>
      <div className="ops-layout">
        <aside className="ops-context" aria-label="Sample case records">
          <div className="ops-record-heading"><span>01 / INCOMING REQUEST</span><span className="ops-badge">Delivery exception</span></div>
          <h3>“Can you check my delivery?”</h3><p className="ops-sender">Jamie Chen · Fictional customer</p>
          <blockquote>My order was due Wednesday, but the tracking hasn’t moved. Can you let me know when it will arrive?</blockquote>
          <div className="ops-source"><span className="ops-record-heading">ORDER RECORD / CRM-1042</span><dl><div><dt>Order</dt><dd>#1042 · Desk accessories</dd></div><div><dt>Original delivery</dt><dd>Wednesday, 21 October</dd></div><div><dt>Case owner</dt><dd>Customer operations</dd></div></dl></div>
          {step >= 1 ? <div className="ops-source ops-source-highlight"><span className="ops-record-heading">SHIPMENT RECORD / SHP-8821</span><dl><div><dt>Latest scan</dt><dd>Regional sorting hub</dd></div><div><dt>Exception</dt><dd>Missed linehaul connection</dd></div><div><dt>Revised estimate</dt><dd>Friday, 23 October</dd></div></dl></div> : <div className="ops-pending">↳ Shipment context appears during investigation.</div>}
        </aside>
        <div className="ops-action">
          <div className="ops-action-header"><span className="ops-record-heading">02 / PROPOSED CUSTOMER UPDATE</span><span className="ops-badge">{approved && step >= 2 ? 'Approved in simulation' : step >= 2 ? 'Draft · Not sent' : 'Awaiting context'}</span></div>
          {step >= 2 ? <div className="ops-message"><p className="ops-subject">Re: Delivery update for order #1042</p>{revision && step === 2 ? <label className="draft-editor">Edit the sample response<textarea aria-label="Edit the sample response" value={draft} onChange={e => { setDraft(e.target.value); setApproved(false); setNavigationError('') }} rows="8"/></label> : <div className="draft-content">{draft}</div>}<div className="ops-citations">SOURCE RECORDS <span>CRM-1042</span><span>SHP-8821</span></div></div> : <div className="ops-empty"><span aria-hidden="true">↳</span><h3>Check the records first.</h3><p>Play the sample or use “Next step” to investigate the enquiry and prepare a response.</p></div>}
          <div className={`ops-gate ${step >= 3 && !approved ? 'ops-gate-active' : ''}`}>
            <div><span className="ops-record-heading">HUMAN APPROVAL</span><p>{approved ? 'Sample approval recorded. No message was sent.' : step >= 3 ? 'Review the reply, then use “Approve & complete sample” above.' : 'External communication requires review.'}</p></div>

          </div>
          {revision && step === 2 && <p className="ops-revision" role="status">Returned to draft. Edit the sample response above, then continue to review.</p>}
        </div>
      </div>
      <div className="ops-event" aria-live="polite"><span className="status-dot"/><span>{current.event}</span><span>{String(step + 1).padStart(2, '0')} / 05</span></div>
      {step === 4 && approved && <details className="ops-history"><summary>View sample action history</summary><ol>{steps.map((s, i) => <li key={s.title}><span>0{i + 1} / {s.title}</span>{s.event}</li>)}</ol><p>Illustrative sequence from this walkthrough. No external actions were executed.</p></details>}
    </div>
      </div>
    </div>
    <p className="demo-production-note"><strong>For a live implementation:</strong> connect your systems, define access and approval rules, evaluate model outputs, and set up monitoring. This sample illustrates the workflow only.</p>
  </section>
}
