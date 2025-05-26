import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ActionPlansHistory } from './ActionPlansHistory';
import { NewActionPlan } from './NewActionPlan';

export function ActionRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/actions/history" replace />} />
      <Route path="/history" element={<ActionPlansHistory />} />
      <Route path="/new" element={<NewActionPlan />} />
    </Routes>
  );
}