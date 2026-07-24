import { Suspense, lazy } from 'react'

// Lazy-load the Spline runtime so the heavy WebGL bundle is only fetched
// when this component actually renders (keeps initial load fast).
const Spline = lazy(() => import('@splinetool/react-spline'))

export function SplineScene({ scene, className = '' }) {
  return (
    <Suspense
      fallback={
        <div className="spline-fallback">
          <span className="spline-loader" aria-hidden="true" />
        </div>
      }
    >
      <Spline scene={scene} className={className} />
    </Suspense>
  )
}
