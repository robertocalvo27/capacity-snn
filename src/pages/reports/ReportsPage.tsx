import React, { useState } from 'react';
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  Download,
  FileSpreadsheet,
  Calendar,
  Filter,
  RefreshCcw,
  Share2
} from 'lucide-react';

export function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('efficiency');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  const reports = [
    {
      id: 'efficiency',
      name: 'Eficiencia por Línea',
      description: 'Análisis detallado de eficiencia por línea de producción',
      icon: TrendingUp,
      color: 'blue'
    },
    {
      id: 'production',
      name: 'Producción por Turno',
      description: 'Métricas de producción desglosadas por turno',
      icon: BarChart3,
      color: 'green'
    },
    {
      id: 'quality',
      name: 'Indicadores de Calidad',
      description: 'Métricas de calidad y rechazos',
      icon: PieChart,
      color: 'purple'
    },
    {
      id: 'trends',
      name: 'Tendencias y Pronósticos',
      description: 'Análisis de tendencias y proyecciones',
      icon: LineChart,
      color: 'orange'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reportes</h1>
            <p className="text-gray-500">Análisis y métricas de producción</p>
          </div>
          <div className="flex space-x-2">
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Excel
            </button>
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4 mr-2" />
              PDF
            </button>
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Share2 className="w-4 h-4 mr-2" />
              Compartir
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Inicial
            </label>
            <div className="relative">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Final
            </label>
            <div className="relative">
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="flex space-x-2">
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Filter className="w-4 h-4 mr-2" />
              Aplicar Filtros
            </button>
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <RefreshCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reports.map((report) => (
          <button
            key={report.id}
            onClick={() => setSelectedReport(report.id)}
            className={`p-6 rounded-lg border-2 transition-all ${
              selectedReport === report.id
                ? `border-${report.color}-500 bg-${report.color}-50`
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <report.icon className={`w-8 h-8 text-${report.color}-500 mb-4`} />
            <h3 className="text-lg font-medium text-gray-900">{report.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{report.description}</p>
          </button>
        ))}
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {selectedReport === 'efficiency' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Eficiencia por Línea</h2>
            <div className="aspect-[2/1] bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Gráfico de eficiencia por línea</p>
            </div>
          </div>
        )}
        
        {selectedReport === 'production' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Producción por Turno</h2>
            <div className="aspect-[2/1] bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Gráfico de producción por turno</p>
            </div>
          </div>
        )}
        
        {selectedReport === 'quality' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Indicadores de Calidad</h2>
            <div className="aspect-[2/1] bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Gráfico de indicadores de calidad</p>
            </div>
          </div>
        )}
        
        {selectedReport === 'trends' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Tendencias y Pronósticos</h2>
            <div className="aspect-[2/1] bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Gráfico de tendencias y pronósticos</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}