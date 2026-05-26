# Battery-Constrained MPC-ACC for Electric Vehicles

> **Undergraduate Research · IEM Kolkata · Electrical Engineering · 2026**

An interactive digital twin that visualizes Battery-Constrained Model Predictive Adaptive Cruise Control (MPC-ACC) for Electric Vehicles using Extended Kalman Filter state estimation — entirely in the browser with no backend required.

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:6100` in your browser.

## Tech Stack

- **React 18** + **Vite** — fast HMR development
- **Tailwind CSS** — utility-first styling with dark/light mode
- **Framer Motion** — animations and transitions
- **Recharts** — real-time simulation telemetry charts
- **100% Client-Side** — the full MPC/EKF/PID simulation engine runs in JavaScript, no server needed

## Features

- **Live Simulator** — real-time MPC vs PID comparison with adjustable duration (30s–3h), battery conditions, and cruise speed
- **Scenario Gallery** — pre-computed comparisons across extreme electrochemical conditions
- **How It Works** — interactive breakdown of the Battery Plant, EKF Estimator, and MPC Controller math
- **Accuracy Test Suite** — deterministic validation of engine output against calibrated references
- **Expandable Charts** — Speed (km/h), SOC, Gap, and Current telemetry with full-screen popup
- **Dark/Light Theme** — toggle via settings page

## Developers

**Sagnik Kumar Nath & Shuvankar Debnath**

See [CODEBASE.md](./CODEBASE.md) for full project structure documentation.
