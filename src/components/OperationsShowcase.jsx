import { useEffect, useState } from 'react'

const steps = [
  { title: 'Receive', heading: 'One exception. A clear starting point.', description: 'An incoming customer email opens a case linked to the order. The workflow starts with a specific request, rather than an open-ended task.', event: 'Customer request linked to order #1042' },
  { title: 'Investigate', heading: 'Bring the scattered context together.', description: 'The sample customer and shipment records reveal a missed connection and a revised delivery date. Source references stay attached to the case.', event: 'Customer and shipment records retrieved' },
  { title: 'Draft', heading: 'Prepare an answer grounded in the records.', description: 'The proposed response explains the delay and the updated delivery date. It makes no promise of a refund or compensation.', event: 'Customer update prepared for review' },
  { title: 'Review', heading: 'The decision stays with a person.', description: 'Review the message and its supporting records. Approve the sample update or send it back for revision before completing the walkthrough.', event: 'Paused at the approval checkpoint' },
  { title: 'Complete', heading: 'A reviewed update. A traceable outcome.', description: 'The sample case records the approval and proposed next action. This demonstration has no external connections and sends no email.', event: 'Approval recorded; sample case marked ready' },
]

export default function OperationsShowcase() {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [revision, setRevision] = useState(false)

  useEffect(() => {
    if (!playing || step >= 3) return
    const timer = window.setTimeout(() => setStep(s => s + 1), 3500)
    return () => window.clearTimeout(timer)
  }, [playing, step])
  useEffect(() => { if (step >= 3) setPlaying(false) }, [step])

  function restart() { setStep(0); setPlaying(false); setRevision(false) }

  return <section id="demo" className="section-block operations-showcase">
    <div className="section-heading">
      <div><p className="eyebrow">01 / A CLOSER LOOK</p><h2>A delayed order.<br/><span>A better way to respond.</span></h2></div>
      <p>Follow a request from the inbox to a reviewed customer update. See the context, the proposed action, and the point where a person takes control.</p>
    </div>
    <figure id="workflow-film" className="workflow-film">
      <div className="film-heading"><span>PRODUCT WALKTHROUGH</span><span>00:20 / SAMPLE WORKFLOW</span></div>
      <video controls playsInline preload="none" poster="/media/order-workflow-poster.jpg" aria-label="Twenty-second screenshot walkthrough of the actual concept interface, showing investigation, drafting, review, and handover">
        <source src="/media/order-workflow.mp4" type="video/mp4"/>
        <track kind="captions" src="/media/order-workflow.vtt" srcLang="en" label="English"/>
        Your browser does not support embedded video. <a href="/media/order-workflow.mp4">Download the product walkthrough.</a>
      </video>
      <figcaption><span>One request. Connected context. A person in control.</span><span>Actual demo screenshots · Sample data · No audio</span></figcaption>
    </figure>
    <details className="interactive-explorer"><summary><span><small>GO A LEVEL DEEPER</small>Try the interactive workflow</span><span className="explorer-plus" aria-hidden="true">+</span></summary>
    <div className="showcase-disclosure"><span className="outline-label">CONCEPT DEMONSTRATION</span><p>Fictional company and sample data · Browser simulation · No live AI or external actions</p></div>
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
          <div className="ops-action-header"><span className="ops-record-heading">02 / PROPOSED CUSTOMER UPDATE</span><span className="ops-badge">{step === 4 ? 'Approved in simulation' : step >= 2 ? 'Draft · Not sent' : 'Awaiting context'}</span></div>
          {step >= 2 ? <div className="ops-message"><p className="ops-subject">Re: Delivery update for order #1042</p><p>Hi Jamie,</p><p>Your shipment missed a connection at the regional sorting hub. The latest shipping record now estimates delivery on <strong>Friday, 23 October</strong>.</p><p>I’m sorry for the delay. We’ll keep this case open until the delivery is confirmed.</p><p>Northline Customer Operations</p><div className="ops-citations">SOURCE RECORDS <span>CRM-1042</span><span>SHP-8821</span></div></div> : <div className="ops-empty"><span aria-hidden="true">↳</span><h3>Context before action.</h3><p>The customer update will appear once the sample records have been checked.</p></div>}
          <div className={`ops-gate ${step === 3 ? 'ops-gate-active' : ''}`}>
            <div><span className="ops-record-heading">HUMAN APPROVAL</span><p>{step === 4 ? 'Sample approval recorded. No message was sent.' : step === 3 ? 'Check the delivery date and wording before approving.' : 'External communication requires review.'}</p></div>
            {step === 3 && <div className="ops-review-buttons"><button className="button primary" onClick={() => { setStep(4); setRevision(false) }}>Approve sample update ↗</button><button className="text-link" onClick={() => { setStep(2); setRevision(true) }}>Request revision ↶</button></div>}
          </div>
          {revision && step === 2 && <p className="ops-revision" role="status">Returned to draft. In production, reviewer feedback would guide a revised response. This sample draft is read-only.</p>}
        </div>
      </div>
      <div className="ops-event" aria-live="polite"><span className="status-dot"/><span>{steps[step].event}</span><span>{String(step + 1).padStart(2, '0')} / 05</span></div>
      {step === 4 && <details className="ops-history"><summary>View sample action history</summary><ol>{steps.map((s, i) => <li key={s.title}><span>0{i + 1} / {s.title}</span>{s.event}</li>)}</ol><p>Illustrative sequence from this walkthrough. No external actions were executed.</p></details>}
    </div>
    <div className="ops-walkthrough">
      <ol className="ops-steps" aria-label="Workflow progress">{steps.map((s, i) => <li key={s.title} aria-current={i === step ? 'step' : undefined} className={i <= step ? 'is-reached' : ''}><span>{i < step ? '✓' : `0${i + 1}`}</span>{s.title}</li>)}</ol>
      <div className="ops-narrative" aria-live="polite"><div><h3>{steps[step].heading}</h3><p>{steps[step].description}</p></div><div className="ops-controls">
        {step < 3 && <><button className="button primary" onClick={() => { setPlaying(false); setStep(s => s + 1) }}>Next step →</button><button className="text-link" onClick={() => setPlaying(p => !p)}>{playing ? 'Pause walkthrough' : 'Play walkthrough'}</button></>}
        {step > 0 && <button className="text-link" onClick={restart}>Restart ↶</button>}
        {step === 3 && <span className="ops-control-note">Review the draft above to continue.</span>}
        {step === 4 && <a className="button primary" href="#contact">Discuss a workflow like this ↗</a>}
      </div></div>
    </div>
    </details>
    <div className="ops-scope"><div><p className="eyebrow">WHAT THIS DEMONSTRATES</p><p>Record retrieval, a grounded draft, a review checkpoint, and an action history in one workflow.</p></div><div><p className="eyebrow">WHAT A LIVE BUILD NEEDS</p><p>Your CRM and shipping integrations, identity and permissions, model evaluation, delivery monitoring, and agreed escalation rules.</p></div></div>
  </section>
}
