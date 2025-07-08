import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, TrendingUp, AlertCircle, MessageCircle } from 'lucide-react';
import type { VST_HandShakeData } from '../../../../../types/capacity';

interface VSTReviewTabProps {
  vstData: VST_HandShakeData[];
  currentUserRole: 'production_director' | 'planning_director';
  onVSTApproval: (vstId: string, approved: boolean, comments?: string) => void;
}

const VSTReviewTab: React.FC<VSTReviewTabProps> = ({
  vstData,
  currentUserRole,
  onVSTApproval
}) => {
  const [selectedVST, setSelectedVST] = useState<string | null>(null);
  const [approvalComments, setApprovalComments] = useState<string>('');
  const [showCommentsModal, setShowCommentsModal] = useState<boolean>(false);
  const [pendingApproval, setPendingApproval] = useState<{ vstId: string; approved: boolean } | null>(null);

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 95) return 'text-red-600';
    if (percentage >= 90) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'conditional': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const hasUserApproved = (vst: VST_HandShakeData) => {
    return vst.approvals.some(approval => approval.approverRole === currentUserRole);
  };

  const getUserApproval = (vst: VST_HandShakeData) => {
    return vst.approvals.find(approval => approval.approverRole === currentUserRole);
  };

  const handleApprovalClick = (vstId: string, approved: boolean) => {
    setPendingApproval({ vstId, approved });
    setShowCommentsModal(true);
  };

  const confirmApproval = () => {
    if (pendingApproval) {
      onVSTApproval(pendingApproval.vstId, pendingApproval.approved, approvalComments || undefined);
      setShowCommentsModal(false);
      setApprovalComments('');
      setPendingApproval(null);
    }
  };

  const cancelApproval = () => {
    setShowCommentsModal(false);
    setApprovalComments('');
    setPendingApproval(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Revisión de Value Streams</h2>
          <p className="text-gray-600">
            Revisa y aprueba cada Value Stream basado en su capacidad y utilización proyectada.
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {vstData.filter(vst => hasUserApproved(vst)).length} / {vstData.length} revisados
        </div>
      </div>

      {/* VST Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {vstData.map((vst) => {
          const userApproval = getUserApproval(vst);
          const hasApproved = hasUserApproved(vst);

          return (
            <div
              key={vst.id}
              className={`bg-white border rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${
                selectedVST === vst.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedVST(selectedVST === vst.id ? null : vst.id)}
            >
              {/* VST Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{vst.name}</h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vst.status)}`}>
                    {vst.status === 'pending' ? 'Pendiente' : 
                     vst.status === 'approved' ? 'Aprobado' :
                     vst.status === 'rejected' ? 'Rechazado' : 'Condicional'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {hasApproved && (
                    userApproval?.approved ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500" />
                    )
                  )}
                  {vst.concerns.length > 0 && (
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-amber-500" />
                      <span className="text-xs text-amber-600 ml-1">{vst.concerns.length}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm font-medium text-gray-500">Utilización</div>
                  <div className={`text-xl font-bold ${getUtilizationColor(vst.utilizationPercentage)}`}>
                    {vst.utilizationPercentage.toFixed(1)}%
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm font-medium text-gray-500">Eficiencia</div>
                  <div className="text-xl font-bold text-blue-600">
                    {vst.efficiency.toFixed(1)}%
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm font-medium text-gray-500">Demanda</div>
                  <div className="text-lg font-bold text-gray-900">
                    {vst.demandHours.toLocaleString()}h
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm font-medium text-gray-500">Capacidad</div>
                  <div className="text-lg font-bold text-gray-900">
                    {vst.capacityHours.toLocaleString()}h
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {selectedVST === vst.id && (
                <div className="border-t pt-4 space-y-4">
                  {/* Previous Approvals */}
                  {vst.approvals.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Aprobaciones</h4>
                      <div className="space-y-2">
                        {vst.approvals.map((approval) => (
                          <div key={approval.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <div className="flex items-center">
                              {approval.approved ? (
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-500 mr-2" />
                              )}
                              <span className="text-sm font-medium">
                                {approval.approverRole === 'production_director' ? 'Director de Producción' : 'Director de Planeación'}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(approval.approvedAt || '').toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* User Approval Actions */}
                  {!hasApproved && (
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprovalClick(vst.id, true);
                        }}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Aprobar
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprovalClick(vst.id, false);
                        }}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Rechazar
                      </button>
                    </div>
                  )}

                  {/* Show user's previous approval */}
                  {hasApproved && userApproval && (
                    <div className="bg-blue-50 p-3 rounded">
                      <div className="flex items-center">
                        {userApproval.approved ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 mr-2" />
                        )}
                        <span className="font-medium">
                          Ya has {userApproval.approved ? 'aprobado' : 'rechazado'} este VST
                        </span>
                      </div>
                      {userApproval.comments && (
                        <div className="mt-2 text-sm text-gray-600">
                          <strong>Comentarios:</strong> {userApproval.comments}
                        </div>
                      )}
                      <div className="mt-1 text-xs text-gray-500">
                        {new Date(userApproval.approvedAt || '').toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Comments Modal */}
      {showCommentsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {pendingApproval?.approved ? 'Aprobar' : 'Rechazar'} VST
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {pendingApproval?.approved 
                ? 'Puedes agregar comentarios sobre tu aprobación (opcional).'
                : 'Por favor explica las razones del rechazo.'}
            </p>
            <textarea
              value={approvalComments}
              onChange={(e) => setApprovalComments(e.target.value)}
              placeholder="Comentarios..."
              className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required={!pendingApproval?.approved}
            />
            <div className="flex space-x-2 mt-4">
              <button
                onClick={confirmApproval}
                disabled={!pendingApproval?.approved && !approvalComments.trim()}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Confirmar
              </button>
              <button
                onClick={cancelApproval}
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

export default VSTReviewTab;