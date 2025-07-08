import React, { useState } from 'react';
import { FileText, Plus, CheckCircle, Users, Calendar } from 'lucide-react';
import type { HandShakeAgreement } from '../../../../../types/capacity';
import { agreementTypes } from '../../data/mockData';

interface AgreementsTabProps {
  agreements: HandShakeAgreement[];
  currentUserRole: 'production_director' | 'planning_director';
  onAddAgreement: (agreement: Omit<HandShakeAgreement, 'id' | 'agreedAt' | 'agreedBy'>) => void;
  onAgreeToAgreement: (agreementId: string) => void;
}

const AgreementsTab: React.FC<AgreementsTabProps> = ({
  agreements,
  currentUserRole,
  onAddAgreement,
  onAgreeToAgreement
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAgreement, setNewAgreement] = useState({
    description: '',
    type: 'commitment' as const,
    reviewDate: ''
  });

  const hasUserAgreed = (agreement: HandShakeAgreement) => {
    return agreement.agreedBy.includes(currentUserRole);
  };

  const bothPartiesAgreed = (agreement: HandShakeAgreement) => {
    return agreement.agreedBy.includes('production_director') && agreement.agreedBy.includes('planning_director');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'commitment': return 'bg-blue-100 text-blue-800';
      case 'condition': return 'bg-yellow-100 text-yellow-800';
      case 'assumption': return 'bg-purple-100 text-purple-800';
      case 'constraint': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddAgreement = () => {
    if (newAgreement.description.trim()) {
      onAddAgreement({
        description: newAgreement.description,
        type: newAgreement.type,
        reviewDate: newAgreement.reviewDate || undefined,
        active: true
      });
      setShowAddModal(false);
      setNewAgreement({ description: '', type: 'commitment', reviewDate: '' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Gestión de Acuerdos</h2>
          <p className="text-gray-600">
            Define compromisos, condiciones y restricciones para el CBP.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            {agreements.filter(a => bothPartiesAgreed(a)).length} / {agreements.length} acordados
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Acuerdo
          </button>
        </div>
      </div>

      {/* Agreements List */}
      <div className="space-y-4">
        {agreements.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No hay acuerdos definidos aún.</p>
            <p className="text-gray-500 text-sm">Comienza agregando el primer acuerdo.</p>
          </div>
        ) : (
          agreements.map((agreement) => {
            const userAgreed = hasUserAgreed(agreement);
            const bothAgreed = bothPartiesAgreed(agreement);
            const typeConfig = agreementTypes.find(t => t.id === agreement.type);

            return (
              <div
                key={agreement.id}
                className={`border rounded-lg p-6 ${
                  bothAgreed ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(agreement.type)}`}>
                      {typeConfig?.name}
                    </span>
                    {bothAgreed && (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">Acordado por ambas partes</span>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(agreement.agreedAt).toLocaleDateString()}
                  </div>
                </div>

                <p className="text-gray-800 mb-4">{agreement.description}</p>

                {typeConfig && (
                  <p className="text-sm text-gray-600 mb-4 italic">{typeConfig.description}</p>
                )}

                {agreement.reviewDate && (
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Fecha de revisión: {new Date(agreement.reviewDate).toLocaleDateString()}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">
                        Acordado por: {agreement.agreedBy.length} / 2 partes
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      {agreement.agreedBy.includes('production_director') && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          Director Producción
                        </span>
                      )}
                      {agreement.agreedBy.includes('planning_director') && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          Director Planeación
                        </span>
                      )}
                    </div>
                  </div>

                  {!userAgreed && (
                    <button
                      onClick={() => onAgreeToAgreement(agreement.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Acordar
                    </button>
                  )}

                  {userAgreed && !bothAgreed && (
                    <div className="flex items-center text-blue-600">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Ya has acordado</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Agreement Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Nuevo Acuerdo</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Acuerdo</label>
                <select
                  value={newAgreement.type}
                  onChange={(e) => setNewAgreement(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  {agreementTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
                {agreementTypes.find(t => t.id === newAgreement.type) && (
                  <p className="text-sm text-gray-500 mt-1">
                    {agreementTypes.find(t => t.id === newAgreement.type)?.description}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={newAgreement.description}
                  onChange={(e) => setNewAgreement(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe el acuerdo, compromiso o condición..."
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Revisión (Opcional)
                </label>
                <input
                  type="date"
                  value={newAgreement.reviewDate}
                  onChange={(e) => setNewAgreement(prev => ({ ...prev, reviewDate: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Fecha en la que se debe revisar este acuerdo
                </p>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleAddAgreement}
                disabled={!newAgreement.description.trim()}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
              >
                Crear Acuerdo
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
    </div>
  );
};

export default AgreementsTab;