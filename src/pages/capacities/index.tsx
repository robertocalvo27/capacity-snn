import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart2, Eye } from 'lucide-react';

const cbpMonths = [
  { id: '2024-01', mes: 'Enero', anio: 2024, estado: 'Enviado', fecha: '2023-12-22' },
  { id: '2024-02', mes: 'Febrero', anio: 2024, estado: 'En edición', fecha: '2024-01-22' },
  { id: '2024-03', mes: 'Marzo', anio: 2024, estado: 'Aprobado', fecha: '2024-02-22' },
  { id: '2024-04', mes: 'Abril', anio: 2024, estado: 'En edición', fecha: '2024-03-22' },
];

export default function CapacityModelPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <BarChart2 className="w-7 h-7 text-blue-600 mr-2" />
              Capacity Model
            </h1>
            <p className="text-gray-500">Listado mensual de Capacity Business Plan (CBP)</p>
          </div>
        </div>
      </div>

      {/* CBP Months Table */}
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
              {cbpMonths.map((cbp) => (
                <tr key={cbp.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cbp.mes}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cbp.anio}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      cbp.estado === 'Aprobado'
                        ? 'bg-green-100 text-green-800'
                        : cbp.estado === 'Enviado'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {cbp.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cbp.fecha}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-blue-600 hover:text-blue-900 flex items-center"
                      onClick={() => navigate(`/capacities/${cbp.id}`)}
                    >
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