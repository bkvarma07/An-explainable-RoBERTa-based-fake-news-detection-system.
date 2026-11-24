import { Link } from 'react-router-dom'
import { ArrowRight, Zap } from 'lucide-react'

export default function CtaBanner() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        {/* Background glow behind the card */}
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-40"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(59,130,246,0.3) 0%, rgba(139,92,246,0.2) 50%, transparent 80%)',
            filter: 'blur(40px)',
          }}
          aria-hidden="true"
        />

        <div className="relative rounded-3xl border border-white/10 p-12 sm:p-16 overflow-hidden"
          style={{ background: 'rgba(10,22,40,0.8)', backdropFilter: 'blur(20px)' }}
        >
          {/* Decorative corner accents */}
          <div className="pointer-events-none absolute top-0 left-0 w-32 h-32 opacity-30"
            style={{ background: 'radial-gradient(circle at top left, rgba(59,130,246,0.5), transparent 70%)' }}
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute bottom-0 right-0 w-32 h-32 opacity-30"
            style={{ background: 'radial-gradient(circle at bottom right, rgba(139,92,246,0.5), transparent 70%)' }}
            aria-hidden="true"
          />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-semibold tracking-widest uppercase mb-6">
              <Zap size={11} />
              Ready to Analyze
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-5 tracking-tight leading-tight">
              Try the{' '}
              <span className="gradient-text">News Analyzer</span>
              <br />right now
            </h2>

            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Paste any news article and get an AI-powered classification with
              probability scores — in seconds. No sign-up required.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/analyze"
                className="btn-primary text-base px-10 py-4 shadow-xl shadow-blue-900/40"
              >
                <Zap size={18} />
                Start Analyzing
                <ArrowRight size={16} />
              </Link>
              <Link to="/about" className="btn-secondary text-base px-10 py-4">
                Read the Research
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
