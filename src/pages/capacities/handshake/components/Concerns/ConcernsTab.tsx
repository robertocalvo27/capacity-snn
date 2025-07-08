import React, { useState } from 'react';
import { AlertTriangle, Plus, CheckCircle, Clock, MessageCircle } from 'lucide-react';
import type { VST_HandShakeData, HandShakeConcern } from '../../../../../types/capacity';
import { concernTypes, severityTypes } from '../../data/mockData';

interface ConcernsTabProps {
  vstData: VST_HandShakeData[];
  currentUserRole: 'production_director' | 'planning_director';
  onAddConcern: (vstId: string, concern: Omit<HandShakeConcern, 'id' | 'raisedAt' | 'raisedBy'>) => void;
  onResolveConcern: (vstId: string, concernId: string, resolution: string) => void;
}

const ConcernsTab: React.FC<ConcernsTabProps> = ({
  vstData,
  currentUserRole,
  onAddConcern,
  onResolveConcern
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedVST, setSelectedVST] = useState('');
  const [newConcern, setNewConcern] = useState({
    type: 'capacity' as const,
    description: '',
    severity: 'medium' as const
  });
  const [resolutionText, setResolutionText] = useState('');
  const [resolvingConcern, setResolvingConcern] = useState<{vstId: string, concernId: string} | null>(null);

  const allConcerns = vstData.flatMap(vst => 
    vst.concerns.map(concern => ({ ...concern, vstName: vst.name, vstId: vst.id }))
  );

  const openConcerns = allConcerns.filter(c => c.status === 'open');
  const resolvedConcerns = allConcerns.filter(c => c.status === 'resolved');

  const getSeverityColor = (severity: string) => {
    const severityConfig = severityTypes.find(s => s.id === severity);
    return severityConfig?.color || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: string) => {
    const typeConfig = concernTypes.find(t => t.id === type);
    return typeConfig?.color || 'bg-gray-100 text-gray-800';
  };

  const handleAddConcern = () => {
    if (selectedVST && newConcern.description.trim()) {
      onAddConcern(selectedVST, {
        type: newConcern.type,
        description: newConcern.description,
        severity: newConcern.severity,
        status: 'open'
      });
      setShowAddModal(false);
      setNewConcern({ type: 'capacity', description: '', severity: 'medium' });
      setSelectedVST('');
    }
  };

  const handleResolveConcern = () => {
    if (resolvingConcern && resolutionText.trim()) {
      onResolveConcern(resolvingConcern.vstId, resolvingConcern.concernId, resolutionText);
      setResolvingConcern(null);
      setResolutionText('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Gestión de Preocupaciones</h2>
          <p className="text-gray-600">
            Identifica y gestiona preocupaciones sobre la capacidad y recursos.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            {openConcerns.length} abiertas • {resolvedConcerns.length} resueltas
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Preocupación
          </button>
        </div>
      </div>

      {/* Open Concerns */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preocupaciones Abiertas</h3>
        {openConcerns.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
            <p className="text-green-800 font-medium">¡Excelente!</p>
            <p className="text-green-600">No hay preocupaciones abiertas en este momento.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {openConcerns.map((concern) => (
              <div key={concern.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(concern.type)}`}>
                      {concernTypes.find(t => t.id === concern.type)?.name}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(concern.severity)}`}>
                      {severityTypes.find(s => s.id === concern.severity)?.name}
                    </span>
                    <span className="text-sm text-gray-500">• {concern.vstName}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(concern.raisedAt).toLocaleDateString()}
                  </div>
                </div>
                <p className="text-gray-800 mb-3">{concern.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Reportado por: {concern.raisedBy === 'production_director' ? 'Director de Producción' : 'Director de Planeación'}
                  </span>
                  <button
                    onClick={() => setResolvingConcern({vstId: concern.vstId, concernId: concern.id})}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    Resolver
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resolved Concerns */}
      {resolvedConcerns.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Preocupaciones Resueltas</h3>
          <div className="space-y-3">
            {resolvedConcerns.map((concern) => (
              <div key={concern.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(concern.type)}`}>
                      {concernTypes.find(t => t.id === concern.type)?.name}
                    </span>
                    <span className="text-sm text-gray-500">• {concern.vstName}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Resuelto: {concern.resolvedAt ? new Date(concern.resolvedAt).toLocaleDateString() : ''}
                  </div>
                </div>
                <p className="text-gray-700 mb-2">{concern.description}</p>
                {concern.resolution && (
                  <div className="bg-green-50 p-2 rounded">
                    <p className="text-sm text-green-800"><strong>Resolución:</strong> {concern.resolution}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Concern Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Nueva Preocupación</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value Stream</label>
                <select
                  value={selectedVST}
                  onChange={(e) => setSelectedVST(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Seleccionar VST</option>
                  {vstData.map(vst => (
                    <option key={vst.id} value={vst.id}>{vst.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  value={newConcern.type}
                  onChange={(e) => setNewConcern(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  {concernTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Severidad</label>
                <select
                  value={newConcern.severity}
                  onChange={(e) => setNewConcern(prev => ({ ...prev, severity: e.target.value as any }))}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  {severityTypes.map(severity => (
                    <option key={severity.id} value={severity.id}>{severity.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={newConcern.description}
                  onChange={(e) => setNewConcern(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe la preocupación..."
                  className="w-full h-24 p-2 border border-gray-300 rounded-lg resize-none"
                />
              </div>
            </div>

            <div className="flex space-x-2 mt-6">
              <button
                onClick={handleAddConcern}
                disabled={!selectedVST || !newConcern.description.trim()}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
              >
                Agregar
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resolve Concern Modal */}
      {resolvingConcern && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Resolver Preocupación</h3>
            <p className="text-sm text-gray-600 mb-4">
              Describe cómo se ha resuelto o abordado esta preocupación.
            </p>
            <textarea
              value={resolutionText}
              onChange={(e) => setResolutionText(e.target.value)}
              placeholder="Descripción de la resolución..."
              className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none"
            />
            <div className="flex space-x-2 mt-4">
              <button
                onClick={handleResolveConcern}
                disabled={!resolutionText.trim()}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300"
              >
                Resolver
              </button>
              <button
                onClick={() => setResolvingConcern(null)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConcernsTab;