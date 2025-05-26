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
  Factory,
  Activity,
  Filter,
  RefreshCcw
} from 'lucide-react';

interface LineStats {
  id: string;
  name: string;
  dailyTarget: number;
  currentProduction: number;
  efficiency: number;
  headcount: {
    actual: number;
    required: number;
  };
  status: 'success' | 'warning' | 'danger';
  alerts: number;
}

export function SupervisorDashboard() {
  const [selectedLine, setSelectedLine] = useState<string | null>(null);
  
  const [lines] = useState<LineStats[]>([
    {
      id: 'L07',
      name: 'Línea 07',
      dailyTarget: 1200,
      currentProduction: 980,
      efficiency: 85,
      headcount: { actual: 42, required: 45 },
      status: 'warning',
      alerts: 2
    },
    {
      id: 'L08',
      name: 'Línea 08',
      dailyTarget: 1500,
      currentProduction: 1450,
      efficiency: 97,
      headcount: { actual: 45, required: 45 },
      status: 'success',
      alerts: 0
    },
    {
      id: 'L09',
      name: 'Línea 09',
      dailyTarget: 800,
      currentProduction: 650,
      efficiency: 78,
      headcount: { actual: 38, required: 42 },
      status: 'danger',
      alerts: 3
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'danger': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-50 border-green-500';
      case 'warning': return 'bg-yellow-50 border-yellow-500';
      case 'danger': return 'bg-red-50 border-red-500';
      default: return 'bg-gray-50 border-gray-500';
    }
  };

  const totalStats = {
    production: lines.reduce((acc, line) => acc + line.currentProduction, 0),
    target: lines.reduce((acc, line) => acc + line.dailyTarget, 0),
    efficiency: Math.round(
      lines.reduce((acc, line) => acc + line.efficiency, 0) / lines.length
    ),
    headcount: {
      actual: lines.reduce((acc, line) => acc + line.headcount.actual, 0),
      required: lines.reduce((acc, line) => acc + line.headcount.required, 0)
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard de Supervisor</h1>
            <p className="text-gray-500">Vista general de todas las líneas - Turno T1</p>
          </div>
          <div className="flex space-x-2">
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </button>
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <RefreshCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* KPIs Generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Producción Total */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Producción Total</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-gray-900">{totalStats.production}</p>
                <p className="ml-2 text-sm text-gray-500">/ {totalStats.target}</p>
              </div>
            </div>
            <Target className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-2 flex items-center">
            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            <p className="text-sm text-red-500">
              {totalStats.production - totalStats.target} vs meta
            </p>
          </div>
        </div>

        {/* Eficiencia Promedio */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Eficiencia Promedio</p>
              <p className="text-2xl font-bold text-gray-900">{totalStats.efficiency}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-500 h-2.5 rounded-full" 
                style={{ width: `${totalStats.efficiency}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Head Count Total */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Head Count Total</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-gray-900">{totalStats.headcount.actual}</p>
                <p className="ml-2 text-sm text-gray-500">/ {totalStats.headcount.required}</p>
              </div>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
          <div className="mt-2 flex items-center">
            <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
            <p className="text-sm text-yellow-500">
              Faltante: {totalStats.headcount.required - totalStats.headcount.actual}
            </p>
          </div>
        </div>

        {/* Alertas Activas */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Alertas Activas</p>
              <p className="text-2xl font-bold text-gray-900">
                {lines.reduce((acc, line) => acc + line.alerts, 0)}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <div className="mt-2 flex items-center">
            <Activity className="h-4 w-4 text-blue-500 mr-1" />
            <p className="text-sm text-blue-500">Requieren atención</p>
          </div>
        </div>
      </div>

      {/* Estado de Líneas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {lines.map(line => (
          <div
            key={line.id}
            className={`bg-white p-6 rounded-lg shadow-lg border-l-4 ${getStatusBg(line.status)}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{line.name}</h3>
                <p className="text-sm text-gray-500">
                  {line.currentProduction} / {line.dailyTarget} unidades
                </p>
              </div>
              <Factory className={`h-6 w-6 ${getStatusColor(line.status)}`} />
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Eficiencia</span>
                  <span className={getStatusColor(line.status)}>{line.efficiency}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      line.status === 'success' ? 'bg-green-500' :
                      line.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${line.efficiency}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Head Count</p>
                  <p className="text-sm font-medium">
                    {line.headcount.actual} / {line.headcount.required}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Alertas</p>
                  <p className={`text-sm font-medium ${
                    line.alerts > 0 ? 'text-red-500' : 'text-green-500'
                  }`}>
                    {line.alerts}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedLine(line.id)}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Ver detalles
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}