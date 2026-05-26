import LandingHero from '../components/landing/LandingHero'
import LandingCoreArgument from '../components/landing/LandingCoreArgument'
import AnimatedEVScene from '../components/AnimatedEVScene'
import LandingStatCards from '../components/landing/LandingStatCards'
import LandingPipeline from '../components/landing/LandingPipeline'
import LandingFeatureGrid from '../components/landing/LandingFeatureGrid'
import LandingFooterCTA from '../components/landing/LandingFooterCTA'
import LandingDeveloperCredit from '../components/landing/LandingDeveloperCredit'

export default function LandingPage() {
  return (
    <div className="min-h-screen pb-0 overflow-x-hidden">
      <LandingHero />
      <LandingCoreArgument />
      <AnimatedEVScene />
      <LandingStatCards />
      <LandingPipeline />
      <LandingFeatureGrid />
      <LandingFooterCTA />
      <LandingDeveloperCredit />
    </div>
  )
}
