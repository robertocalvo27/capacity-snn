import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { UserManagement } from './UserManagement';
import { RolesAndPermissions } from './RolesAndPermissions';
import { Assignments } from './Assignments';
import { ActivityAudit } from './ActivityAudit';

export function UsersRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/users/management" replace />} />
      <Route path="/management" element={<UserManagement />} />
      <Route path="/roles" element={<RolesAndPermissions />} />
      <Route path="/assignments" element={<Assignments />} />
      <Route path="/audit" element={<ActivityAudit />} />
    </Routes>
  );
}