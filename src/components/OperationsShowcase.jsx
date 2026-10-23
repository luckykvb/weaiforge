import { useState } from 'react'

const DEFAULT_DRAFT = 'Hi Jamie,\n\nYour shipment missed a connection at the regional sorting hub. The latest shipping record now estimates delivery on Friday, 23 October.\n\nI’m sorry for the delay. We’ll keep this case open until the delivery is confirmed.\n\nNorthline Customer Operations'

const scenarios = [
  { id: 'delay', label: 'Delayed delivery', kind: 'Delivery enquiry', request: 'Can you check my delivery?', message: 'My order was due Wednesday, but the tracking hasn’t moved. Can you let me know when it will arrive?', record: 'Missed linehaul connection', estimate: 'Friday, 23 October', route: 'Prepare delivery update', policy: 'A current delivery estimate is available. Prepare a sourced update; a person must approve it before sending.', action: 'Proposed delivery update', draft: DEFAULT_DRAFT, decision: 'Delivery delay', evidence: 'CRM-1042 + SHP-8821: order matched; revised estimate available.', draftHeading: 'Prepare a response using the delivery estimate.' },
  { id: 'missing', label: 'Missing tracking information', kind: 'Incomplete shipment record', request: 'Has my order shipped?', message: 'My order was due Wednesday. The tracking link does not work. Can you tell me when it will arrive?', record: 'No carrier scan available', estimate: 'Not available', route: 'Request a shipment check', policy: 'There is no verified delivery estimate. Ask the operations team to check with the carrier; do not invent a date.', action: 'Internal investigation request', draft: 'Shipment check needed — order #1042\n\nThe customer reports that their tracking link is unavailable. The order record matches, but SHP-8821 contains no carrier scan or verified delivery estimate.\n\nPlease confirm dispatch and obtain a current carrier update before we give the customer a delivery date.', decision: 'Insufficient shipment information', evidence: 'CRM-1042: order matched. SHP-8821: carrier scan and delivery estimate missing.', draftHeading: 'Ask the operations team for missing information.' },
  { id: 'refund', label: 'Refund request', kind: 'Refund requested', request: 'Can you refund my order?', message: 'My order is late and I no longer need it. Please cancel it and refund the payment.', record: 'Missed linehaul connection', estimate: 'Friday, 23 October', route: 'Escalate for refund review', policy: 'Refund eligibility is not established by these records. A person must check policy and payment status. No refund is promised or issued.', action: 'Refund review handoff', draft: 'Refund review needed — order #1042\n\nJamie Chen has requested cancellation and a refund after a delivery delay. The shipment record estimates delivery on Friday, 23 October.\n\nPlease check cancellation eligibility, payment status and the applicable refund policy before replying. No refund has been promised or issued.', decision: 'Cancellation and refund request', evidence: 'Customer explicitly requests a refund. CRM-1042 and SHP-8821 do not establish refund eligibility.', draftHeading: 'Prepare a handoff for a refund decision.' },
]

const stages = ['Receive', 'Investigate', 'Draft', 'Review', 'Complete']

