/**
 * ConfidenceBar — animated horizontal score bar.
 * Props:
 *   label     string  — e.g. "Fake Score"
 *   value     number  — 0–100
 *   color     string  — tailwind gradient class string
 *   textColor string  — tailwind text colour class
 *   delay     number  — CSS transition delay in ms (for staggered entry)
 */
import { useEffect, useState } from 'react'

export default function ConfidenceBar({ label, value, colorFrom, colorTo, textColor, delay = 0 }) {
  const [width, setWidth] = useState(0)

  // Animate the bar on mount
  useEffect(() => {
    const timer = setTimeout(() => setWidth(value), 60 + delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  const rounded = typeof value === 'number' ? value.toFixed(2) : '—'

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-300">{label}</span>
        <span className={`text-sm font-bold tabular-nums ${textColor}`}>{rounded}%</span>
      </div>
      <div
        className="h-2.5 w-full rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.06)' }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${rounded}%`}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${width}%`,
            background: `linear-gradient(to right, ${colorFrom}, ${colorTo})`,
            transition: `width 800ms cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
            boxShadow: `0 0 10px ${colorFrom}60`,
          }}
        />
      </div>
    </div>
  )
}
