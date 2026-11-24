import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import AnalyzerPage from './pages/AnalyzerPage'
import ResultsPage from './pages/ResultsPage'
import ExplainabilityPage from './pages/ExplainabilityPage'
import AboutPage from './pages/AboutPage'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-navy-950">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analyze" element={<AnalyzerPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/explainability" element={<ExplainabilityPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
