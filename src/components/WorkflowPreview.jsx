import { useEffect, useState } from 'react'

const examples = [
  {
    id: 'operations', label: 'Customer operations', icon: '↗', title: 'An answer, without the chase.',
    description: 'Bring the order, shipment, and customer context into one place. Prepare the update. Let your team make the final call.',
    inputLabel: 'CUSTOMER REQUEST', input: '“Where is my order?”', reference: 'Order #1042 · Sample customer',
    sources: ['Order record', 'Shipment tracking', 'Customer history'],
    actions: ['Match the customer and order', 'Check the latest delivery estimate', 'Prepare a sourced customer update'],
    outputLabel: 'PROPOSED CUSTOMER UPDATE', output: 'Your order is now expected Friday.',
    body: 'The shipment missed a connection at the regional hub. We’ve prepared an update using the latest shipping record.',
    review: 'Review delivery date and wording',
  },
  {
    id: 'documents', label: 'Document workflows', icon: '▤', title: 'From incoming file to useful information.',
    description: 'Extract the details, check them against your records, and put the exceptions in front of the right person.',
    inputLabel: 'INCOMING DOCUMENT', input: 'Invoice INV-2084.pdf', reference: 'Sample supplier · 2 pages',
    sources: ['Invoice PDF', 'Purchase order', 'Supplier record'],
    actions: ['Extract supplier and line items', 'Compare against the purchase order', 'Flag the quantity mismatch'],
    outputLabel: 'EXCEPTION READY FOR REVIEW', output: 'One line item needs a closer look.',
    body: 'The sample invoice lists 24 units; the purchase order lists 20. Supplier and reference fields match.',
    review: 'Review the flagged line item',
  },
  {
    id: 'research', label: 'Knowledge & research', icon: '⌕', title: 'Answers your team can trace.',
    description: 'Turn scattered internal information into a focused answer with source references and a clear next step.',
    inputLabel: 'TEAM QUESTION', input: '“What is our returns policy?”', reference: 'Sample internal knowledge request',
    sources: ['Policy handbook', 'Returns guide', 'Support playbook'],
    actions: ['Find the relevant source sections', 'Compare the policy and exceptions', 'Prepare an answer with references'],
    outputLabel: 'ANSWER WITH SOURCE REFERENCES', output: 'A clear answer. The sources alongside it.',
    body: 'The sample policy allows returns within 30 days. Custom items require a separate review. References are attached for verification.',
    review: 'Check sources and policy exceptions',
  },
]

export default function WorkflowPreview() {
  const [selected, setSelected] = useState(0)
  const [stage, setStage] = useState(0)
  const [running, setRunning] = useState(false)
  const example = examples[selected]

  useEffect(() => {
    if (!running || stage >= 3) return
    const timer = window.setTimeout(() => setStage(s => s + 1), 850)
    return () => window.clearTimeout(timer)
  }, [running, stage])
  useEffect(() => { if (stage >= 3) setRunning(false) }, [stage])

  function choose(i) { setSelected(i); setStage(0); setRunning(false) }
  function reset() { setStage(0); setRunning(false) }

  return <div className="product-lab" id="possibilities">
    <div className="lab-selector" aria-label="Choose a sample workflow">{examples.map((item, i) => <button key={item.id} aria-pressed={selected === i} onClick={() => choose(i)}><span aria-hidden="true">{item.icon}</span>{item.label}<span className="lab-selector-arrow" aria-hidden="true">↗</span></button>)}</div>
    <div className="lab-window">
      <div className="lab-topbar"><span><b className="status-dot"/> WEAIFORGE / WORKSPACE</span><span className="lab-concept">CONCEPT DEMO</span></div>
      <div className="lab-request"><div className="lab-request-icon" aria-hidden="true">{example.icon}</div><div><small>{example.inputLabel}</small><h3>{example.input}</h3><p>{example.reference}</p></div><span className="lab-case-number">01</span></div>
      <div className="lab-body">
        <div className="lab-trace"><p className="lab-label">CONTEXT → ACTION</p><ol>{example.actions.map((action, i) => <li key={action} className={stage > i ? 'is-done' : stage === i && running ? 'is-running' : ''}><span>{stage > i ? '✓' : `0${i + 1}`}</span><div>{action}<small>{stage > i ? 'Sample step complete' : stage === i && running ? 'Working through the sample…' : 'Ready in this walkthrough'}</small></div></li>)}</ol><div className="lab-sources">{example.sources.map(s => <span key={s}>{s}</span>)}</div></div>
        <div className="lab-result"><p className="lab-label">{example.outputLabel}</p><div className={`lab-result-copy ${stage >= 3 ? 'is-ready' : ''}`}><span className="lab-result-symbol" aria-hidden="true">{stage === 4 ? '✓' : '↳'}</span><h4>{stage === 4 ? 'Sample review recorded.' : example.output}</h4><p>{stage === 4 ? 'The walkthrough is complete. No external action was taken.' : example.body}</p></div><div className="lab-review"><span className="lab-label">{stage === 4 ? 'REVIEW COMPLETE' : 'HUMAN CHECKPOINT'}</span><p>{example.review}</p></div></div>
      </div>
      <div className="lab-bottom"><span aria-live="polite">{stage === 4 ? 'Sample complete · No external action' : stage === 3 ? 'Ready for your review' : running ? 'Stepping through the sample' : 'Preview the outcome. Then try the steps.'}</span>{stage === 0 && !running ? <button className="button primary" onClick={() => setRunning(true)}>Run the sample <span aria-hidden="true">↗</span></button> : stage === 3 ? <button className="button primary" onClick={() => setStage(4)}>Approve sample <span aria-hidden="true">✓</span></button> : <button className="text-link" onClick={reset}>{running ? 'Stop & reset' : 'Try again'} ↶</button>}</div>
    </div>
    <div className="lab-caption"><p>Local simulation · Fictional data · No live AI</p><span>DESIGNED AROUND THE WAY YOU WORK</span></div>
    <div className="lab-description" aria-live="polite"><h3>{example.title}</h3><p>{example.description}</p></div>
  </div>
}
