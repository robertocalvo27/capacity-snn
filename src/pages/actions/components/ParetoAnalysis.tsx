import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';

interface Cause {
  id: string;
  description: string;
  units: number;
  comments?: string;
}

interface ParetoAnalysisProps {
  onComplete: (causes: Cause[]) => void;
  initialCauses?: Cause[];
  readOnly?: boolean;
}

export function ParetoAnalysis({ onComplete, initialCauses = [], readOnly = false }: ParetoAnalysisProps) {
  const [causes, setCauses] = useState<Cause[]>(initialCauses);
  const [newCause, setNewCause] = useState({ description: '', units: 0, comments: '' });

  useEffect(() => {
    setCauses(initialCauses);
  }, [initialCauses]);

  const addCause = () => {
    if (newCause.description && newCause.units > 0) {
      setCauses([
        ...causes,
        {
          id: crypto.randomUUID(),
          description: newCause.description,
          units: newCause.units,
          comments: newCause.comments
        }
      ]);
      setNewCause({ description: '', units: 0, comments: '' });
    }
  };

  const removeCause = (id: string) => {
    setCauses(causes.filter(cause => cause.id !== id));
  };

  const totalUnits = causes.reduce((sum, cause) => sum + cause.units, 0);
  const sortedCauses = [...causes].sort((a, b) => b.units - a.units);
  let accumulatedPercentage = 0;

  const paretoData = sortedCauses.map(cause => {
    const percentage = (cause.units / totalUnits) * 100;
    accumulatedPercentage += percentage;
    return {
      ...cause,
      percentage,
      accumulated: accumulatedPercentage
    };
  });

  return (
    <div className="space-y-6">
      {!readOnly && (
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Agregar Causa</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <input
                type="text"
                value={newCause.description}
                onChange={(e) => setNewCause({ ...newCause, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Descripción de la causa"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Unidades</label>
              <input
                type="number"
                value={newCause.units}
                onChange={(e) => setNewCause({ ...newCause, units: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Cantidad"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Comentarios</label>
              <input
                type="text"
                value={newCause.comments}
                onChange={(e) => setNewCause({ ...newCause, comments: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Comentarios adicionales"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={addCause}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Causa
            </button>
          </div>
        </div>
      )}

      {/* Pareto Chart */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Análisis de Pareto</h3>
        <div className="relative h-64">
          {paretoData.map((cause, index) => (
            <div
              key={cause.id}
              className="absolute bottom-0 bg-blue-500"
              style={{
                left: `${(index / paretoData.length) * 100}%`,
                width: `${100 / paretoData.length}%`,
                height: `${(cause.units / sortedCauses[0].units) * 100}%`,
              }}
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs">
                {cause.units}
              </div>
            </div>
          ))}
          {/* Accumulated Line */}
          <svg className="absolute inset-0 pointer-events-none">
            <polyline
              points={paretoData.map((cause, index) => 
                `${(index / paretoData.length) * 100}%,${100 - cause.accumulated}%`
              ).join(' ')}
              fill="none"
              stroke="red"
              strokeWidth="2"
            />
          </svg>
        </div>
        <div className="mt-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Causa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unidades
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    %
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    % Acumulado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comentarios
                  </th>
                  {!readOnly && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paretoData.map((cause) => (
                  <tr key={cause.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cause.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cause.units}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cause.percentage.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cause.accumulated.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {cause.comments}
                    </td>
                    {!readOnly && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => removeCause(cause.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {!readOnly && (
        <div className="flex justify-end">
          <button
            onClick={() => onComplete(causes)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar Análisis
          </button>
        </div>
      )}
    </div>
  );
}