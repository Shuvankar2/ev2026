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
        <meta name="description" content="ev2026 is an EV MPC (Electric Vehicle Model Predictive Control) research platform and digital twin at IEM Kolkata. Developed by Shuvankar Debnath (suvnkr), simulating Battery-Constrained MPC-ACC with Kalman Filter state estimation." />
        <meta name="keywords" content="EV MPC, ev2026, EV MPC IEM Kolkata, IEM Kolkata EV MPC, Electric Vehicle Model Predictive Control, MPC ACC, shuvankar debnath, suvnkr, IEM Kolkata electrical engineering, EV digital twin" />
        <link rel="canonical" href="https://ev.shuvankar.qzz.io/" />
        <meta property="og:title" content="EV MPC · ev2026 | Battery-Constrained Model Predictive Control · IEM Kolkata" />
        <meta property="og:description" content="EV MPC interactive digital twin developed at IEM Kolkata. Test predictive cruise control vs PID in real-time. Research by Shuvankar Debnath (suvnkr)." />
        <meta property="og:url" content="https://ev.shuvankar.qzz.io/" />
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
