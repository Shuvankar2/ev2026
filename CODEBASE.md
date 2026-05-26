# Codebase Structure

> Complete map of every file in this project — what it does and how it connects.

---

## Root

```
council-build/
├── .gitignore                  # Git ignore rules
├── README.md                   # Project overview & quick start
├── CODEBASE.md                 # ← You are here
├── package.json                # Root shortcut: `npm run dev` → runs frontend
└── frontend/                   # Entire application lives here
```

---

## Frontend

```
frontend/
├── index.html                  # Vite entry HTML — mounts #root
├── package.json                # Dependencies (React, Vite, Tailwind, Recharts, Framer Motion)
├── package-lock.json           # Lockfile
├── vite.config.js              # Vite config — dev server on port 6100
├── tailwind.config.js          # Tailwind theme extensions (animations, colors)
├── postcss.config.js           # PostCSS config for Tailwind
└── src/                        # All source code
```

---

## Source (`frontend/src/`)

### Entry Points

| File | Purpose |
|---|---|
| `main.jsx` | React DOM root — renders `<App />` into `#root` |
| `App.jsx` | Router setup — wraps all pages in `<ThemeProvider>` and `<Layout>`, defines routes |
| `index.css` | Global styles — Tailwind directives, body defaults, glassmorphism utilities |

---

### Pages (`src/pages/`)

Each page is a route in `App.jsx`.

| File | Route | Description |
|---|---|---|
| `LandingPage.jsx` | `/` | Hero section, core argument, animated EV scene, stat cards, pipeline diagram, feature grid, footer CTA, developer credit |
| `SimulatorPage.jsx` | `/simulator` | Full-screen dashboard — left control rail + right pane with road view, charts, math display. Hosts the `useSimulation` hook |
| `HowItWorksPage.jsx` | `/how-it-works` | 4-tab technical breakdown: Battery Plant, EKF Estimator, MPC Controller, Results |
| `ScenarioGalleryPage.jsx` | `/scenarios` | Pre-computes 4 scenarios × 300 ticks, shows gallery cards or comparison view with summary table |
| `SettingsPage.jsx` | `/settings` | Theme toggle (dark/light/system) |

---

### Simulation Engine (`src/engine/`)

| File | Description |
|---|---|
| `simulationEngine.js` | **Core physics engine** — runs entirely client-side. Contains: |
| | • `LeadVehicle` — sinusoidal speed profile with braking events at t=60s and t=180s |
| | • `BatteryModel` — OCV curve, terminal voltage, SOC taper for regen, road load (aero + rolling resistance) |
| | • `EKFFilter` — 1D Extended Kalman Filter with voltage-based measurement correction |
| | • `PIDController` — Standard PID for gap-keeping (the "STD" baseline) |
| | • `MPCSolver` — Numerical gradient MPC with regen constraint penalty |
| | • `SimulationRunner` — Main loop: ticks STD + MPC in parallel, tracks energy, friction events. Supports variable `max_time` (30s–10800s) |
| | • `BATTERY_PROFILES` — Healthy/Degraded/Cold parameter sets |

---

### Hooks (`src/hooks/`)

| File | Used By | Description |
|---|---|---|
| `useSimulation.js` | `SimulatorPage` | React hook wrapping `SimulationRunner`. Manages play/pause/reset, speed multiplier (1×–30×), history array, ghost history, event log. Uses `requestAnimationFrame` loop |
| `useChartStyles.js` | Charts | Returns Recharts theme-aware style objects |
| `useIsDark.js` | Various | Detects current dark/light mode state |
| `useElementWidth.js` | Various | Measures DOM element width via ResizeObserver |

---

### Context (`src/context/`)

| File | Description |
|---|---|
| `ThemeContext.jsx` | React Context for dark/light/system theme. Persists to `localStorage`. Applies `.dark` class to `<html>` |

---

### Components

#### Layout & Navigation (`src/components/`)

| File | Description |
|---|---|
| `Layout.jsx` | Root layout — background grid pattern, glowing blobs, renders `<NavBar />` + children |
| `NavBar.jsx` | Sticky navigation with liquid pill animation, scroll-hide on desktop (shows on scroll up), mobile hamburger menu |
| `LiquidSvgFilter.jsx` | SVG filter for the liquid/gooey pill animation effect |

#### Landing Page (`src/components/landing/`)

| File | Description |
|---|---|
| `LandingHero.jsx` | Hero section with research badge, title, subtitle, CTA buttons, animated EV illustration |
| `LandingCoreArgument.jsx` | "Why MPC?" explanation section |
| `LandingStatCards.jsx` | Animated stat cards showing key metrics (SOC saved, friction avoided, etc.) |
| `LandingPipeline.jsx` | Visual pipeline diagram: Sensor → EKF → Capacity → MPC → Output |
| `LandingFeatureGrid.jsx` | Feature cards grid highlighting platform capabilities |
| `LandingFooterCTA.jsx` | Bottom call-to-action section |
| `LandingDeveloperCredit.jsx` | Developer attribution footer |

#### Animated EV Scene (`src/components/` + `src/components/scene/`)

