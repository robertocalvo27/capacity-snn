import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Users, 
  TrendingDown,
  TrendingUp,
  Gauge,
  Clock,
  Activity
} from 'lucide-react';
import type { ProductionEntry } from '../../types/production';
import { PART_NUMBERS } from '../../types/part-numbers';

interface DailySummaryProps {
  entries: ProductionEntry[];
  shiftType: 'T1' | 'T2' | 'T3';
  supportHours: number;
  laborStandard: number;
}

export function DailySummary({ 
  entries = [], 
  shiftType, 
  supportHours = 3.5,  // Valor por defecto
  laborStandard 
}: DailySummaryProps) {
  const [metrics, setMetrics] = useState({
    targetEfficiency: 0,
    actualEfficiency: 0,
    shift: {
      totalTarget: 0,
      totalProduced: 0
    },
    accumulated: {
      delta: 0,
      lostTime: 0
    },
    headCount: {
      current: 0,
      capacity: 0
    }
  });

  // Agregar useEffect para recalcular métricas cuando cambien las entries
  useEffect(() => {
    calculateMetrics();
  }, [entries]); // Dependencia en entries

  const calculateEfficiency = (production: number, target: number): number => {
    if (!target) return 0;
    return ((production / target) - 1) * 100;
  };

  const calculateMetrics = () => {
    if (entries.length === 0) return;

    // Obtener las entradas activas (hasta la hora actual)
    const currentHourIndex = entries.findIndex(entry => !entry.dailyProduction);
    const activeEntries = currentHourIndex === -1 ? entries : entries.slice(0, currentHourIndex + 1);

    // 1. Cálculo de Eficiencia Meta Turno
    const efficiencyMetrics = activeEntries.reduce((acc, entry) => {
      if (!entry.realHeadCount || !entry.partNumber) return acc;
      
      const laborStd = getLaborStandard(entry.partNumber);
      const hoursInPeriod = 1; // cada entrada representa 1 hora
      const supportHoursInPeriod = supportHours * hoursInPeriod;
      
      return {
        totalTarget: acc.totalTarget + entry.hourlyTarget,
        laborStd: laborStd, // usamos el último labor std (asumiendo que es el mismo para el turno)
        totalHC: acc.totalHC + (entry.realHeadCount * hoursInPeriod),
        totalSupportHours: acc.totalSupportHours + supportHoursInPeriod
      };
    }, { 
      totalTarget: 0, 
      laborStd: 0, 
      totalHC: 0, 
      totalSupportHours: 0 
    });

    // Calcular Eficiencia Meta Turno
    const targetEfficiency = efficiencyMetrics.totalHC > 0
      ? (efficiencyMetrics.totalTarget * efficiencyMetrics.laborStd) / 
        (efficiencyMetrics.totalHC + efficiencyMetrics.totalSupportHours) * 100
      : 0;

    // 2. Cálculo de Downtimes (solo deltas negativos)
    const downtimes = activeEntries.reduce((acc, entry) => {
      const delta = (entry.dailyProduction || 0) - entry.hourlyTarget;
      return acc + (delta < 0 ? Math.abs(delta) : 0);
    }, 0);

    // 3. Cálculo de Tiempo Perdido
    const lostTime = activeEntries.reduce((acc, entry) => {
      return acc + calculateLostTime(entry);
    }, 0);

    // Calcular totales del turno
    const shiftTotals = entries.reduce((acc, entry) => ({
      target: acc.target + entry.hourlyTarget,
      produced: acc.produced + (entry.dailyProduction || 0)
    }), { target: 0, produced: 0 });

    // Obtener último HC registrado
    const lastEntry = entries[entries.length - 1];

    setMetrics({
      targetEfficiency,
      actualEfficiency: 0, // Este valor lo mantenemos por ahora
      shift: {
        totalTarget: shiftTotals.target,
        totalProduced: shiftTotals.produced
      },
      accumulated: {
        delta: downtimes, // Ahora solo muestra la suma de deltas negativos
        lostTime: lostTime
      },
      headCount: {
        current: lastEntry?.realHeadCount || 0,
        capacity: lastEntry?.theoreticalHC || 0
      }
    });
  };

  const calculateLostTime = (entry: ProductionEntry): number => {
    if (!entry.hourlyTarget || !entry.dailyProduction) return 0;
    const delta = entry.dailyProduction - entry.hourlyTarget;
    if (delta >= 0) return 0;
    
    // Tiempo perdido = (Delta negativo) / (Meta por hora / 60 minutos)
    return Math.abs(delta) / (entry.hourlyTarget / 60);
  };

  const getLaborStandard = (partNumber: string): number => {
    const part = PART_NUMBERS.find(p => p.code === partNumber);
    return part?.laborStd || 0;
  };

  const calculateHourlyEfficiency = (entry: ProductionEntry): {
    targetEfficiency: number;
    actualEfficiency: number;
  } => {
    if (!entry.realHeadCount || !entry.partNumber) return { targetEfficiency: 0, actualEfficiency: 0 };

    // Obtener el Labor Standard del número de parte
    const laborStd = getLaborStandard(entry.partNumber);
    
    // Horas trabajadas = HC Real + Horas de soporte (3.5)
    const workedHours = entry.realHeadCount + supportHours;

    // Eficiencia Meta = (Meta por hora * Labor Std) / Horas trabajadas
    const targetEfficiency = (entry.hourlyTarget * laborStd) / workedHours * 100;

    // Eficiencia Real = (Producción real * Labor Std) / Horas trabajadas
    const actualEfficiency = ((entry.dailyProduction || 0) * laborStd) / workedHours * 100;

    // Log para debug
    console.log('Calculated hourly efficiency:', {
      hour: entry.hour,
      partNumber: entry.partNumber,
      laborStd,
      workedHours,
      targetEfficiency,
      actualEfficiency,
      inputs: {
        hourlyTarget: entry.hourlyTarget,
        dailyProduction: entry.dailyProduction,
        realHeadCount: entry.realHeadCount,
        supportHours
      }
    });

    return {
      targetEfficiency: isNaN(targetEfficiency) ? 0 : targetEfficiency,
      actualEfficiency: isNaN(actualEfficiency) ? 0 : actualEfficiency
    };
  };

  // Calcular totales para la fila final
  const calculateTotals = () => {
    return entries.reduce((acc, entry) => {
      const { targetEfficiency, actualEfficiency } = calculateHourlyEfficiency(entry);
      return {
        target: acc.target + entry.hourlyTarget,
        actual: acc.actual + (entry.dailyProduction || 0),
        delta: acc.delta + ((entry.dailyProduction || 0) - entry.hourlyTarget),
        efficiency: acc.efficiency + targetEfficiency,
        lostTime: acc.lostTime + calculateLostTime(entry)
      };
    }, { target: 0, actual: 0, delta: 0, efficiency: 0, lostTime: 0 });
  };

  // Actualizar el cálculo de eficiencia para la tabla
  const calculateRowEfficiency = (production: number, target: number): number => {
    if (!target) return 0;
    return (production / target) * 100;
  };

  // Agregar función para calcular la tendencia
  const getEfficiencyTrend = (entries: ProductionEntry[]): {
    trend: 'up' | 'down' | 'neutral';
    difference: number;
  } => {
    if (entries.length < 2) return { trend: 'neutral', difference: 0 };

    const activeEntries = entries.filter(entry => entry.dailyProduction !== null);
    if (activeEntries.length < 2) return { trend: 'neutral', difference: 0 };

    const currentEfficiency = metrics.targetEfficiency;
    const previousEntry = activeEntries[activeEntries.length - 2];
    const previousEfficiency = calculateHourlyEfficiency(previousEntry).targetEfficiency;

    const difference = currentEfficiency - previousEfficiency;
    return {
      trend: difference > 0 ? 'up' : difference < 0 ? 'down' : 'neutral',
      difference: Math.abs(difference)
    };
  };

  return (
    <div className="space-y-4">
      {/* Banner de período acumulado */}
      <div className="bg-gray-100 p-3 rounded-lg text-center">
        <p className="text-sm text-gray-600 font-medium">
          <Clock className="h-4 w-4 inline-block mr-2" />
          Acumulado {entries.length > 0 
            ? `${entries[0].hour} - ${entries[entries.length - 1].hour}`
            : 'Sin datos'}
        </p>
      </div>

      {/* Cards principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Meta Total Turno */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Meta Total Turno</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-gray-900">
                  {metrics.shift.totalTarget}
                </p>
                <p className="ml-2 text-sm text-gray-500">unidades</p>
              </div>
            </div>
            <Target className="h-8 w-8 text-indigo-500" />
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Producción Acumulada</p>
              <p className="text-lg font-semibold text-gray-900">
                {metrics.shift.totalProduced}
              </p>
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-500 rounded-full h-2"
                  style={{ 
                    width: `${Math.min(
                      (metrics.shift.totalProduced / metrics.shift.totalTarget) * 100,
                      100
                    )}%` 
                  }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {metrics.shift.totalTarget > 0 
                  ? ((metrics.shift.totalProduced / metrics.shift.totalTarget) * 100).toFixed(1)
                  : '0.0'}% completado
              </p>
            </div>
          </div>
        </div>

        {/* Eficiencia Meta Turno */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Eficiencia Meta Turno</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-gray-900">
                  {metrics.targetEfficiency.toFixed(1)}%
                </p>
                {(() => {
                  const { trend, difference } = getEfficiencyTrend(entries);
                  return trend !== 'neutral' ? (
                    <div className="flex items-center">
                      {trend === 'up' ? (
                        <TrendingUp className="h-5 w-5 text-green-500" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-500" />
                      )}
                      <span className={`text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                        {difference.toFixed(1)}%
                      </span>
                    </div>
                  ) : null
                })()}
              </div>
            </div>
            <Target className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        {/* Delta */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Delta</p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics.accumulated.delta}
              </p>
              <p className="text-sm text-gray-500">unidades</p>
            </div>
            <TrendingDown className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        {/* Tiempo Perdido */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tiempo Perdido</p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics.accumulated.lostTime.toFixed(0)}
              </p>
              <p className="text-sm text-gray-500">minutos</p>
            </div>
            <Clock className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Tabla actualizada */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hora</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Meta</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Real</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Eficiencia</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delta</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tiempo Perdido</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(entry => {
              const efficiency = calculateRowEfficiency(entry.dailyProduction || 0, entry.hourlyTarget);
              const delta = (entry.dailyProduction || 0) - entry.hourlyTarget;
              
              return (
                <tr key={entry.hour}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{entry.hour}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{entry.hourlyTarget}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{entry.dailyProduction || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{efficiency.toFixed(1)}%</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${delta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {delta}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {calculateLostTime(entry).toFixed(2)} min
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer con Head Count */}
      <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-purple-500">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Head Count</p>
              <p className="text-xs text-gray-400">
                {entries.length > 0 
                  ? `${entries[0].hour} - ${entries[entries.length - 1].hour}`
                  : 'Sin datos'}
              </p>
            </div>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold text-gray-900">
                {metrics.headCount.current}
              </p>
              <p className="ml-2 text-sm text-gray-500">
                / {metrics.headCount.capacity}
              </p>
            </div>
            <p className="text-sm text-gray-500">
              {((metrics.headCount.current / metrics.headCount.capacity) * 100).toFixed(1)}% de capacidad
            </p>
          </div>
          <Users className="h-8 w-8 text-purple-500" />
        </div>
      </div>
    </div>
  );
}