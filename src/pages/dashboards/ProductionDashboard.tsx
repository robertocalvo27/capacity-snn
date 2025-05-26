import React, { useState } from 'react';
import {
  Target,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Gauge,
  Activity
} from 'lucide-react';

interface HourlyData {
  hour: string;
  target: number;
  actual: number;
  efficiency: number;
  headcount: number;
  status: 'success' | 'warning' | 'danger';
}

export function ProductionDashboard() {
  // Datos de ejemplo
  const [currentStats] = useState({
    line: 'Línea 07',
    shift: 'T1',
    currentHour: '10:00 - 11:00',
    dailyTarget: 1200,
    currentProduction: 980,
    efficiency: 85,
    headcount: {
      actual: 42,
      required: 45
    },
    lastUpdate: new Date(),
    alerts: [
      { id: 1, type: 'warning', message: 'Head count por debajo del objetivo' },
      { id: 2, type: 'danger', message: 'Delta negativo en última hora' }
    ]
  });

  const [hourlyData] = useState<HourlyData[]>([
    { hour: '06:00 - 07:00', target: 150, actual: 145, efficiency: 97, headcount: 45, status: 'success' },
    { hour: '07:00 - 08:00', target: 150, actual: 148, efficiency: 99, headcount: 45, status: 'success' },
    { hour: '08:00 - 09:00', target: 150, actual: 142, efficiency: 95, headcount: 44, status: 'warning' },
    { hour: '09:00 - 10:00', target: 150, actual: 135, efficiency: 90, headcount: 43, status: 'warning' },
    { hour: '10:00 - 11:00', target: 150, actual: 130, efficiency: 87, headcount: 42, status: 'danger' }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'danger': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 95) return 'text-green-500';
    if (efficiency >= 85) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle2;
      case 'warning': return AlertTriangle;
      case 'danger': return AlertCircle;
      default: return AlertCircle;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Meta vs Real */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Meta del Día</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-gray-900">{currentStats.dailyTarget}</p>
                <p className="ml-2 text-sm text-gray-500">unidades</p>
              </div>
            </div>
            <Target className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Producción Actual</p>
              <p className="text-lg font-semibold text-gray-900">{currentStats.currentProduction}</p>
            </div>
            <div className="mt-2 flex items-center">
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              <p className="text-sm text-red-500">
                -220 unidades vs meta
              </p>
            </div>
          </div>
        </div>

        {/* Eficiencia */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Eficiencia</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-gray-900">{currentStats.efficiency}%</p>
              </div>
            </div>
            <Gauge className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-500 h-2.5 rounded-full" 
                style={{ width: `${currentStats.efficiency}%` }}
              ></div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Meta: 95%
            </p>
          </div>
        </div>

        {/* Head Count */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Head Count</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-gray-900">{currentStats.headcount.actual}</p>
                <p className="ml-2 text-sm text-gray-500">/ {currentStats.headcount.required}</p>
              </div>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Faltante</p>
              <p className="text-lg font-semibold text-red-500">
                {currentStats.headcount.required - currentStats.headcount.actual}
              </p>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              93.3% del requerido
            </p>
          </div>
        </div>

        {/* Hora Actual */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Hora Actual</p>
              <p className="text-2xl font-bold text-gray-900">{currentStats.currentHour}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Última Actualización</p>
              <p className="text-sm text-gray-900">
                {currentStats.lastUpdate.toLocaleTimeString()}
              </p>
            </div>
            <div className="mt-2 flex items-center">
              <Activity className="h-4 w-4 text-green-500 mr-1" />
              <p className="text-sm text-green-500">Datos en tiempo real</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alertas y Acciones Requeridas */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Alertas y Acciones Requeridas</h2>
        <div className="space-y-4">
          {currentStats.alerts.map(alert => {
            const AlertIcon = getAlertIcon(alert.type);
            return (
              <div
                key={alert.id}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  alert.type === 'danger' ? 'bg-red-50' : 'bg-yellow-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <AlertIcon className={`h-5 w-5 ${
                    alert.type === 'danger' ? 'text-red-500' : 'text-yellow-500'
                  }`} />
                  <span className="text-sm font-medium text-gray-900">
                    {alert.message}
                  </span>
                </div>
                <button className="flex items-center text-sm text-blue-600 hover:text-blue-700">
                  Ver detalles
                  <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabla de Producción por Hora */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Producción por Hora</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Meta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Real
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Eficiencia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  HC
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {hourlyData.map((hour, index) => (
                <tr key={hour.hour} className={index === hourlyData.length - 1 ? 'bg-blue-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {hour.hour}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {hour.target}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {hour.actual}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={hour.actual >= hour.target ? 'text-green-500' : 'text-red-500'}>
                      {hour.actual - hour.target}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={getEfficiencyColor(hour.efficiency)}>
                      {hour.efficiency}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {hour.headcount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      hour.status === 'success' ? 'bg-green-100 text-green-800' :
                      hour.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {hour.status === 'success' ? 'En meta' :
                       hour.status === 'warning' ? 'Atención' : 'Crítico'}
                    </span>
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