| File | Description |
|---|---|
| `AnimatedEV.jsx` | Simple animated EV SVG illustration for the hero |
| `AnimatedEVScene.jsx` | Full animated driving scene with parallax layers |
| `scene/SceneCar.jsx` | Car SVG component |
| `scene/SceneRoad.jsx` | Animated road with lane markings |
| `scene/SceneSky.jsx` | Gradient sky with animated clouds |
| `scene/SceneTrees.jsx` | Parallax tree silhouettes |

#### Simulator Dashboard (`src/components/simulator/`)

| File | Description |
|---|---|
| `SimControlRail.jsx` | Left sidebar: SOC slider, cruise speed, duration (30s–3h), battery condition, playback speed (dynamic: 1×/5×/10× or 1×/10×/20× or 1×/15×/30×), play/pause/reset, progress bar |
| `SimRoadView.jsx` | Top-right: animated road with STD and MPC cars showing gap distances |
| `SimChartPanel.jsx` | Bottom-right: Speed (km/h), SOC, Gap, Current charts. Dynamic rolling window (10% of duration), downsampled to 300pts max, expandable full-screen popup |
| `SimMathDisplay.jsx` | Math tab: live EKF/MPC equations with current values |
| `SimKPIStrip.jsx` | KPI bar: friction avoided, SOC saved, MPC SOC%, regen cap |
| `SimEventLog.jsx` | Telemetry log: timestamped friction events |
| `SimAccuracyPanel.jsx` | Modal: runs 4 deterministic test scenarios, compares against calibrated references (±15% tolerance) |
| `accuracyReferenceData.js` | Calibrated expected values for the 4 accuracy test scenarios |

#### How It Works (`src/components/howitworks/`)

| File | Description |
|---|---|
| `PlantTab.jsx` | Battery plant model: OCV curve, terminal voltage, Coulomb counting equations |
| `EKFTab.jsx` | Extended Kalman Filter: predict/correct cycle, innovation, Kalman gain |
| `MPCTab.jsx` | MPC Controller: cost function, constraints, gradient descent solver |
| `ResultsTab.jsx` | Combined results: energy comparison, friction event analysis |
| `HowItWorksShared.jsx` | Shared styled components (equation blocks, section headers) |

#### Scenario Gallery (`src/components/gallery/`)

| File | Description |
|---|---|
| `ScenarioCard.jsx` | Expandable card showing scenario params + results + mini chart |
| `MiniChart.jsx` | Small inline Recharts chart for scenario cards |
| `ComparisonView.jsx` | Side-by-side overlay charts comparing all scenarios |
| `SummaryTable.jsx` | Tabular summary of all scenario metrics |
| `scenarioConfigs.js` | 4 scenario parameter sets + filter/view pill definitions |

#### UI Primitives (`src/components/ui/`)

| File | Description |
|---|---|
| `LiquidPillSelector.jsx` | Animated tab/pill selector with liquid gooey spring animation |
| `ThemeToggle.jsx` | Sun/moon toggle button for dark/light mode |
| `AnimatedNumber.jsx` | Number that animates on change (count-up effect) |
| `Slider.jsx` | Styled range input |
| `StatPill.jsx` | Small stat badge component |

#### Charts (`src/components/charts/`)

| File | Description |
|---|---|
| `SimulationDashboard.jsx` | Legacy dashboard component (used in early development) |
| `ChartCard.jsx` | Styled card wrapper for chart content |
| `CustomTooltip.jsx` | Custom Recharts tooltip with dark mode support |
| `GlowingDot.jsx` | Decorative animated dot |

#### Metrics (`src/components/metrics/`)

| File | Description |
|---|---|
| `MetricCard.jsx` | (root) Large metric display card |
| `MetricBar.jsx` | (root) Horizontal comparison bar |
| `MetricModal.jsx` | Metric detail popup |
| `MetricBreakdownTable.jsx` | Detailed metric table |

#### Other (`src/components/`)

| File | Description |
|---|---|
| `liquidMap.js` | Large lookup table for liquid animation parameters |
| `DiagramStep.jsx` | Pipeline diagram step component |
| `FeatureCard.jsx` | Feature grid card |
| `ScenarioCard.jsx` | (root) Scenario display card |

---

### Utilities (`src/utils/`)

| File | Description |
|---|---|
| `themeColors.js` | Color palette constants for charts (dark/light aware) |
| `format.js` | Number/string formatting helpers |
| `downloadCSV.js` | Export simulation history as CSV file |

---

## Data Flow

```
User clicks "Run" on SimulatorPage
        │
        ▼
  useSimulation hook
        │
        ├─ Creates SimulationRunner (from engine/simulationEngine.js)
        ├─ requestAnimationFrame loop
        │    ├─ runner.tick()  →  advances 1 second of sim time
        │    ├─ STD (PID) path: PID → current → friction check → SOC update → EKF
        │    └─ MPC path:       MPC solver → current → friction check → SOC update → EKF
        │
        ├─ history[]  →  fed to SimChartPanel (Speed/SOC/Gap/Current)
        ├─ currentState  →  fed to SimRoadView, SimKPIStrip, SimMathDisplay
        └─ events[]  →  fed to SimEventLog
```

---

## Deployment (Vercel / Netlify / GitHub Pages)

Since this is a **100% static frontend**, deploy with:

```bash
cd frontend
npm run build    # outputs to frontend/dist/
```

Upload `frontend/dist/` to any static hosting. No environment variables needed.

---

*Last updated: March 2026*
