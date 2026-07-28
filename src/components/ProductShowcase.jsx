import Icon from './Icon'

const sparkline = [4, 6, 5, 8, 7, 10, 12]

// Coded UI mockup for the hero's visual slot — floating cards drawn from the
// existing design system so they re-theme automatically instead of a fixed image.
export default function ProductShowcase() {
  return (
    <div className="showcase" aria-hidden="true">
      <div className="showcase__card showcase__card--workflow">
        <div className="showcase__dots">
          <span />
          <span />
          <span />
        </div>
        <p className="showcase__label">workflow.run</p>
        <p className="showcase__pipeline">
          <span>Order</span>
          <span className="showcase__arrow">→</span>
          <span>Triage</span>
          <span className="showcase__arrow">→</span>
          <span>Reply</span>
        </p>
        <div className="showcase__bar">
          <span style={{ width: '82%' }} />
        </div>
      </div>

      <div className="showcase__card showcase__card--agent">
        <span className="showcase__icon">
          <Icon name="agent" size={18} />
        </span>
        <div>
          <p className="showcase__title">Agent</p>
          <p className="showcase__msg">"Resolved ticket #4021 — refund"</p>
        </div>
      </div>

      <div className="showcase__card showcase__card--data">
        <span className="showcase__icon">
          <Icon name="data" size={18} />
        </span>
        <div className="showcase__data-body">
          <p className="showcase__title">Forecast</p>
          <div className="showcase__spark">
            {sparkline.map((h, i) => (
              <span key={i} style={{ height: `${h * 3}px` }} />
            ))}
          </div>
        </div>
        <span className="showcase__delta">+18%</span>
      </div>
    </div>
  )
}
