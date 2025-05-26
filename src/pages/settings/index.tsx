import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProfilePage } from '../profile/ProfilePage';
import { CompanySettings } from './CompanySettings';
import { ProductionSettings } from './ProductionSettings';
import { SystemSettings } from './SystemSettings';

export function SettingsRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/settings/personal" replace />} />
      <Route path="/personal" element={<ProfilePage />} />
      <Route path="/company" element={<CompanySettings />} />
      <Route path="/production" element={<ProductionSettings />} />
      <Route path="/system" element={<SystemSettings />} />
    </Routes>
  );
}