# ml/train_battery_model.py
"""
EV MPC Advanced Machine Learning Battery Health Workbench
Architectures:
  1. Deep Cascade Forest Network (Multi-Layer gcForest)
  2. 1D Temporal Convolutional Neural Network (PyTorch Conv1D)
  3. Quantum-Enhanced Machine Learning (Variational Quantum Circuit / VQC)

Usage:
    python ml/train_battery_model.py --data path/to/ev_mpc_telemetry.csv
"""

import argparse
import sys
import os
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, ExtraTreesRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error
from sklearn.preprocessing import StandardScaler

# ──────────────────────────────────────────────────────────────────
# 1. Deep Cascade Forest Network (Multi-Layer gcForest)
# ──────────────────────────────────────────────────────────────────
class DeepCascadeForest:
    def __init__(self, n_estimators=50, max_depth=6, n_layers=2):
        self.n_layers = n_layers
        self.layers = []
        for l in range(n_layers):
            self.layers.append({
                'rf': RandomForestRegressor(n_estimators=n_estimators, max_depth=max_depth, random_state=42 + l),
                'et': ExtraTreesRegressor(n_estimators=n_estimators, max_depth=max_depth, random_state=100 + l)
            })
        self.final_estimator = RandomForestRegressor(n_estimators=n_estimators, max_depth=max_depth, random_state=999)

    def fit(self, X, y):
        curr_X = np.array(X)
        for layer in self.layers:
            p1 = layer['rf'].fit(curr_X, y).predict(curr_X).reshape(-1, 1)
            p2 = layer['et'].fit(curr_X, y).predict(curr_X).reshape(-1, 1)
            curr_X = np.hstack([curr_X, p1, p2])
        self.final_estimator.fit(curr_X, y)
        return self

    def predict(self, X):
        curr_X = np.array(X)
        for layer in self.layers:
            p1 = layer['rf'].predict(curr_X).reshape(-1, 1)
            p2 = layer['et'].predict(curr_X).reshape(-1, 1)
            curr_X = np.hstack([curr_X, p1, p2])
        return self.final_estimator.predict(curr_X)

# ──────────────────────────────────────────────────────────────────
# 2. Quantum-Enhanced Machine Learning (Variational VQC)
# ──────────────────────────────────────────────────────────────────
class QuantumBatteryRegressor:
    def __init__(self, n_qubits=4, n_layers=2, lr=0.08, epochs=20):
        self.n_qubits = n_qubits
        self.n_layers = n_layers
        self.lr = lr
        self.epochs = epochs
        self.weights = np.random.uniform(-np.pi, np.pi, (n_layers, n_qubits))
        self.bias = 0.0

    def _quantum_statevector(self, x, weights):
        dim = 2 ** self.n_qubits
        state = np.zeros(dim, dtype=np.complex128)
        state[0] = 1.0
        
        # Angle embedding: Ry(x_i)
        for i in range(min(len(x), self.n_qubits)):
            theta = float(x[i])
            c, s = np.cos(theta / 2.0), np.sin(theta / 2.0)
            new_state = np.zeros_like(state)
            step = 2 ** (self.n_qubits - 1 - i)
            for j in range(dim):
                if (j & step) == 0:
                    idx0, idx1 = j, j | step
                    new_state[idx0] = c * state[idx0] - s * state[idx1]
                    new_state[idx1] = s * state[idx0] + c * state[idx1]
            state = new_state

        # Variational layers with CNOT entanglement
        for l in range(self.n_layers):
            for i in range(self.n_qubits):
                theta = weights[l, i]
                c, s = np.cos(theta / 2.0), np.sin(theta / 2.0)
                new_state = np.zeros_like(state)
                step = 2 ** (self.n_qubits - 1 - i)
                for j in range(dim):
                    if (j & step) == 0:
                        idx0, idx1 = j, j | step
                        new_state[idx0] = c * state[idx0] - s * state[idx1]
                        new_state[idx1] = s * state[idx0] + c * state[idx1]
                state = new_state
                
            for i in range(self.n_qubits - 1):
                ctrl = 2 ** (self.n_qubits - 1 - i)
                targ = 2 ** (self.n_qubits - 1 - (i + 1))
                new_state = np.zeros_like(state)
                for j in range(dim):
                    if (j & ctrl) != 0:
                        new_state[j ^ targ] = state[j]
                    else:
                        new_state[j] = state[j]
                state = new_state

        # Pauli-Z expectation value on qubit 0
        exp_val = 0.0
        step = 2 ** (self.n_qubits - 1)
        for j in range(dim):
            sign = 1.0 if (j & step) == 0 else -1.0
            exp_val += sign * np.abs(state[j])**2
        return exp_val

    def fit(self, X, y):
        self.x_min = X.min(axis=0)
        self.x_max = X.max(axis=0) + 1e-6
        X_norm = np.pi * (X - self.x_min) / (self.x_max - self.x_min)
        self.y_mean = np.mean(y)
        self.y_std = np.std(y) + 1e-6
        y_norm = (y - self.y_mean) / self.y_std
        
        sub_idx = np.random.choice(len(X_norm), min(60, len(X_norm)), replace=False)
        X_sub, y_sub = X_norm[sub_idx], y_norm[sub_idx]
        shift = np.pi / 2.0
        
        for ep in range(self.epochs):
            grad_w = np.zeros_like(self.weights)
            preds = np.array([self._quantum_statevector(x, self.weights) for x in X_sub]) + self.bias
            err = preds - y_sub
            for l in range(self.n_layers):
                for q in range(self.n_qubits):
                    w_plus = self.weights.copy(); w_plus[l, q] += shift
                    w_minus = self.weights.copy(); w_minus[l, q] -= shift
                    e_plus = np.array([self._quantum_statevector(x, w_plus) for x in X_sub[:15]])
                    e_minus = np.array([self._quantum_statevector(x, w_minus) for x in X_sub[:15]])
                    grad_w[l, q] = np.mean(err[:15] * (e_plus - e_minus) / 2.0)
            self.weights -= self.lr * grad_w
            self.bias -= self.lr * np.mean(err)
        return self

    def predict(self, X):
        X_norm = np.pi * (X - self.x_min) / (self.x_max - self.x_min)
        norm_preds = np.array([self._quantum_statevector(x, self.weights) for x in X_norm]) + self.bias
        return norm_preds * self.y_std + self.y_mean