export default function OperationsShowcase() {
  const [scenarioId, setScenarioId] = useState('delay')
  const scenario = scenarios.find(item => item.id === scenarioId)
  const [step, setStep] = useState(2)
  const [draft, setDraft] = useState(DEFAULT_DRAFT)
  const [editing, setEditing] = useState(false)
  const [approved, setApproved] = useState(false)
  const [error, setError] = useState('')

  function selectScenario(id) {
    setScenarioId(id)
    setDraft(scenarios.find(item => item.id === id).draft)
    setStep(2)
    setEditing(false)
    setApproved(false)
    setError('')
  }

  function navigate(target) {
    if (target >= 3 && !draft.trim()) {
      setError('Add a proposed action before continuing.')
      setEditing(true)
      setStep(2)
      return 2
    }
    setError('')
    setEditing(false)
    setStep(target)
    return target
  }

  function handleTabKey(event, index) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const target = event.key === 'Home' ? 0 : event.key === 'End' ? 4 : (index + (event.key === 'ArrowRight' ? 1 : -1) + 5) % 5
    document.getElementById(`workflow-tab-${navigate(target)}`)?.focus()
  }

  function primaryAction() {
    if (step < 3) return navigate(step + 1)
    if (!approved) {
      if (!draft.trim()) return navigate(3)
      setApproved(true)
      setStep(4)
      setEditing(false)
    } else selectScenario(scenarioId)
  }

  const waitingForApproval = step >= 3 && !approved
  const route = scenarioId === 'delay' ? 'Delivery delay → Prepare an update' : scenarioId === 'missing' ? 'Missing tracking → Ask operations to investigate' : 'Refund requested → Hand off for review'

  return <section id="demo" className="workflow-demo page-gutter quiet-demo">
    <div className="demo-heading"><div><p className="eyebrow">SEE THE WORKFLOW</p><h2>The next step depends<br/>on what you know.</h2></div><p>Try three customer requests. See what the team receives, what happens next, and where a person stays in control.</p></div>
    <p className="quiet-explore-note">Explore the stages in any order. Approval is always a separate action.</p>
    <div className="quiet-workspace">
      <div className="quiet-workspace-header"><span>Customer operations <span className="quiet-case">/ Order #1042</span></span><label>Scenario<select value={scenarioId} onChange={event => selectScenario(event.target.value)}>{scenarios.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label></div>
      <div className="quiet-progress" role="tablist" aria-label="Workflow stages">{stages.map((title, index) => <button type="button" role="tab" key={title} id={`workflow-tab-${index}`} aria-selected={step === index} aria-controls="workflow-panel" tabIndex={step === index ? 0 : -1} onClick={() => navigate(index)} onKeyDown={event => handleTabKey(event, index)}><span aria-hidden="true">{index + 1}</span>{title}</button>)}</div>
      <div id="workflow-panel" role="tabpanel" aria-labelledby={`workflow-tab-${step}`} tabIndex={0}>
        <div className="quiet-columns">
          <div className="quiet-request"><p className="quiet-label">CUSTOMER REQUEST</p><h3>{scenario.request}</h3><p className="quiet-person">Jamie Chen · Sample customer</p><blockquote>{scenario.message}</blockquote><div className="quiet-record"><span>Order #1042 · Desk accessories</span><span>Due Wednesday, 21 October</span></div></div>
          <div className="quiet-output"><div className="quiet-output-heading"><p className="quiet-label">{step < 2 ? 'NEXT ACTION' : scenario.action.toUpperCase()}</p><span className="quiet-status">{approved && step >= 2 ? 'Approved in sample' : step >= 2 ? 'Not sent' : 'Pending'}</span></div>
            {step === 4 && approved && <div className="quiet-completion" role="status"><strong>Sample complete</strong><p>The proposed action is approved in this browser. No message, internal request or refund was executed.</p></div>}
            {step === 3 && !approved && <div className="quiet-checklist"><strong>Before you approve</strong><ul><li>Check the proposed action against the records.</li><li>{scenario.policy}</li></ul></div>}
            {step === 4 && !approved && <p className="quiet-checklist">This action is awaiting approval. Visiting this stage does not complete it.</p>}
            {step >= 2 ? editing ? <label className="quiet-editor">Edit proposed action<textarea aria-label="Edit proposed action" rows="9" value={draft} onChange={event => {setDraft(event.target.value);setApproved(false);setError('')}}/></label> : <div className="quiet-draft">{draft}</div> : <div className="quiet-pending"><h3>{step === 0 ? 'Start with the request.' : scenario.route}</h3><p>{step === 0 ? 'Match the request to the order, then check the shipment record.' : scenario.evidence}</p></div>}
          </div>
        </div>
        <div className="quiet-decision" aria-live="polite"><span className="quiet-decision-dot" aria-hidden="true"/><p>{step === 0 ? 'Request received → Check the records' : route}</p><span className="quiet-label">SIMULATED</span></div>
        <details className="quiet-reason" key={scenarioId}><summary>Why this decision?</summary><div className="quiet-reason-content"><div><h4>What the records show</h4><p>{scenario.evidence}</p><dl><div><dt>Shipment exception</dt><dd>{scenario.record}</dd></div><div><dt>Delivery estimate</dt><dd>{scenario.estimate}</dd></div></dl></div><div><h4>The review rule</h4><p>{scenario.policy}</p><h4>Where Jev fits</h4><p>A live implementation could use Jev to classify the request and choose a route, with a separate language model drafting the text. This sample uses predefined decisions and text; Jev is not connected. <a href="https://typesafe.ai/" target="_blank" rel="noreferrer">About Jev ↗</a></p></div></div></details>
        {error && <p className="quiet-error" role="alert">{error}</p>}
        <div className="quiet-footer"><div className="quiet-review-status" aria-live="polite"><span>{approved && step >= 2 ? 'Approval recorded. Nothing was sent.' : waitingForApproval ? 'Your review is needed before this action can proceed.' : 'A person reviews the proposed action before it proceeds.'}</span>{step >= 2 && <button type="button" className="quiet-edit" onClick={() => {setEditing(value => !value);setApproved(false);setStep(2)}}>{editing ? 'Finish editing' : 'Edit proposed action'}</button>}</div><button type="button" className="button primary" onClick={primaryAction} disabled={!draft.trim() && step >= 2}>{step < 2 ? step === 0 ? 'Check records →' : 'View proposed action →' : step === 2 ? 'Review action →' : approved ? 'Try again ↺' : 'Approve sample action →'}</button></div>
      </div>
    </div>
    <p className="quiet-disclosure">Interactive concept · Fictional records · Simulated decisions; no live Jev integration or external actions.</p>
  </section>
}
