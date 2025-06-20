import React from 'react';
import { BarChart3, TrendingDown, AlertTriangle, Calendar, Users } from 'lucide-react';
import type { TrainingCurveImpact } from '@/types/capacity';

interface CapacityImpactChartProps {
  impacts: TrainingCurveImpact[];
}

const CapacityImpactChart: React.FC<CapacityImpactChartProps> = ({ impacts }) => {
  const maxImpact = Math.max(...impacts.map(impact => impact.capacityImpact), 0);
  const totalImpact = impacts.reduce((sum, impact) => sum + impact.capacityImpact, 0);

  const getImpactColor = (impact: number) => {
    if (impact >= 15) return 'bg-red-500';
    if (impact >= 10) return 'bg-orange-500';
    if (impact >= 5) return 'bg-amber-500';
    return 'bg-yellow-500';
  };

  const getImpactTextColor = (impact: number) => {
    if (impact >= 15) return 'text-red-600';
    if (impact >= 10) return 'text-orange-600';
    if (impact >= 5) return 'text-amber-600';
    return 'text-yellow-600';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header con resumen */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-red-600" />
            Impacto en Capacidad por Curvas de Entrenamiento
          </h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-red-600">{totalImpact.toFixed(1)}%</div>
            <div className="text-sm text-gray-500">Reducción total</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center">
              <TrendingDown className="w-5 h-5 mr-2 text-red-600" />
              <div>
                <div className="text-sm font-medium text-red-600">Impacto Crítico</div>
                <div className="text-lg font-bold text-red-700">
                  {impacts.filter(i => i.capacityImpact >= 15).length}
                </div>
                <div className="text-xs text-red-600">≥15% reducción</div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-amber-600" />
              <div>
                <div className="text-sm font-medium text-amber-600">Impacto Alto</div>
                <div className="text-lg font-bold text-amber-700">
                  {impacts.filter(i => i.capacityImpact >= 10 && i.capacityImpact < 15).length}
                </div>
                <div className="text-xs text-amber-600">10-15% reducción</div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-blue-600">Total Empleados</div>
                <div className="text-lg font-bold text-blue-700">
                  {impacts.reduce((sum, i) => sum + i.employeesInTraining, 0)}
                </div>
                <div className="text-xs text-blue-600">en entrenamiento</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de barras */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-6">
          Impacto por Value Stream y Turno
        </h4>

        {impacts.length > 0 ? (
          <div className="space-y-4">
            {impacts.map((impact, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h5 className="font-medium text-gray-900">
                      {impact.valueStream} {impact.line ? `- ${impact.line}` : ''} • {impact.shift}
                    </h5>
                    <div className="text-sm text-gray-500">
                      {impact.employeesInTraining} de {impact.totalEmployees} empleados en entrenamiento
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-bold ${getImpactTextColor(impact.capacityImpact)}`}>
                      -{impact.capacityImpact}%
                    </div>
                    <div className="text-sm text-gray-500">
                      Eficiencia prom: {impact.averageEfficiency}%
                    </div>
                  </div>
                </div>

                {/* Barra de progreso */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Impacto en capacidad</span>
                    <span>{impact.capacityImpact}% de reducción</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${getImpactColor(impact.capacityImpact)}`}
                      style={{ width: `${Math.min((impact.capacityImpact / maxImpact) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Información adicional */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-gray-600">
                      {((impact.employeesInTraining / impact.totalEmployees) * 100).toFixed(1)}% del equipo
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <TrendingDown className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-gray-600">
                      Eficiencia: {impact.averageEfficiency}%
                    </span>
                  </div>
                  
                  {impact.estimatedRecoveryDate && (
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-600">
                        Recuperación: {formatDate(impact.estimatedRecoveryDate)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay impacto en capacidad
            </h3>
            <p>No se encontraron curvas de entrenamiento activas que afecten la capacidad.</p>
          </div>
        )}
      </div>

      {/* Tabla detallada */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-medium text-gray-900">
            Detalle por Area de Trabajo
          </h4>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Area / Turno
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empleados
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  En Entrenamiento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Eficiencia Promedio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Impacto en Capacidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Recuperación
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {impacts.map((impact, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {impact.valueStream} {impact.line ? `- ${impact.line}` : ''}
                    </div>
                    <div className="text-sm text-gray-500">{impact.shift}</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{impact.totalEmployees}</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{impact.employeesInTraining}</div>
                    <div className="text-sm text-gray-500">
                      {((impact.employeesInTraining / impact.totalEmployees) * 100).toFixed(1)}%
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{impact.averageEfficiency}%</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${getImpactTextColor(impact.capacityImpact)}`}>
                      -{impact.capacityImpact}%
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    {impact.estimatedRecoveryDate ? (
                      <div className="text-sm text-gray-900">
                        {formatDate(impact.estimatedRecoveryDate)}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">No definida</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leyenda */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h5 className="text-sm font-medium text-gray-900 mb-3">Interpretación del Impacto</h5>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
            <span>Crítico (≥15%): Acción inmediata requerida</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded mr-2"></div>
            <span>Alto (10-15%): Monitoreo cercano</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-amber-500 rounded mr-2"></div>
            <span>Medio (5-10%): Seguimiento regular</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
            <span>Bajo (&lt;5%): Impacto mínimo</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapacityImpactChart; 