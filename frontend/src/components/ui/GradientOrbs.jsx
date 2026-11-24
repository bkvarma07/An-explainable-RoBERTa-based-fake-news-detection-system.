/**
 * Animated gradient background orbs used as decorative elements
 */
export default function GradientOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Top-left orb */}
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20 animate-pulse-slow"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.6) 0%, rgba(139,92,246,0.3) 50%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      {/* Top-right orb */}
      <div
        className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full opacity-15 animate-pulse-slow animation-delay-400"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.5) 0%, rgba(6,182,212,0.2) 50%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      {/* Bottom-center orb */}
      <div
        className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-10 animate-pulse-slow animation-delay-200"
        style={{
          background: 'radial-gradient(ellipse, rgba(59,130,246,0.4) 0%, rgba(139,92,246,0.2) 50%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
    </div>
  )
}
