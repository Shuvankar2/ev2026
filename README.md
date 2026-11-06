# Battery-Constrained MPC-ACC for Electric Vehicles

> **Undergraduate Research · IEM Kolkata · Electrical Engineering · 2026**  
> **Live Platform**: [https://ev.suvnkr.in](https://ev.suvnkr.in)  
> [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/Shuvankar2/ev2026/blob/main/notebooks/ev_mpc_battery_ml.ipynb)

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
- **Google Colab & ML Toolkit** — export standardized telemetry CSVs and train degradation models in Python/Colab

## Features

- **Live Simulator** — real-time MPC vs PID comparison with adjustable duration (30s–3h), battery conditions, and cruise speed
- **AI Battery Diagnostics** — in-browser machine learning model evaluating State of Health (SOH) degradation, C-rate stress, and internal thermal loss ($I^2 R$)
- **Google Colab Cloud Workbench** — 1-click cloud launcher with interactive coding tasks (`notebooks/ev_mpc_battery_ml.ipynb`)
- **Telemetry CSV Exporter** — export full high-resolution simulation telemetry formatted for Pandas, Scikit-Learn, and PyTorch
- **Scenario Gallery** — pre-computed comparisons across extreme electrochemical conditions
- **How It Works** — interactive breakdown of the Battery Plant, EKF Estimator, and MPC Controller math
- **Accuracy Test Suite** — deterministic validation of engine output against calibrated references
- **Expandable Charts** — Speed (km/h), SOC, Gap, and Current telemetry with full-screen popup
- **Dark/Light Theme** — toggle via settings page

## Developers

**Sagnik Kumar Nath & Shuvankar Debnath**

See [CODEBASE.md](./CODEBASE.md) for full project structure documentation.
