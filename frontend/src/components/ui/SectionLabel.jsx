/**
 * Reusable badge / label component
 */
export default function SectionLabel({ children, className = '' }) {
  return (
    <span className={`section-label ${className}`}>
      {children}
    </span>
  )
}
