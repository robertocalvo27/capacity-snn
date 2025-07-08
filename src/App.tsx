import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './components/auth/LoginForm';
import { Layout } from './components/layout/Layout';
import { DataEntryPage } from './pages/DataEntry';
import { UsersRoutes } from './pages/users';
import { HelpRoutes } from './pages/help';
import { SettingsRoutes } from './pages/settings';
import { ReportsPage } from './pages/reports/ReportsPage';
import { DashboardRoutes } from './pages/dashboards';
import { LegalRoutes } from './pages/legal';
import { ActionRoutes } from './pages/actions';
import { DebugRoutes } from './pages/debug/routes';
import type { User } from './types/auth';
import BalanceLinea from './pages/engineering/BalanceLinea';
import RoadsterCapacities from './pages/capacities/Roadster';
import CapacityModelPage from './pages/capacities';
import MonthDetail from './pages/capacities/MonthDetail';
import VSTDetail from './pages/capacities/VSTDetail';
import UsageRoadster from './pages/capacities/usage/UsageRoadster';
import InputReview from './pages/capacities/input-review/InputReview';
import HandShake from './pages/capacities/handshake/HandShake';

// Usuario de prueba
const testUser: User = {
  id: '1',
  email: 'supervisor@smithnephew.com',
  name: 'Juan Pérez',
  role: 'supervisor',
  valueStream: 'ENT',
  lastLogin: new Date()
};

function CapacityMonthDetail() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Detalle del CBP mensual</h2>
      <p>Aquí se mostrarán los Value Streams (VST) para el mes seleccionado.</p>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;

  const handleLogin = (email: string, password: string) => {
    if (email === testUser.email && password === '123456') {
      setUser(testUser);
    }
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboards" replace />} />
          <Route path="/dashboards/*" element={<DashboardRoutes />} />
          <Route path="/data-entry" element={<DataEntryPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/actions/*" element={<ActionRoutes />} />
          <Route path="/users/*" element={<UsersRoutes />} />
          <Route path="/help/*" element={<HelpRoutes />} />
          <Route path="/settings/*" element={<SettingsRoutes />} />
          <Route path="/legal/*" element={<LegalRoutes />} />
          <Route path="/engineering/balance-linea" element={<BalanceLinea />} />
          <Route path="/capacities/roadster" element={<RoadsterCapacities />} />
          <Route path="/capacities" element={<CapacityModelPage />} />
          <Route path="/capacities/:cbpId" element={<MonthDetail />} />
          <Route path="/capacities/input-review/:cbpId" element={<InputReview />} />
          <Route path="/capacities/handshake/:cbpId" element={<HandShake />} />
          <Route path="/capacities/:cbpId/:vstId" element={<VSTDetail />} />
          <Route path="/capacities/:cbpId/roadster/usage" element={<UsageRoadster />} />
          {DebugRoutes}
        </Routes>
      </Layout>
    </Router>
  );
}