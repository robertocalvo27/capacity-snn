import React, { useState } from 'react';
import { 
  Shield, 
  BadgeCheck, 
  Truck, 
  Factory, 
  DollarSign, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle, 
  CheckCircle2, 
  FileSpreadsheet, 
  Share2, 
  Calendar, 
  Filter, 
  Download,
  Target,
  BarChart,
  Clock,
  ListFilter
} from 'lucide-react';
import { ParetoAnalysis } from './components/ParetoAnalysis';
import { ActionPlanForm } from './components/ActionPlanForm';

// Mock data for statistics
const mockStats = {
  totalPlans: 124,
  completedPlans: 98,
  onTrack: 85,
  efficiency: 92
};

// Mock data for action plans
const mockActionPlans = [
  {
    id: '1',
    area: 'Production',
    metric: 'Yield',
    status: 'in-progress',
    progress: 75,
    dueDate: '2024-02-15',
    responsible: 'Juan Pérez',
    actions: 8,
    completedActions: 6,
    causes: [
      { id: '1', description: 'Falta de material', units: 45, comments: 'Retrasos en entregas de proveedores' },
      { id: '2', description: 'Tiempo muerto por cambios', units: 30, comments: 'Cambios de PN frecuentes' },
      { id: '3', description: 'Problemas de calidad', units: 25, comments: 'Material no conforme' }
    ],
    followupActions: [
      { id: '1', description: 'Implementar sistema Kanban', status: 'completed', date: '2024-01-15', comments: 'Sistema implementado en L07' },
      { id: '2', description: 'Optimizar cambios de PN', status: 'in-progress', date: '2024-02-01', comments: 'En proceso de SMED' },
      { id: '3', description: 'Auditar proveedores', status: 'pending', date: '2024-02-10', comments: 'Programar visitas' }
    ]
  },
  {
    id: '2',
    area: 'Quality',
    metric: 'First Pass Yield',
    status: 'in-progress',
    progress: 60,
    dueDate: '2024-02-19',
    responsible: 'María García',
    actions: 6,
    completedActions: 4,
    causes: [
      { id: '1', description: 'Error en sellado', units: 40, comments: 'Variación en temperatura' },
      { id: '2', description: 'Defectos visuales', units: 35, comments: 'Inspección insuficiente' },
      { id: '3', description: 'Etiquetado incorrecto', units: 25, comments: 'Error en sistema de impresión' }
    ],
    followupActions: [
      { id: '1', description: 'Calibrar selladoras', status: 'completed', date: '2024-01-25', comments: 'Ajustes realizados' },
      { id: '2', description: 'Entrenar inspectores', status: 'in-progress', date: '2024-02-05', comments: 'Capacitación en proceso' },
      { id: '3', description: 'Actualizar sistema', status: 'pending', date: '2024-02-20', comments: 'Pendiente IT' }
    ]
  },
  {
    id: '3',
    area: 'Delivery',
    metric: 'On Time Delivery',
    status: 'delayed',
    progress: 40,
    dueDate: '2024-02-09',
    responsible: 'Carlos Rodríguez',
    actions: 5,
    completedActions: 2,
    causes: [
      { id: '1', description: 'Retrasos en producción', units: 50, comments: 'Bajo head count' },
      { id: '2', description: 'Problemas de empaque', units: 30, comments: 'Falta material de empaque' },
      { id: '3', description: 'Documentación incompleta', units: 20, comments: 'Errores en DHR' }
    ],
    followupActions: [
      { id: '1', description: 'Ajustar head count', status: 'in-progress', date: '2024-02-01', comments: 'Reclutamiento activo' },
      { id: '2', description: 'Gestionar material', status: 'completed', date: '2024-01-20', comments: 'Orden colocada' },
      { id: '3', description: 'Revisar procedimiento', status: 'pending', date: '2024-02-15', comments: 'Pendiente QA' }
    ]
  }
];