# ──────────────────────────────────────────────────────────────────
# Main Pipeline
# ──────────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="Train Advanced ML models on EV MPC telemetry")
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

    # Electrochemical Metrics
    rms_std = np.sqrt(np.mean(df['current_std_A'] ** 2))
    rms_mpc = np.sqrt(np.mean(df['current_mpc_A'] ** 2))
    joule_std_wh = df['joule_heating_std_w'].sum() / 3600.0
    joule_mpc_wh = df['joule_heating_mpc_w'].sum() / 3600.0
    thermal_saved_pct = (joule_std_wh - joule_mpc_wh) / joule_std_wh * 100

    print("\n" + "="*65)
    print("      ELECTROCHEMICAL BATTERY HEALTH & THERMAL REPORT")
    print("="*65)
    print(f"RMS Current: STD = {rms_std:.2f} A  |  MPC = {rms_mpc:.2f} A")
    print(f"Joule Heat:  STD = {joule_std_wh:.2f} Wh |  MPC = {joule_mpc_wh:.2f} Wh")
    print(f"Thermal Dissipation Saved: {thermal_saved_pct:.1f}% less internal heat")
    print(f"Friction Brakes Avoided:   {int(df['friction_brake_std'].sum() - df['friction_brake_mpc'].sum())} events")
    print("="*65 + "\n")

    # Feature Preparation
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
    features = ['c_rate', 'speed_kmh', 'gap_m', 'joule_w', 'is_mpc']
    X = dataset[features].values
    y = dataset['target_stress'].values

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)

    # 1. Train Deep Cascade Forest
    print("1. Training Deep Cascade Forest Network (gcForest)...")
    deep_forest = DeepCascadeForest(n_estimators=50, max_depth=6, n_layers=2)
    deep_forest.fit(X_train, y_train)
    preds_df = deep_forest.predict(X_test)
    print(f"   Deep Forest R² Score: {r2_score(y_test, preds_df):.4f} | RMSE: {np.sqrt(mean_squared_error(y_test, preds_df)):.4f}")

    # 2. Train Quantum VQC Regressor
    print("2. Training Quantum VQC (Angle-Embedded Hilbert Circuit)...")
    quantum_model = QuantumBatteryRegressor(n_qubits=4, epochs=20)
    quantum_model.fit(X_train, y_train)
    preds_q = quantum_model.predict(X_test)
    print(f"   Quantum VQC R² Score: {r2_score(y_test, preds_q):.4f} | RMSE: {np.sqrt(mean_squared_error(y_test, preds_q)):.4f}")

    # 3. Optional 1D-CNN (if PyTorch installed)
    try:
        import torch
        import torch.nn as nn
        import torch.optim as optim
        print("3. Training 1D Temporal Convolutional Neural Network (PyTorch)...")
        class Battery1DCNN(nn.Module):
            def __init__(self):
                super().__init__()
                self.conv = nn.Sequential(
                    nn.Conv1d(1, 32, 3, padding=1),
                    nn.ReLU(),
                    nn.Conv1d(32, 64, 3, padding=1),
                    nn.ReLU()
                )
                self.fc = nn.Sequential(
                    nn.Linear(64 * 5, 32),
                    nn.ReLU(),
                    nn.Linear(32, 1)
                )
            def forward(self, x):
                return self.fc(self.conv(x).view(x.size(0), -1)).squeeze(-1)

        scaler = StandardScaler()
        X_train_s = scaler.fit_transform(X_train)
        X_test_s = scaler.transform(X_test)
        
        cnn = Battery1DCNN()
        opt = optim.AdamW(cnn.parameters(), lr=0.01)
        crit = nn.MSELoss()
        
        tx = torch.tensor(X_train_s, dtype=torch.float32).unsqueeze(1)
        ty = torch.tensor(y_train, dtype=torch.float32)
        for _ in range(50):
            opt.zero_grad()
            crit(cnn(tx), ty).backward()
            opt.step()
            
        with torch.no_grad():
            preds_cnn = cnn(torch.tensor(X_test_s, dtype=torch.float32).unsqueeze(1)).numpy()
        print(f"   1D-CNN R² Score:      {r2_score(y_test, preds_cnn):.4f} | RMSE: {np.sqrt(mean_squared_error(y_test, preds_cnn)):.4f}")
    except ImportError:
        print("   (PyTorch not installed locally. Runs automatically in Google Colab.)")

if __name__ == "__main__":
    main()
