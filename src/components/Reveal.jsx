import { useReveal } from '../hooks/useReveal'

// Thin wrapper that fades/slides children in on scroll.
// `delay` staggers grouped items (ms). `as` picks the element tag.
export default function Reveal({ children, delay = 0, as: Tag = 'div', className = '', ...rest }) {
  const ref = useReveal()
  const style = delay ? { '--reveal-delay': `${delay}ms` } : undefined
  return (
    <Tag ref={ref} className={`reveal ${className}`.trim()} style={style} {...rest}>
      {children}
    </Tag>
  )
}
