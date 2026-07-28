import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

// Mouse-following radial glow. Adapted from ibelick/spotlight:
// - Tailwind utility classes -> inline style + a plain CSS class
// - listener cleanup fixed (original leaked mouseenter/mouseleave handlers)
export function Spotlight({
  className = '',
  size = 320,
  color = 'rgba(181, 82, 46, 0.22)',
  springOptions = { bounce: 0 },
}) {
  const containerRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [parentElement, setParentElement] = useState(null)

  const mouseX = useSpring(0, springOptions)
  const mouseY = useSpring(0, springOptions)

  const spotlightLeft = useTransform(mouseX, (x) => `${x - size / 2}px`)
  const spotlightTop = useTransform(mouseY, (y) => `${y - size / 2}px`)

  useEffect(() => {
    if (!containerRef.current) return
    const parent = containerRef.current.parentElement
    if (parent) {
      parent.style.position = 'relative'
      parent.style.overflow = 'hidden'
      setParentElement(parent)
    }
  }, [])

  const handleMouseMove = useCallback(
    (event) => {
      if (!parentElement) return
      const { left, top } = parentElement.getBoundingClientRect()
      mouseX.set(event.clientX - left)
      mouseY.set(event.clientY - top)
    },
    [mouseX, mouseY, parentElement],
  )

  useEffect(() => {
    if (!parentElement) return
    const onEnter = () => setIsHovered(true)
    const onLeave = () => setIsHovered(false)

    parentElement.addEventListener('mousemove', handleMouseMove)
    parentElement.addEventListener('mouseenter', onEnter)
    parentElement.addEventListener('mouseleave', onLeave)

    return () => {
      parentElement.removeEventListener('mousemove', handleMouseMove)
      parentElement.removeEventListener('mouseenter', onEnter)
      parentElement.removeEventListener('mouseleave', onLeave)
    }
  }, [parentElement, handleMouseMove])

  return (
    <motion.div
      ref={containerRef}
      aria-hidden="true"
      className={`spotlight ${className}`.trim()}
      style={{
        width: size,
        height: size,
        left: spotlightLeft,
        top: spotlightTop,
        opacity: isHovered ? 1 : 0,
        background: `radial-gradient(circle at center, ${color}, transparent 72%)`,
      }}
    />
  )
}
