import React from 'react';
import { Clock, Settings } from 'lucide-react';

interface TableActionsProps {
  onAddOvertime: () => void;
  onOpenAdjustments: () => void;
  onAttemptClose: () => void;
}

export function TableActions({ onAddOvertime, onOpenAdjustments, onAttemptClose }: TableActionsProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="space-x-2">
        {/* Botón de Hora Extra */}
        <button
          onClick={onAddOvertime}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Clock className="h-4 w-4 mr-2" />
          Agregar Hora Extra
        </button>

        {/* Botón de Ajustes */}
        <button
          onClick={onOpenAdjustments}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Settings className="h-4 w-4 mr-2" />
          Ajustes
        </button>
      </div>
      
      {/* Nuevo botón de cierre */}
      <button
        onClick={onAttemptClose}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Cerrar Turno
      </button>
    </div>
  );
} 