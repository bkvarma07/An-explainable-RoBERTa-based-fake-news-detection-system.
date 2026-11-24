import SectionLabel from '../ui/SectionLabel'

const technologies = [
  {
    category: 'Model & ML',
    color: 'from-blue-500/20 to-blue-700/10 border-blue-500/20',
    labelColor: 'text-blue-400',
    items: [
      { name: 'RoBERTa', desc: 'Transformer base model (Hugging Face)' },
      { name: 'PyTorch', desc: 'Deep learning framework' },
      { name: 'Transformers', desc: 'Model & tokenizer loading' },
      { name: 'SHAP / LIME', desc: 'Post-hoc explainability (planned)' },
    ],
  },
  {
    category: 'Backend API',
    color: 'from-violet-500/20 to-violet-700/10 border-violet-500/20',
    labelColor: 'text-violet-400',
    items: [
      { name: 'FastAPI', desc: 'Async REST API framework' },
      { name: 'Pydantic', desc: 'Request validation & serialization' },
      { name: 'Uvicorn', desc: 'ASGI production server' },
      { name: 'Python 3.13', desc: 'Runtime environment' },
    ],
  },
  {
    category: 'Frontend',
    color: 'from-cyan-500/20 to-cyan-700/10 border-cyan-500/20',
    labelColor: 'text-cyan-400',
    items: [
      { name: 'React 18', desc: 'UI component library' },
      { name: 'Vite', desc: 'Build tool & dev server' },
      { name: 'Tailwind CSS', desc: 'Utility-first styling' },
      { name: 'React Router 6', desc: 'Client-side routing' },
    ],
  },
]

export default function TechStackSection() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <SectionLabel className="mb-4">Technology Stack</SectionLabel>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-5 tracking-tight">
            Built on{' '}
            <span className="gradient-text">Proven Tools</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            Every layer of the stack is chosen for performance, transparency, and academic reproducibility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {technologies.map(({ category, color, labelColor, items }) => (
            <div
              key={category}
              className={`rounded-2xl border bg-gradient-to-br ${color} p-6 backdrop-blur-sm`}
            >
              <h3 className={`text-sm font-bold uppercase tracking-widest mb-5 ${labelColor}`}>
                {category}
              </h3>
              <ul className="space-y-3">
                {items.map(({ name, desc }) => (
                  <li key={name} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60 mt-2 flex-shrink-0" />
                    <div>
                      <span className="text-white font-semibold text-sm">{name}</span>
                      <span className="text-slate-400 text-xs ml-2">{desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Architecture note */}
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center">
          <p className="text-slate-400 text-sm leading-relaxed max-w-3xl mx-auto">
            <span className="text-white font-medium">Architecture note: </span>
            The FastAPI backend runs locally on port <code className="text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded text-xs">8000</code> and
            exposes a <code className="text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded text-xs">POST /predict</code> endpoint.
            The React frontend proxies API calls via Vite's dev server, eliminating CORS issues during development.
          </p>
        </div>
      </div>
    </section>
  )
}
