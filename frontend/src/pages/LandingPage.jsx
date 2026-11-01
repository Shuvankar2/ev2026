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
        <title>EV MPC · IEM Kolkata | ev2026 Model Predictive Control</title>
        <meta name="description" content="EV MPC (Model Predictive Control) digital twin developed at IEM Kolkata by Shuvankar Debnath (suvnkr). Interactive simulation comparing battery-aware MPC against PID cruise control." />
        <meta name="keywords" content="ev mpc shuvankar, ev mpc, ev mpc suvnkr, suvnkr, ev mpc iem kolkata, ev mpc iem, shuvankar debnath, ev mpc shuvankar debnath, iem kolkata ev mpc, ev2026, ev.suvnkr.in, Shuvankar Debnath, SUVNKR, Electric Vehicle Model Predictive Control, MPC ACC, IEM Kolkata electrical engineering, EV digital twin, regenerative braking MPC" />
        <meta name="author" content="Shuvankar Debnath (SUVNKR)" />
        <link rel="canonical" href="https://ev.suvnkr.in/" />
        <meta property="og:title" content="EV MPC · IEM Kolkata | Battery-Constrained Model Predictive Control" />
        <meta property="og:description" content="EV MPC (Model Predictive Control) digital twin developed at IEM Kolkata by Shuvankar Debnath (suvnkr). Eliminates friction braking and optimizes battery degradation via real-time receding horizon control." />
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
