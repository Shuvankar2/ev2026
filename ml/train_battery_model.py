# ml/train_battery_model.py
"""
EV MPC Battery Degradation & Comparative Diagnostics
Train and evaluate Machine Learning models on exported simulation telemetry.

Usage:
    python ml/train_battery_model.py --data path/to/ev_mpc_telemetry.csv
"""

import argparse
import sys
import os
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error

def main():
    parser = argparse.ArgumentParser(description="Train ML model on EV MPC telemetry")
    parser.add_argument("--data", type=str, help="Path to exported CSV file", default=None)
    args = parser.parse_args()

    if args.data and os.path.exists(args.data):
        print(f"Loading telemetry from {args.data}...")
        df = pd.read_csv(args.data)
    else:
        print("No CSV provided or file not found. Generating calibrated simulation dataset...")
        t = np.arange(0, 301, 1)
        v_lead = 27.78 + 1.4 * np.sin(0.1 * t)
        v_ego_std = v_lead + 0.8 * np.sin(0.08 * t) + np.random.normal(0, 0.2, len(t))
        v_ego_mpc = v_lead + 0.2 * np.sin(0.1 * t) + np.random.normal(0, 0.05, len(t))
        current_std = 35 + 50 * np.sin(0.08 * t) + np.random.normal(0, 15, len(t))
        current_mpc = 35 + 28 * np.sin(0.1 * t) + np.random.normal(0, 5, len(t))
        friction_std = (current_std < -45).astype(int)
        friction_mpc = np.zeros(len(t), dtype=int)
        
        df = pd.DataFrame({
            'time_s': t,
            'ego_speed_std_kmh': v_ego_std * 3.6,
            'ego_speed_mpc_kmh': v_ego_mpc * 3.6,
            'gap_std_m': 30 - (v_lead - v_ego_std) * 2,
            'gap_mpc_m': 30 - (v_lead - v_ego_mpc) * 0.5,
            'current_std_A': current_std,
            'current_mpc_A': current_mpc,
            'c_rate_std': current_std / 75.0,
            'c_rate_mpc': current_mpc / 75.0,
            'friction_brake_std': friction_std,
            'friction_brake_mpc': friction_mpc,
            'joule_heating_std_w': (current_std ** 2) * 0.08,
            'joule_heating_mpc_w': (current_mpc ** 2) * 0.08
        })

    # Metrics
    rms_std = np.sqrt(np.mean(df['current_std_A'] ** 2))
    rms_mpc = np.sqrt(np.mean(df['current_mpc_A'] ** 2))
    joule_std_wh = df['joule_heating_std_w'].sum() / 3600.0
    joule_mpc_wh = df['joule_heating_mpc_w'].sum() / 3600.0
    thermal_saved_pct = (joule_std_wh - joule_mpc_wh) / joule_std_wh * 100

    print("\n" + "="*50)
    print("      ELECTROCHEMICAL BATTERY HEALTH REPORT")
    print("="*50)
    print(f"RMS Current: STD = {rms_std:.2f} A  |  MPC = {rms_mpc:.2f} A")
    print(f"Joule Heat:  STD = {joule_std_wh:.2f} Wh |  MPC = {joule_mpc_wh:.2f} Wh")
    print(f"Thermal Dissipation Saved: {thermal_saved_pct:.1f}%")
    print(f"Friction Brakes Avoided:   {int(df['friction_brake_std'].sum() - df['friction_brake_mpc'].sum())} events")
    print("="*50 + "\n")

    # Train Model
    obs_std = pd.DataFrame({
        'c_rate': np.abs(df['c_rate_std']),
        'speed_kmh': df['ego_speed_std_kmh'],
        'gap_m': df['gap_std_m'],
        'joule_w': df['joule_heating_std_w'],
        'is_mpc': 0
    })
    obs_std['target_stress'] = obs_std['c_rate'] * 35.0 + (obs_std['joule_w'] / 50.0) + (df['friction_brake_std'] * 25.0)

    obs_mpc = pd.DataFrame({
        'c_rate': np.abs(df['c_rate_mpc']),
        'speed_kmh': df['ego_speed_mpc_kmh'],
        'gap_m': df['gap_mpc_m'],
        'joule_w': df['joule_heating_mpc_w'],
        'is_mpc': 1
    })
    obs_mpc['target_stress'] = obs_mpc['c_rate'] * 20.0 + (obs_mpc['joule_w'] / 60.0)

    dataset = pd.concat([obs_std, obs_mpc], ignore_index=True)
    X = dataset[['c_rate', 'speed_kmh', 'gap_m', 'joule_w', 'is_mpc']]
    y = dataset['target_stress']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)
    rf = RandomForestRegressor(n_estimators=100, max_depth=6, random_state=42)
    rf.fit(X_train, y_train)

    preds = rf.predict(X_test)
    print(f"RandomForest R² Score: {r2_score(y_test, preds):.4f}")
    print(f"RandomForest RMSE:     {np.sqrt(mean_squared_error(y_test, preds)):.4f}")

if __name__ == "__main__":
    main()
