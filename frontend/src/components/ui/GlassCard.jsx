/**
 * Reusable glassmorphic card container
 */
export default function GlassCard({ children, className = '', hover = true }) {
  return (
    <div
      className={`card ${hover ? 'hover:border-blue-500/25 hover:-translate-y-1' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
