import React, { useState } from 'react';
import { 
  Search,
  Calendar,
  Download,
  FileSpreadsheet,
  Upload,
  Target,
  CheckCircle2,
  AlertTriangle,
  Filter
} from 'lucide-react';

interface Activity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  details: string;
  date: string;
  time: string;
  status: 'success' | 'warning' | 'error';
}

const mockActivities: Activity[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Juan Pérez',
    action: 'Ingreso de Datos',
    module: 'Safety',
    details: 'Ingresó datos para Línea 01, Turno T2',
    date: '2024-01-14',
    time: '14:30',
    status: 'success'
  },
  {
    id: '2',
    userId: '2',
    userName: 'María García',
    action: 'Plan de Acción',
    module: 'Quality',
    details: 'Creó plan de acción "Falta de personal"',
    date: '2024-01-13',
    time: '09:15',
    status: 'warning'
  },
  {
    id: '3',
    userId: '3',
    userName: 'Carlos Rodríguez',
    action: 'Actualización KPI',
    module: 'Production',
    details: 'Actualizó métricas de producción',
    date: '2024-01-12',
    time: '16:45',
    status: 'success'
  }
];

export const ActivityAudit: React.FC = () => {
  const [activities] = useState<Activity[]>(mockActivities);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [selectedModule, setSelectedModule] = useState<string>('all');

  const modules = ['Safety', 'Quality', 'Production', 'Delivery', 'Cost'];

  const getStatusIcon = (status: Activity['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'Ingreso de Datos':
        return <Upload className="w-5 h-5 text-blue-500" />;
      case 'Plan de Acción':
        return <Target className="w-5 h-5 text-purple-500" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Auditoría de Actividad</h1>
            <p className="text-gray-500">Registro de todas las acciones realizadas en el sistema</p>
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
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar actividades..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Módulo
            </label>
            <div className="relative">
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todos los módulos</option>
                {modules.map((module) => (
                  <option key={module} value={module}>{module}</option>
                ))}
              </select>
              <Filter className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

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
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flow-root">
          <ul className="-mb-8">
            {activities.map((activity, activityIdx) => (
              <li key={activity.id}>
                <div className="relative pb-8">
                  {activityIdx !== activities.length - 1 ? (
                    <span
                      className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex items-start space-x-3">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center ring-8 ring-white">
                        {getActionIcon(activity.action)}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1 py-1.5">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          <span className="font-medium text-gray-900">
                            {activity.userName}
                          </span>{' '}
                          realizó{' '}
                          <span className="font-medium text-gray-900">
                            {activity.action}
                          </span>{' '}
                          en{' '}
                          <span className="font-medium text-gray-900">
                            {activity.module}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(activity.status)}
                          <p className="text-sm text-gray-500">
                            {new Date(activity.date).toLocaleDateString()} {activity.time}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-700">
                        {activity.details}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};