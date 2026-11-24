import { Link } from 'react-router-dom'
import { ArrowRight, Zap, ShieldCheck, FlaskConical } from 'lucide-react'
import GradientOrbs from '../ui/GradientOrbs'

const stats = [
  { label: 'Model Architecture', value: 'RoBERTa', sub: 'Transformer-based' },
  { label: 'Training Tokens', value: '256', sub: 'Max sequence length' },
  { label: 'Task', value: 'Binary', sub: 'Fake vs. Real' },
  { label: 'XAI', value: 'SHAP / LIME', sub: 'Explainability layer' },
]

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16">
      <GradientOrbs />

      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold tracking-widest uppercase mb-8 animate-fade-in">
          <FlaskConical size={12} />
          Academic Research Project — NLP &amp; Explainable AI
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05] mb-6 animate-slide-up">
          Detect Fake News{' '}
          <span className="relative">
            <span className="gradient-text">Intelligently</span>
            <span
              className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-60"
              aria-hidden="true"
            />
          </span>
          <br />
          <span className="text-slate-300 font-light">with Explainable AI</span>
        </h1>

        {/* Subheading */}
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-400 leading-relaxed mb-10 animate-slide-up animation-delay-200">
          Powered by a fine-tuned <strong className="text-slate-200 font-semibold">RoBERTa</strong> transformer model, TruthLens
          analyzes news content and delivers transparent, explainable classification results — not just a verdict.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-slide-up animation-delay-400">
          <Link to="/analyze" className="btn-primary text-base px-8 py-3.5 shadow-xl shadow-blue-900/40">
            <Zap size={18} />
            Analyze an Article
            <ArrowRight size={16} />
          </Link>
          <Link to="/about" className="btn-secondary text-base px-8 py-3.5">
            <ShieldCheck size={18} />
            Learn the Methodology
          </Link>
        </div>

        {/* Stats ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto animate-fade-in animation-delay-600">
          {stats.map(({ label, value, sub }) => (
            <div
              key={label}
              className="glass rounded-xl p-4 text-center border border-white/10"
            >
              <div className="text-xl font-bold gradient-text mb-0.5">{value}</div>
              <div className="text-xs font-semibold text-white/80 mb-0.5">{label}</div>
              <div className="text-[11px] text-slate-500">{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32"
        style={{
          background: 'linear-gradient(to bottom, transparent, #020818)',
        }}
        aria-hidden="true"
      />
    </section>
  )
}
