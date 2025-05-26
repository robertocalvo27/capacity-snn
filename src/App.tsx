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

// Usuario de prueba
const testUser: User = {
  id: '1',
  email: 'supervisor@smithnephew.com',
  name: 'Juan Pérez',
  role: 'supervisor',
  valueStream: 'ENT',
  lastLogin: new Date()
};

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
          {DebugRoutes}
        </Routes>
      </Layout>
    </Router>
  );
}