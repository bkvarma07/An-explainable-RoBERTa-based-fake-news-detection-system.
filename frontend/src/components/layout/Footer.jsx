import { NavLink } from 'react-router-dom'
import { Zap, Github, ExternalLink, Heart } from 'lucide-react'

const footerLinks = {
  Platform: [
    { label: 'Home', to: '/' },
    { label: 'News Analyzer', to: '/analyze' },
    { label: 'Results', to: '/results' },
    { label: 'Explainability', to: '/explainability' },
  ],
  Project: [
    { label: 'About', to: '/about' },
    { label: 'Methodology', to: '/about#methodology' },
    { label: 'Model Details', to: '/about#model' },
    { label: 'Dataset', to: '/about#dataset' },
  ],
  Technology: [
    { label: 'RoBERTa', href: 'https://huggingface.co/roberta-base' },
    { label: 'FastAPI', href: 'https://fastapi.tiangolo.com' },
    { label: 'React + Vite', href: 'https://vitejs.dev' },
    { label: 'Tailwind CSS', href: 'https://tailwindcss.com' },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <NavLink to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                <Zap size={18} className="text-white" />
              </div>
              <span className="text-lg font-bold text-white">TruthLens</span>
            </NavLink>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              An academic research project exploring explainable AI for automated fake news detection using transformer-based models.
            </p>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <Github size={16} />
              View on GitHub
              <ExternalLink size={12} />
            </a>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-white font-semibold text-sm mb-4 tracking-wide">{title}</h3>
              <ul className="space-y-3">
                {links.map(({ label, to, href }) => (
                  <li key={label}>
                    {to ? (
                      <NavLink
                        to={to}
                        className="text-slate-400 hover:text-white text-sm transition-colors duration-200"
                      >
                        {label}
                      </NavLink>
                    ) : (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-white text-sm transition-colors duration-200 inline-flex items-center gap-1"
                      >
                        {label}
                        <ExternalLink size={10} />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs">
            © 2024 TruthLens — Academic Research Project. For educational purposes only.
          </p>
          <p className="text-slate-500 text-xs flex items-center gap-1.5">
            Built with <Heart size={12} className="text-rose-500" /> using RoBERTa &amp; FastAPI
          </p>
        </div>
      </div>
    </footer>
  )
}