// Componente para mostrar el seguimiento
const FollowupView = ({ actions }: { actions: any[] }) => (
  <div className="mt-4">
    <h4 className="text-lg font-medium text-gray-900 mb-4">Seguimiento de Acciones</h4>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acción</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comentarios</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {actions.map((action) => (
            <tr key={action.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{action.description}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  action.status === 'completed' ? 'bg-green-100 text-green-800' :
                  action.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {action.status === 'completed' ? 'Completado' :
                   action.status === 'in-progress' ? 'En Progreso' :
                   'Pendiente'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(action.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">{action.comments}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export function ActionPlansHistory() {
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'list' | 'pareto' | 'plan'>('list');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'delayed':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getAreaIcon = (area: string) => {
    switch (area) {
      case 'Safety':
        return <Shield className="w-5 h-5" />;
      case 'Quality':
        return <BadgeCheck className="w-5 h-5" />;
      case 'Production':
        return <Factory className="w-5 h-5" />;
      case 'Delivery':
        return <Truck className="w-5 h-5" />;
      case 'Cost':
        return <DollarSign className="w-5 h-5" />;
      default:
        return <Target className="w-5 h-5" />;
    }
  };

  const renderExpandedContent = (plan: any) => {
    switch (currentView) {
      case 'pareto':
        return (
          <div className="mt-4">
            <ParetoAnalysis
              onComplete={() => {}}
              initialCauses={plan.causes}
              readOnly={true}
            />
          </div>
        );
      case 'plan':
        return (
          <div className="mt-4">
            <ActionPlanForm
              causes={plan.causes}
              onComplete={() => {}}
            />
          </div>
        );
      case 'list':
        return <FollowupView actions={plan.followupActions} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Target className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total de Planes</p>
              <h3 className="text-xl font-bold text-gray-900">{mockStats.totalPlans}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Planes Completados</p>
              <h3 className="text-xl font-bold text-gray-900">{mockStats.completedPlans}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <Clock className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">En Tiempo</p>
              <h3 className="text-xl font-bold text-gray-900">{mockStats.onTrack}%</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <BarChart className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Eficiencia</p>
              <h3 className="text-xl font-bold text-gray-900">{mockStats.efficiency}%</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Área</label>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">Todas</option>
                <option value="safety">Safety</option>
                <option value="quality">Quality</option>
                <option value="delivery">Delivery</option>
                <option value="production">Production</option>
                <option value="cost">Cost</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">Todos</option>
                <option value="completed">Completados</option>
                <option value="in-progress">En Progreso</option>
                <option value="delayed">Retrasados</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Exportar
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Share2 className="w-4 h-4 mr-2" />
              Compartir
            </button>
          </div>
        </div>

        {/* Action Plans List */}
        <div className="space-y-4">
          {mockActionPlans.map((plan) => (
            <div key={plan.id} className="border rounded-lg">
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedPlan(expandedPlan === plan.id ? null : plan.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getAreaIcon(plan.area)}
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {plan.area} - {plan.metric}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Responsable: {plan.responsible} | Vencimiento: {new Date(plan.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    {getStatusIcon(plan.status)}
                    <div className="ml-2">
                      <div className="h-2 w-24 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-blue-600 rounded-full"
                          style={{ width: `${plan.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {plan.completedActions} de {plan.actions} acciones
                      </p>
                    </div>
                  </div>
                  {expandedPlan === plan.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>

              {expandedPlan === plan.id && (
                <div className="border-t p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => setCurrentView('plan')}
                      className={`flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md ${
                        currentView === 'plan'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Plan de Acción
                    </button>
                    <button
                      onClick={() => setCurrentView('list')}
                      className={`flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md ${
                        currentView === 'list'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <ListFilter className="w-4 h-4 mr-2" />
                      Seguimiento
                    </button>
                    <button
                      onClick={() => setCurrentView('pareto')}
                      className={`flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md ${
                        currentView === 'pareto'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <BarChart className="w-4 h-4 mr-2" />
                      Análisis de Pareto
                    </button>
                  </div>
                  {renderExpandedContent(plan)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}