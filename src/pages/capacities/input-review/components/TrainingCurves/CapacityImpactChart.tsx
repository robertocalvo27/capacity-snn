import React from 'react';
import { BarChart3, TrendingDown, AlertTriangle, Info } from 'lucide-react';
import type { LearningCurveImpact } from '../../../../../types/capacity';

interface CapacityImpactChartProps {
  impacts: LearningCurveImpact[];
}

const CapacityImpactChart: React.FC<CapacityImpactChartProps> = ({ impacts }) => {
  const getImpactColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getImpactTextColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getImpactBgColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-50';
      case 'high': return 'bg-orange-50';
      case 'medium': return 'bg-yellow-50';
      case 'low': return 'bg-green-50';
      default: return 'bg-gray-50';
    }
  };

  const getImpactIcon = (level: string) => {
    switch (level) {
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'high': return <TrendingDown className="h-5 w-5 text-orange-600" />;
      case 'medium': return <Info className="h-5 w-5 text-yellow-600" />;
      case 'low': return <BarChart3 className="h-5 w-5 text-green-600" />;
      default: return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const getImpactLabel = (level: string) => {
    switch (level) {
      case 'critical': return 'Crítico';
      case 'high': return 'Alto';
      case 'medium': return 'Medio';
      case 'low': return 'Bajo';
      default: return 'Desconocido';
    }
  };

  const totalCapacityLoss = impacts.reduce((sum, impact) => 
    sum + (impact.baseCapacity - impact.adjustedCapacity), 0
  );

  const maxCapacityLoss = Math.max(...impacts.map(impact => 
    impact.baseCapacity - impact.adjustedCapacity
  ));

  if (impacts.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center">
          <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay impactos activos</h3>
          <p className="mt-1 text-sm text-gray-500">
            No hay ajustes por curva de aprendizaje activos que impacten la capacidad.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Operaciones Afectadas</p>
              <p className="text-2xl font-bold text-blue-900">{impacts.length}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Pérdida Total</p>
              <p className="text-2xl font-bold text-red-900">{Math.round(totalCapacityLoss)}</p>
              <p className="text-xs text-red-600">unidades/día</p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Mayor Impacto</p>
              <p className="text-2xl font-bold text-orange-900">{Math.round(maxCapacityLoss)}</p>
              <p className="text-xs text-orange-600">unidades/día</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Ajuste Promedio</p>
              <p className="text-2xl font-bold text-purple-900">
                {Math.round((impacts.reduce((sum, impact) => sum + impact.adjustmentPercentage, 0) / impacts.length) * 100) / 100}%
              </p>
            </div>
            <Info className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Impact Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Impacto por Operación</h3>
              <p className="text-sm text-gray-600">Reducción de capacidad por ajustes de curva de aprendizaje</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {impacts
            .sort((a, b) => (b.baseCapacity - b.adjustedCapacity) - (a.baseCapacity - a.adjustedCapacity))
            .map((impact, index) => {
              const capacityLoss = impact.baseCapacity - impact.adjustedCapacity;
              const lossPercentage = maxCapacityLoss > 0 ? (capacityLoss / maxCapacityLoss) * 100 : 0;

              return (
                <div key={index} className={`rounded-lg border-2 border-gray-100 p-4 ${getImpactBgColor(impact.impactLevel)}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getImpactIcon(impact.impactLevel)}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{impact.operation}</h4>
                        <p className="text-xs text-gray-600">
                          {impact.valueStream} • {impact.productionLine}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getImpactTextColor(impact.impactLevel)} bg-white`}>
                        {getImpactLabel(impact.impactLevel)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {/* Capacity Bar */}
                    <div>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Capacidad</span>
                        <span>{impact.adjustedCapacity} / {impact.baseCapacity} unidades/día</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(impact.adjustedCapacity / impact.baseCapacity) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Impact Bar */}
                    <div>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Impacto</span>
                        <span>-{Math.round(capacityLoss)} unidades/día (-{impact.adjustmentPercentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getImpactColor(impact.impactLevel)}`}
                          style={{ width: `${lossPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Period */}
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Período efectivo:</span>
                      <span>{impact.effectivePeriod}</span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Impact Level Legend */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Niveles de Impacto</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">Bajo</p>
              <p className="text-xs text-gray-600">&lt; 5% de ajuste</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">Medio</p>
              <p className="text-xs text-gray-600">5% - 10% de ajuste</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">Alto</p>
              <p className="text-xs text-gray-600">10% - 15% de ajuste</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">Crítico</p>
              <p className="text-xs text-gray-600">≥ 15% de ajuste</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapacityImpactChart; 