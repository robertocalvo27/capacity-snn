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
  headcount: number;
  partNumber?: string; // Para obtener el laborStd
  timeEfficiency: number;
  mixEfficiency: number;
  status: 'success' | 'warning' | 'danger';
}

interface AccumulatedStats {
  targetProduction: number;
  actualProduction: number;
  delta: number;
  lostTime: number;
  efficiency: number;
}

export function LeaderDashboard() {
  const [currentStats, setCurrentStats] = useState({
    shift: {
      id: 1,
      name: 'T1',
      duration: 8, // horas del turno
    },
    shiftTarget: 1200, // Meta del turno (ya no del día)
    currentProduction: 980,
    timeEfficiency: 85,
    mixEfficiency: 82,
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
    { 
      hour: '06:00 - 07:00', 
      target: 150, 
      actual: 145, 
      headcount: 45, 
      timeEfficiency: 97, 
      mixEfficiency: 95,
      status: 'success' 
    },
    { hour: '07:00 - 08:00', target: 150, actual: 148, headcount: 45, timeEfficiency: 99, mixEfficiency: 99, status: 'success' },
    { hour: '08:00 - 09:00', target: 150, actual: 142, headcount: 44, timeEfficiency: 95, mixEfficiency: 95, status: 'warning' },
    { hour: '09:00 - 10:00', target: 150, actual: 135, headcount: 43, timeEfficiency: 90, mixEfficiency: 90, status: 'warning' },
    { hour: '10:00 - 11:00', target: 150, actual: 130, headcount: 42, timeEfficiency: 87, mixEfficiency: 87, status: 'danger' }
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

  // Función para calcular la eficiencia de tiempo
  const calculateTimeEfficiency = (target: number, laborStd: number, headcount: number) => {
    // Horas ganadas = Meta * Labor Standard
    const earnedHours = target * laborStd;
    // Horas pagadas = HC * 1 hora
    const paidHours = headcount;
    
    return (earnedHours / paidHours) * 100;
  };

  // Función para calcular la eficiencia de mix
  const calculateMixEfficiency = (actual: number, laborStd: number, headcount: number, hours: number) => {
    return (actual * laborStd) / (headcount * hours) * 100;
  };

  // Función para calcular el tiempo perdido
  const calculateLostTime = (delta: number, hourlyTarget: number) => {
    if (delta >= 0) return 0;
    // Tiempo Muerto = Delta negativo / (Meta por Hora / 60)
    return Math.abs(delta) / (hourlyTarget / 60);
  };

  // Función para calcular estadísticas acumuladas
  const calculateAccumulatedStats = (data: HourlyData[]): AccumulatedStats => {
    return data.reduce((acc, curr) => {
      return {
        targetProduction: acc.targetProduction + curr.target,
        actualProduction: acc.actualProduction + curr.actual,
        delta: acc.delta + (curr.actual - curr.target),
        lostTime: acc.lostTime + calculateLostTime(curr.actual - curr.target, curr.target),
        efficiency: data.length > 0 
          ? ((acc.actualProduction + curr.actual) / (acc.targetProduction + curr.target)) * 100
          : 0
      };
    }, {
      targetProduction: 0,
      actualProduction: 0,
      delta: 0,
      lostTime: 0,
      efficiency: 0
    });
  };

  const accumulatedStats = calculateAccumulatedStats(hourlyData);

  return (
    <div className="space-y-6">
      {/* Header con KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Meta del Turno */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Meta del Turno</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-gray-900">{currentStats.shiftTarget}</p>
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
                {currentStats.currentProduction - currentStats.shiftTarget} vs meta
              </p>
            </div>
          </div>
        </div>

        {/* Eficiencia de Tiempo */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Eficiencia (Tiempo)</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-gray-900">
                  {currentStats.timeEfficiency.toFixed(1)}%
                </p>
              </div>
            </div>
            <Gauge className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-500 h-2.5 rounded-full" 
                style={{ width: `${currentStats.timeEfficiency}%` }}
              ></div>
            </div>
            <p className="mt-2 text-sm text-gray-500">Meta: 95%</p>
          </div>
        </div>

        {/* Eficiencia de Mix */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Eficiencia (Mix)</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-gray-900">
                  {currentStats.mixEfficiency.toFixed(1)}%
                </p>
              </div>
            </div>
            <Activity className="h-8 w-8 text-yellow-500" />
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-yellow-500 h-2.5 rounded-full" 
                style={{ width: `${currentStats.mixEfficiency}%` }}
              ></div>
            </div>
            <p className="mt-2 text-sm text-gray-500">Meta: 95%</p>
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
      </div>

      {/* Nueva sección de KPIs acumulados */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Producción Acumulada */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Producción Acumulada</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-gray-900">
                  {accumulatedStats.actualProduction}
                </p>
                <p className="ml-2 text-sm text-gray-500">
                  / {accumulatedStats.targetProduction}
                </p>
              </div>
            </div>
            <Target className="h-8 w-8 text-indigo-500" />
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-indigo-500 h-2.5 rounded-full" 
                style={{ 
                  width: `${(accumulatedStats.actualProduction / accumulatedStats.targetProduction) * 100}%` 
                }}
              ></div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {((accumulatedStats.actualProduction / accumulatedStats.targetProduction) * 100).toFixed(1)}% del objetivo
            </p>
          </div>
        </div>

        {/* Delta Acumulado */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Delta Acumulado</p>
              <div className="flex items-baseline">
                <p className={`text-2xl font-bold ${
                  accumulatedStats.delta >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {accumulatedStats.delta}
                </p>
                <p className="ml-2 text-sm text-gray-500">unidades</p>
              </div>
            </div>
            {accumulatedStats.delta >= 0 ? (
              <TrendingUp className="h-8 w-8 text-green-500" />
            ) : (
              <TrendingDown className="h-8 w-8 text-red-500" />
            )}
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              {accumulatedStats.delta >= 0 ? 'Adelanto' : 'Atraso'} vs meta
            </p>
          </div>
        </div>

        {/* Tiempo Perdido Acumulado */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tiempo Perdido Acumulado</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-gray-900">
                  {accumulatedStats.lostTime.toFixed(1)}
                </p>
                <p className="ml-2 text-sm text-gray-500">minutos</p>
              </div>
            </div>
            <Clock className="h-8 w-8 text-red-500" />
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              {(accumulatedStats.lostTime / 60).toFixed(1)} horas perdidas
            </p>
          </div>
        </div>

        {/* Eficiencia Acumulada */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Eficiencia Acumulada</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-gray-900">
                  {accumulatedStats.efficiency.toFixed(1)}%
                </p>
              </div>
            </div>
            <Gauge className="h-8 w-8 text-emerald-500" />
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-emerald-500 h-2.5 rounded-full" 
                style={{ width: `${accumulatedStats.efficiency}%` }}
              ></div>
            </div>
            <p className="mt-2 text-sm text-gray-500">Meta: 95%</p>
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
                  Eficiencia (T)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Eficiencia (M)
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
              {hourlyData.map((hour) => (
                <tr key={hour.hour}>
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
                    <span className={getEfficiencyColor(hour.timeEfficiency)}>
                      {hour.timeEfficiency.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={getEfficiencyColor(hour.mixEfficiency)}>
                      {hour.mixEfficiency.toFixed(1)}%
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