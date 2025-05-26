import React from 'react';
import { Clock } from 'lucide-react';

export function ProductionLegend() {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
        <Clock className="h-5 w-5" />
        Leyenda de Registro de Datos
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white border border-gray-200 rounded"></div>
          <span className="text-sm">Hora futura o sin registro</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-50 border border-gray-200 rounded"></div>
          <span className="text-sm">Registro inmediato (≤ 15 min)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-yellow-50 border border-gray-200 rounded"></div>
          <span className="text-sm">Registro tardío (15-30 min)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-50 border border-gray-200 rounded"></div>
          <span className="text-sm">Registro crítico (más de 30 min)</span>
        </div>
      </div>
    </div>
  );
}