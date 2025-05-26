import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HelpPage } from './HelpPage';
import { KnowledgeBasePage } from './KnowledgeBasePage';

export function HelpRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HelpPage />} />
      <Route path="/knowledge-base" element={<KnowledgeBasePage />} />
    </Routes>
  );
}