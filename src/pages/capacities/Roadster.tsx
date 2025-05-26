import React, { useState } from 'react';
import { BarChart2, Eye, Filter, X } from 'lucide-react';

interface Capacity {
  id: string;
  mes: string;
  anio: number;
  estado: string;
  fecha: string;
}

const mockCapacities: Capacity[] = [
  { id: '1', mes: 'Enero', anio: 2024, estado: 'Enviado', fecha: '2023-12-22' },
  { id: '2', mes: 'Febrero', anio: 2024, estado: 'En edición', fecha: '2024-01-22' },
  { id: '3', mes: 'Marzo', anio: 2024, estado: 'Aprobado', fecha: '2024-02-22' },
  { id: '4', mes: 'Abril', anio: 2024, estado: 'En edición', fecha: '2024-03-22' },
];

const valueStreams = [
  'Sports Medicine',
  'ENT',
  'Apollo',
  'Fixation',
  'External Areas',
  'Wound',
  'Joint Repair',
  'Regeneten',
  'Roadster'
];

export default function RoadsterCapacities() {
  const [capacities] = useState<Capacity[]>(mockCapacities);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedVS, setSelectedVS] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <BarChart2 className="w-7 h-7 text-blue-600 mr-2" />
              Capacities Roadster
            </h1>
            <p className="text-gray-500">Listado mensual de capacities para el VST Roadster</p>
          </div>
          <div className="flex space-x-2">
            <button
              className={`flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50 ${showFilters ? 'border-blue-600 text-blue-600' : 'border-gray-300 text-gray-900'}`}
              onClick={() => setShowFilters((v) => !v)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </button>
          </div>
        </div>
        {/* Filtros Panel */}
        {showFilters && (
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-lg max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
              <button onClick={() => setShowFilters(false)} className="p-2 rounded hover:bg-gray-200">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Value Stream */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value Stream</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedVS}
                  onChange={e => setSelectedVS(e.target.value)}
                >
                  <option value="">Seleccionar Value Streams...</option>
                  {valueStreams.map(vs => (
                    <option key={vs} value={vs}>{vs}</option>
                  ))}
                </select>
              </div>
              {/* Fecha Desde */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha desde</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  value={dateFrom}
                  onChange={e => setDateFrom(e.target.value)}
                />
              </div>
              {/* Fecha Hasta */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha hasta</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  value={dateTo}
                  onChange={e => setDateTo(e.target.value)}
                />
              </div>
            </div>
            {/* Acciones de filtro */}
            <div className="mt-6 flex justify-end space-x-2">
              <button
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setSelectedVS('');
                  setDateFrom('');
                  setDateTo('');
                }}
              >
                Limpiar
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => setShowFilters(false)}
              >
                Aplicar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Capacities Table */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Año</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de creación</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {capacities.map((cap) => (
                <tr key={cap.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cap.mes}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cap.anio}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      cap.estado === 'Aprobado'
                        ? 'bg-green-100 text-green-800'
                        : cap.estado === 'Enviado'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {cap.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cap.fecha}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 flex items-center">
                      <Eye className="w-5 h-5 mr-1" /> Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 