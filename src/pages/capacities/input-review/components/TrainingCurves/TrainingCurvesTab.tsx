import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, TrendingDown, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { learningCurveService } from '../../../../../services/trainingCurveService';
import type { LearningCurveAdjustment, LearningCurveImpact, LearningCurveStats } from '../../../../../types/capacity';
import LearningCurveModal from './LearningCurveModal';
import CapacityImpactChart from './CapacityImpactChart';

interface TrainingCurvesTabProps {
  selectedValueStream: string;
}

const TrainingCurvesTab: React.FC<TrainingCurvesTabProps> = ({ selectedValueStream }) => {
  const [adjustments, setAdjustments] = useState<LearningCurveAdjustment[]>([]);
  const [filteredAdjustments, setFilteredAdjustments] = useState<LearningCurveAdjustment[]>([]);
  const [impacts, setImpacts] = useState<LearningCurveImpact[]>([]);
  const [stats, setStats] = useState<LearningCurveStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [lineFilter, setLineFilter] = useState('all');
  const [activeView, setActiveView] = useState<'list' | 'impact' | 'stats'>('list');
  const [selectedAdjustments, setSelectedAdjustments] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAdjustment, setEditingAdjustment] = useState<LearningCurveAdjustment | null>(null);

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  // Filter adjustments when search or filters change
  useEffect(() => {
    filterAdjustments();
  }, [adjustments, searchTerm, statusFilter, lineFilter, selectedValueStream]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [adjustmentsData, impactsData, statsData] = await Promise.all([
        learningCurveService.getAllAdjustments(),
        learningCurveService.getCapacityImpact(),
        learningCurveService.getStatistics()
      ]);
      
      setAdjustments(adjustmentsData);
      setImpacts(impactsData);
      setStats(statsData);
    } catch (err) {
      setError('Error cargando datos de ajustes por curva de aprendizaje');
      console.error('Error loading learning curve data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterAdjustments = () => {
    let filtered = adjustments;

    // Filter by Value Stream
    if (selectedValueStream !== 'all') {
      filtered = filtered.filter(adj => adj.valueStream === selectedValueStream);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(adj => 
        adj.operation.toLowerCase().includes(term) ||
        adj.productionLine.toLowerCase().includes(term) ||
        adj.operationCode.toLowerCase().includes(term) ||
        adj.reason.toLowerCase().includes(term)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(adj => adj.status === statusFilter);
    }

    // Filter by production line
    if (lineFilter !== 'all') {
      filtered = filtered.filter(adj => adj.productionLine === lineFilter);
    }

    setFilteredAdjustments(filtered);
  };

  const handleCreateAdjustment = () => {
    setEditingAdjustment(null);
    setShowModal(true);
  };

  const handleEditAdjustment = (adjustment: LearningCurveAdjustment) => {
    setEditingAdjustment(adjustment);
    setShowModal(true);
  };

  const handleSaveAdjustment = async (adjustmentData: any) => {
    try {
      if (editingAdjustment) {
        await learningCurveService.updateAdjustment(editingAdjustment.id, adjustmentData);
      } else {
        await learningCurveService.createAdjustment(adjustmentData);
      }
      
      await loadData();
      setShowModal(false);
      setEditingAdjustment(null);
    } catch (err) {
      console.error('Error saving adjustment:', err);
    }
  };

  const handleDeleteAdjustment = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este ajuste?')) {
      try {
        await learningCurveService.deleteAdjustment(id);
        await loadData();
      } catch (err) {
        console.error('Error deleting adjustment:', err);
      }
    }
  };

  const handleBulkApprove = async () => {
    if (selectedAdjustments.length === 0) return;
    
    try {
      await learningCurveService.bulkApprove(selectedAdjustments, 'current_user@company.com');
      await loadData();
      setSelectedAdjustments([]);
    } catch (err) {
      console.error('Error bulk approving adjustments:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'expired': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getImpactColor = (percentage: number) => {
    if (percentage >= 15) return 'text-red-600 bg-red-100';
    if (percentage >= 10) return 'text-orange-600 bg-orange-100';
    if (percentage >= 5) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getUniqueLines = () => {
    return [...new Set(adjustments.map(adj => adj.productionLine))];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
          <span className="text-red-800">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <TrendingDown className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Ajustes por Curva de Aprendizaje</h2>
            <p className="text-sm text-gray-600">Factores de ajuste de capacidad por operación y línea</p>
          </div>
        </div>
        <button
          onClick={handleCreateAdjustment}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nuevo Ajuste</span>
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Ajustes Activos</p>
                <p className="text-2xl font-bold text-blue-900">{stats.activeAdjustments}</p>
                <p className="text-xs text-blue-600">en aplicación</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Ajustes</p>
                <p className="text-2xl font-bold text-green-900">{stats.totalAdjustments}</p>
                <p className="text-xs text-green-600">configurados</p>
              </div>
              <Filter className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Ajuste Promedio</p>
                <p className="text-2xl font-bold text-yellow-900">{stats.averageAdjustment}%</p>
                <p className="text-xs text-yellow-600">reducción</p>
              </div>
              <TrendingDown className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Impacto Total</p>
                <p className="text-2xl font-bold text-red-900">{stats.totalCapacityImpact}</p>
                <p className="text-xs text-red-600">unidades/día</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Críticos</p>
                <p className="text-2xl font-bold text-purple-900">{stats.impactByLevel.critical}</p>
                <p className="text-xs text-purple-600">≥15% impacto</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      )}

      {/* View Toggle */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveView('list')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeView === 'list' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Filter className="h-4 w-4" />
          <span>Lista de Ajustes</span>
        </button>
        <button
          onClick={() => setActiveView('impact')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeView === 'impact' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <TrendingDown className="h-4 w-4" />
          <span>Impacto en Capacidad</span>
        </button>
        <button
          onClick={() => setActiveView('stats')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeView === 'stats' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <CheckCircle className="h-4 w-4" />
          <span>Estadísticas</span>
        </button>
      </div>

      {/* Filters */}
      {activeView === 'list' && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Operación, línea, código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="expired">Expirado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Línea</label>
              <select
                value={lineFilter}
                onChange={(e) => setLineFilter(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">Todas las líneas</option>
                {getUniqueLines().map(line => (
                  <option key={line} value={line}>{line}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <span className="text-sm text-gray-600">
                {filteredAdjustments.length} ajustes encontrados
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {activeView === 'list' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Bulk Actions */}
          {selectedAdjustments.length > 0 && (
            <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-800">
                  {selectedAdjustments.length} ajustes seleccionados
                </span>
                <button
                  onClick={handleBulkApprove}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  Aprobar Seleccionados
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedAdjustments.length === filteredAdjustments.length && filteredAdjustments.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAdjustments(filteredAdjustments.map(adj => adj.id));
                        } else {
                          setSelectedAdjustments([]);
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Operación
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ajuste
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Período
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAdjustments.map((adjustment) => (
                  <tr key={adjustment.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedAdjustments.includes(adjustment.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAdjustments([...selectedAdjustments, adjustment.id]);
                          } else {
                            setSelectedAdjustments(selectedAdjustments.filter(id => id !== adjustment.id));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <TrendingDown className="h-5 w-5 text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{adjustment.operation}</div>
                          <div className="text-sm text-gray-500">{adjustment.valueStream} • {adjustment.productionLine} • {adjustment.operationCode}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getImpactColor(adjustment.adjustmentPercentage)}`}>
                          -{adjustment.adjustmentPercentage}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{adjustment.reason}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>{adjustment.effectiveStartDate}</div>
                      <div className="text-xs text-gray-500">
                        hasta {adjustment.effectiveEndDate || 'Indefinido'}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(adjustment.status)}`}>
                        {adjustment.status === 'active' ? 'Activo' : 
                         adjustment.status === 'inactive' ? 'Inactivo' : 'Expirado'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditAdjustment(adjustment)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteAdjustment(adjustment.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAdjustments.length === 0 && (
            <div className="text-center py-8">
              <TrendingDown className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay ajustes</h3>
              <p className="mt-1 text-sm text-gray-500">Comienza creando un nuevo ajuste por curva de aprendizaje.</p>
            </div>
          )}
        </div>
      )}

      {activeView === 'impact' && (
        <CapacityImpactChart impacts={impacts} />
      )}

      {activeView === 'stats' && stats && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Estadísticas Detalladas</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Distribución por Nivel de Impacto</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Bajo (&lt;5%)</span>
                  <span className="text-sm font-medium text-green-600">{stats.impactByLevel.low}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Medio (5-10%)</span>
                  <span className="text-sm font-medium text-yellow-600">{stats.impactByLevel.medium}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Alto (10-15%)</span>
                  <span className="text-sm font-medium text-orange-600">{stats.impactByLevel.high}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Crítico (≥15%)</span>
                  <span className="text-sm font-medium text-red-600">{stats.impactByLevel.critical}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Resumen General</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total de Ajustes</span>
                  <span className="text-sm font-medium text-gray-900">{stats.totalAdjustments}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Ajustes Activos</span>
                  <span className="text-sm font-medium text-blue-600">{stats.activeAdjustments}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Ajuste Promedio</span>
                  <span className="text-sm font-medium text-yellow-600">{stats.averageAdjustment}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Impacto Total en Capacidad</span>
                  <span className="text-sm font-medium text-red-600">{stats.totalCapacityImpact} unidades/día</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <LearningCurveModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingAdjustment(null);
          }}
          onSave={handleSaveAdjustment}
          adjustment={editingAdjustment}
        />
      )}
    </div>
  );
};

export default TrainingCurvesTab; 