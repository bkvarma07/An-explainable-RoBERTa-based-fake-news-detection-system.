import HeroSection from '../components/home/HeroSection'
import HowItWorks from '../components/home/HowItWorks'
import FeaturesSection from '../components/home/FeaturesSection'
import TechStackSection from '../components/home/TechStackSection'
import CtaBanner from '../components/home/CtaBanner'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <FeaturesSection />
      <TechStackSection />
      <CtaBanner />
    </>
  )
}
