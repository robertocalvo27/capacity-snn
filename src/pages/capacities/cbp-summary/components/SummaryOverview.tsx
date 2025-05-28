import React from 'react';
import { BarChart2, TrendingUp, Users, Percent, Clock, AlertTriangle } from 'lucide-react';
import SummaryMetricCard from './SummaryMetricCard';
import SummaryCapacityChart from './SummaryCapacityChart';

interface SummaryOverviewProps {
  cbpId: string;
  metrics: {
    totalDemand: number;
    totalCapacity: number;
    utilization: number;
    headcount: number;
    productivity: number;
    timeUtilization: number;
  };
  valueStreams: {
    id: string;
    name: string;
    demand: number;
    capacity: number;
    utilization: number;
    status: 'under' | 'over' | 'balanced';
  }[];
}

const SummaryOverview: React.FC<SummaryOverviewProps> = ({ cbpId, metrics, valueStreams }) => {
  // Determinar el estado general basado en la utilización
  const getOverallStatus = () => {
    if (metrics.utilization > 100) return 'over';
    if (metrics.utilization < 90) return 'under';
    return 'balanced';
  };

  const overallStatus = getOverallStatus();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <BarChart2 className="w-6 h-6 text-blue-600 mr-2" />
          CBP Final Summary {cbpId}
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Estado General:</span>
          {overallStatus === 'balanced' && (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Balanceado
            </span>
          )}
          {overallStatus === 'over' && (
            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
              Sobre Capacidad
            </span>
          )}
          {overallStatus === 'under' && (
            <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
              Bajo Capacidad
            </span>
          )}
        </div>
      </div>

      {/* Métricas generales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryMetricCard
          title="Utilización"
          value={`${metrics.utilization.toFixed(2)}%`}
          icon={<Percent className="w-5 h-5 text-blue-500" />}
          status={overallStatus}
          description="Capacidad vs Demanda"
        />
        <SummaryMetricCard
          title="Headcount"
          value={metrics.headcount.toString()}
          icon={<Users className="w-5 h-5 text-purple-500" />}
          status="info"
          description="Operarios disponibles"
        />
        <SummaryMetricCard
          title="Productividad"
          value={`${metrics.productivity.toFixed(2)}%`}
          icon={<TrendingUp className="w-5 h-5 text-green-500" />}
          status={metrics.productivity >= 100 ? 'balanced' : 'under'}
          description="Eficiencia por operario"
        />
        <SummaryMetricCard
          title="Demanda Total"
          value={metrics.totalDemand.toLocaleString()}
          icon={<BarChart2 className="w-5 h-5 text-amber-500" />}
          status="info"
          description="Unidades a producir"
        />
        <SummaryMetricCard
          title="Capacidad Total"
          value={metrics.totalCapacity.toLocaleString()}
          icon={<BarChart2 className="w-5 h-5 text-indigo-500" />}
          status="info"
          description="Unidades producibles"
        />
        <SummaryMetricCard
          title="Utilización de Tiempo"
          value={`${metrics.timeUtilization.toFixed(2)}%`}
          icon={<Clock className="w-5 h-5 text-cyan-500" />}
          status={metrics.timeUtilization >= 85 ? 'balanced' : 'under'}
          description="Horas disponibles vs requeridas"
        />
      </div>

      {/* Gráfico de capacidad vs demanda */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Capacidad vs Demanda por Value Stream</h3>
        <div className="h-80">
          <SummaryCapacityChart valueStreams={valueStreams} />
        </div>
      </div>

      {/* Lista de Value Streams */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-800">Resumen por Value Stream</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value Stream
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Demanda
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacidad
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilización
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {valueStreams.map((vs) => (
                <tr key={vs.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {vs.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vs.demand.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vs.capacity.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vs.utilization.toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {vs.status === 'balanced' && (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Balanceado
                      </span>
                    )}
                    {vs.status === 'over' && (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Sobre Capacidad
                      </span>
                    )}
                    {vs.status === 'under' && (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
                        Bajo Capacidad
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alertas y recomendaciones */}
      {overallStatus !== 'balanced' && (
        <div className={`p-4 rounded-lg ${overallStatus === 'over' ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'}`}>
          <div className="flex items-start">
            <AlertTriangle className={`w-5 h-5 mr-2 ${overallStatus === 'over' ? 'text-red-500' : 'text-amber-500'}`} />
            <div>
              <h4 className={`font-medium ${overallStatus === 'over' ? 'text-red-800' : 'text-amber-800'}`}>
                {overallStatus === 'over' ? 'Alerta de Sobrecapacidad' : 'Alerta de Subcapacidad'}
              </h4>
              <p className="text-sm mt-1">
                {overallStatus === 'over' 
                  ? 'La demanda actual excede la capacidad de producción. Considere agregar headcount o turnos adicionales.' 
                  : 'La capacidad actual está por debajo de los niveles óptimos. Considere ajustar el headcount o revisar las eficiencias.'
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryOverview; 