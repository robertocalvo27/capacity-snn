import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LeaderDashboard } from './LeaderDashboard';
import { SupervisorDashboard } from './SupervisorDashboard';

export function DashboardRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboards/leader" replace />} />
      <Route path="/leader" element={<LeaderDashboard />} />
      <Route path="/supervisor" element={<SupervisorDashboard />} />
    </Routes>
  );
}