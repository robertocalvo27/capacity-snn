import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Clock, CheckCircle, AlertCircle, Plus, Filter, Search, BarChart3, User } from 'lucide-react';
import { TrainingCurve, TrainingCurveImpact, TrainingProgress } from '@/types/capacity';
import { trainingCurveService } from '@/services/trainingCurveService';
import TrainingCurveModal from './TrainingCurveModal';
import ProgressTrackingModal from './ProgressTrackingModal';
import CapacityImpactChart from './CapacityImpactChart';

interface TrainingCurvesTabProps {
  onSave: () => void;
}

const TrainingCurvesTab: React.FC<TrainingCurvesTabProps> = ({ onSave }) => {
  // Estados principales
  const [trainingCurves, setTrainingCurves] = useState<TrainingCurve[]>([]);
  const [capacityImpacts, setCapacityImpacts] = useState<TrainingCurveImpact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCurves, setSelectedCurves] = useState<string[]>([]);

  // Estados de modales
  const [showCurveModal, setShowCurveModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [editingCurve, setEditingCurve] = useState<TrainingCurve | null>(null);

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValueStream, setFilterValueStream] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<TrainingCurve['status'] | ''>('');
  const [filterShift, setFilterShift] = useState<'T1' | 'T2' | 'T3' | ''>('');

  // Estados de estadísticas
  const [statistics, setStatistics] = useState({
    totalActive: 0,
    totalCompleted: 0,
    totalPending: 0,
    averageEfficiency: 0,
    totalCapacityImpact: 0
  });

  // Estados de vista
  const [activeView, setActiveView] = useState<'list' | 'impact' | 'statistics'>('list');

  useEffect(() => {
    loadTrainingData();
  }, [filterValueStream, filterStatus, filterShift]);

  const loadTrainingData = async () => {
    try {
      setLoading(true);
      
      const filters = {
        valueStream: filterValueStream || undefined,
        status: filterStatus || undefined,
        shift: filterShift || undefined
      };

      const [curves, impacts, stats] = await Promise.all([
        trainingCurveService.getTrainingCurves(filters),
        trainingCurveService.calculateCapacityImpact(filterValueStream || undefined),
        trainingCurveService.getTrainingStatistics()
      ]);

      setTrainingCurves(curves);
      setCapacityImpacts(impacts);
      setStatistics(stats);
    } catch (error) {
      console.error('Error loading training data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCurve = () => {
    setEditingCurve(null);
    setShowCurveModal(true);
  };

  const handleEditCurve = (curve: TrainingCurve) => {
    setEditingCurve(curve);
    setShowCurveModal(true);
  };

  const handleTrackProgress = (curve: TrainingCurve) => {
    setEditingCurve(curve);
    setShowProgressModal(true);
  };

  const handleSaveCurve = async (curveData: Partial<TrainingCurve>) => {
    try {
      if (editingCurve) {
        await trainingCurveService.updateTrainingCurve(editingCurve.id!, curveData);
      } else {
        await trainingCurveService.createTrainingCurve(curveData as any);
      }
      
      await loadTrainingData();
      setShowCurveModal(false);
      setEditingCurve(null);
      onSave();
    } catch (error) {
      console.error('Error saving training curve:', error);
    }
  };

  const handleCurveSelection = (curveId: string) => {
    setSelectedCurves(prev => 
      prev.includes(curveId) 
        ? prev.filter(id => id !== curveId)
        : [...prev, curveId]
    );
  };

  const getStatusIcon = (status: TrainingCurve['status']) => {
    switch (status) {
      case 'active':
        return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'on_hold':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: TrainingCurve['status']) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'on_hold':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-green-600';
    if (efficiency >= 70) return 'text-amber-600';
    return 'text-red-600';
  };

  const filteredCurves = trainingCurves.filter(curve =>
    curve.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    curve.operation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    curve.employeeNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const VALUE_STREAMS = ['ENT', 'SM', 'JR', 'WND', 'APO'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Users className="w-6 h-6 mr-3 text-blue-600" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Curvas de Entrenamiento</h3>
              <p className="text-sm text-gray-500">
                Gestión y seguimiento de empleados en proceso de entrenamiento
              </p>
            </div>
          </div>

          <button
            onClick={handleCreateCurve}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Curva
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 border-b border-gray-200">
          {[
            { key: 'list', label: 'Lista de Curvas', icon: Users },
            { key: 'impact', label: 'Impacto en Capacidad', icon: BarChart3 },
            { key: 'statistics', label: 'Estadísticas', icon: TrendingUp }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveView(key as any)}
              className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeView === key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-blue-600">Activas</div>
          <div className="text-2xl font-bold text-blue-700">{statistics.totalActive}</div>
          <div className="text-xs text-blue-600">en entrenamiento</div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-green-600">Completadas</div>
          <div className="text-2xl font-bold text-green-700">{statistics.totalCompleted}</div>
          <div className="text-xs text-green-600">este período</div>
        </div>
        
        <div className="bg-amber-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-amber-600">Pendientes</div>
          <div className="text-2xl font-bold text-amber-700">{statistics.totalPending}</div>
          <div className="text-xs text-amber-600">por aprobar</div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-purple-600">Eficiencia Prom.</div>
          <div className="text-2xl font-bold text-purple-700">{statistics.averageEfficiency}%</div>
          <div className="text-xs text-purple-600">curvas activas</div>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-red-600">Impacto Capacidad</div>
          <div className="text-2xl font-bold text-red-700">{statistics.totalCapacityImpact}%</div>
          <div className="text-xs text-red-600">reducción total</div>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      {activeView === 'list' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Nombre, operación, número..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Value Stream
              </label>
              <select
                value={filterValueStream}
                onChange={(e) => setFilterValueStream(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos los VST</option>
                {VALUE_STREAMS.map(vs => (
                  <option key={vs} value={vs}>{vs}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos los estados</option>
                <option value="pending">Pendiente</option>
                <option value="active">Activa</option>
                <option value="completed">Completada</option>
                <option value="on_hold">En Pausa</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Turno
              </label>
              <select
                value={filterShift}
                onChange={(e) => setFilterShift(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos los turnos</option>
                <option value="T1">Turno 1</option>
                <option value="T2">Turno 2</option>
                <option value="T3">Turno 3</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{filteredCurves.length}</span> curvas encontradas
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenido Principal */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {activeView === 'list' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          checked={selectedCurves.length === filteredCurves.length && filteredCurves.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCurves(filteredCurves.map(curve => curve.id!));
                            } else {
                              setSelectedCurves([]);
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Empleado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Operación
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Eficiencia
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progreso
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCurves.map((curve) => {
                      const isSelected = selectedCurves.includes(curve.id!);
                      const progressPercentage = (curve.currentEfficiency / curve.targetEfficiency) * 100;
                      
                      return (
                        <tr key={curve.id} className={isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleCurveSelection(curve.id!)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <User className="w-5 h-5 text-gray-500" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {curve.employeeName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {curve.employeeNumber} • {curve.position}
                                </div>
                              </div>
                            </div>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{curve.operation}</div>
                            <div className="text-sm text-gray-500">
                              {curve.valueStream} • {curve.line} • {curve.shift}
                            </div>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm font-medium ${getEfficiencyColor(curve.currentEfficiency)}`}>
                              {curve.currentEfficiency}%
                            </div>
                            <div className="text-sm text-gray-500">
                              Target: {curve.targetEfficiency}%
                            </div>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {Math.round(progressPercentage)}% completado
                            </div>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getStatusIcon(curve.status)}
                              <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(curve.status)}`}>
                                {curve.status === 'active' ? 'Activa' :
                                 curve.status === 'completed' ? 'Completada' :
                                 curve.status === 'pending' ? 'Pendiente' :
                                 curve.status === 'on_hold' ? 'En Pausa' : 'Cancelada'}
                              </span>
                            </div>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleTrackProgress(curve)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Seguimiento de progreso"
                              >
                                <TrendingUp className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEditCurve(curve)}
                                className="text-gray-600 hover:text-gray-900"
                                title="Editar curva"
                              >
                                <Filter className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeView === 'impact' && (
            <CapacityImpactChart impacts={capacityImpacts} />
          )}

          {activeView === 'statistics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gráfico de distribución por estado */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Distribución por Estado
                </h4>
                {/* Aquí iría un gráfico de pie chart */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Activas</span>
                    <span className="text-sm font-medium text-blue-600">{statistics.totalActive}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Completadas</span>
                    <span className="text-sm font-medium text-green-600">{statistics.totalCompleted}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Pendientes</span>
                    <span className="text-sm font-medium text-amber-600">{statistics.totalPending}</span>
                  </div>
                </div>
              </div>

              {/* Impacto por Value Stream */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Impacto por Value Stream
                </h4>
                <div className="space-y-3">
                  {capacityImpacts.slice(0, 5).map((impact, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {impact.valueStream} {impact.shift}
                      </span>
                      <span className="text-sm font-medium text-red-600">
                        -{impact.capacityImpact}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modales */}
      {showCurveModal && (
        <TrainingCurveModal
          curve={editingCurve}
          onSave={handleSaveCurve}
          onCancel={() => {
            setShowCurveModal(false);
            setEditingCurve(null);
          }}
        />
      )}

      {showProgressModal && editingCurve && (
        <ProgressTrackingModal
          curve={editingCurve}
          onSave={async (progress: Omit<TrainingProgress, 'week'>) => {
            await trainingCurveService.addWeeklyProgress(editingCurve.id!, progress);
            await loadTrainingData();
            setShowProgressModal(false);
            setEditingCurve(null);
            onSave();
          }}
          onCancel={() => {
            setShowProgressModal(false);
            setEditingCurve(null);
          }}
        />
      )}
    </div>
  );
};

export default TrainingCurvesTab; 