import { Helmet } from 'react-helmet-async'
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
      <Helmet>
        <title>EV MPC · ev2026 | Battery-Constrained Model Predictive Control · IEM Kolkata</title>
        <meta name="description" content="Interactive digital twin for Battery-Constrained Model Predictive Adaptive Cruise Control (EV MPC) in Electric Vehicles. Models electrochemical battery dynamics, Kalman filter state estimation, and predictive regen optimization to eliminate friction braking and prevent battery degradation." />
        <meta name="keywords" content="EV MPC, ev2026, ev.suvnkr.in, Shuvankar Debnath, SUVNKR, suvnkr, shuvankar, debnath, EV MPC IEM Kolkata, IEM Kolkata EV MPC, Electric Vehicle Model Predictive Control, MPC ACC, IEM Kolkata electrical engineering, EV digital twin, regenerative braking MPC" />
        <meta name="author" content="Shuvankar Debnath (SUVNKR)" />
        <link rel="canonical" href="https://ev.suvnkr.in/" />
        <meta property="og:title" content="EV MPC · ev2026 | Battery-Constrained Model Predictive Control · IEM Kolkata" />
        <meta property="og:description" content="Interactive digital twin for Battery-Constrained Model Predictive Adaptive Cruise Control (EV MPC) in Electric Vehicles. Eliminates friction braking and optimizes battery degradation via real-time receding horizon control." />
        <meta property="og:url" content="https://ev.suvnkr.in/" />
      </Helmet>
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
