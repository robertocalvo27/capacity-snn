import React, { useState } from 'react';
import { PenTool, CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';
import type { HandShakeSession } from '../../../../../types/capacity';

interface SignoffTabProps {
  sessionData: HandShakeSession;
  currentUserRole: 'production_director' | 'planning_director';
  onFinalSignoff: (approved: boolean, comments?: string) => void;
}

const SignoffTab: React.FC<SignoffTabProps> = ({
  sessionData,
  currentUserRole,
  onFinalSignoff
}) => {
  const [showSignoffModal, setShowSignoffModal] = useState(false);
  const [signoffComments, setSignoffComments] = useState('');
  const [pendingSignoff, setPendingSignoff] = useState<{ approved: boolean } | null>(null);

  const currentUserSignoff = sessionData.finalSignoff?.[
    currentUserRole === 'production_director' ? 'productionDirector' : 'planningDirector'
  ];
  
  const otherUserSignoff = sessionData.finalSignoff?.[
    currentUserRole === 'production_director' ? 'planningDirector' : 'productionDirector'
  ];

  const hasCurrentUserSigned = !!currentUserSignoff;
  const hasOtherUserSigned = !!otherUserSignoff;
  const bothSigned = hasCurrentUserSigned && hasOtherUserSigned;

  const allVSTsApproved = sessionData.vstData.every(vst => 
    vst.approvals.length >= 2 && vst.approvals.every(approval => approval.approved)
  );

  const allConcernsResolved = sessionData.vstData.every(vst =>
    vst.concerns.every(concern => concern.status === 'resolved' || concern.status === 'dismissed')
  );

  const readyForSignoff = allVSTsApproved && allConcernsResolved;

  const handleSignoffClick = (approved: boolean) => {
    setPendingSignoff({ approved });
    setShowSignoffModal(true);
  };

  const confirmSignoff = () => {
    if (pendingSignoff) {
      onFinalSignoff(pendingSignoff.approved, signoffComments || undefined);
      setShowSignoffModal(false);
      setSignoffComments('');
      setPendingSignoff(null);
    }
  };

  const cancelSignoff = () => {
    setShowSignoffModal(false);
    setSignoffComments('');
    setPendingSignoff(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Aprobación Final</h2>
          <p className="text-gray-600">
            Firma final del Hand Shake por ambos directores.
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {hasCurrentUserSigned && hasOtherUserSigned ? 'Completado' : 
           hasCurrentUserSigned || hasOtherUserSigned ? 'Pendiente' : 'Sin iniciar'}
        </div>
      </div>

      {/* Prerequisites Check */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Requisitos para Aprobación</h3>
        <div className="space-y-3">
          <div className="flex items-center">
            {allVSTsApproved ? (
              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500 mr-3" />
            )}
            <span className={allVSTsApproved ? 'text-green-800' : 'text-red-800'}>
              Todos los VSTs aprobados por ambos directores
            </span>
          </div>
          <div className="flex items-center">
            {allConcernsResolved ? (
              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3" />
            )}
            <span className={allConcernsResolved ? 'text-green-800' : 'text-yellow-800'}>
              Todas las preocupaciones resueltas
            </span>
          </div>
          <div className="flex items-center">
            {sessionData.globalAgreements.length > 0 ? (
              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
            ) : (
              <Clock className="w-5 h-5 text-gray-400 mr-3" />
            )}
            <span className={sessionData.globalAgreements.length > 0 ? 'text-green-800' : 'text-gray-600'}>
              Acuerdos globales definidos ({sessionData.globalAgreements.length})
            </span>
          </div>
        </div>
        
        {!readyForSignoff && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-yellow-800 text-sm">
              ⚠️ Completa todos los requisitos antes de proceder con la aprobación final.
            </p>
          </div>
        )}
      </div>

      {/* Signoff Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Production Director */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Director de Producción</h3>
            {sessionData.finalSignoff?.productionDirector ? (
              sessionData.finalSignoff.productionDirector.approved ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <XCircle className="w-6 h-6 text-red-500" />
              )
            ) : (
              <Clock className="w-6 h-6 text-gray-400" />
            )}
          </div>
          
          {sessionData.finalSignoff?.productionDirector ? (
            <div>
              <div className={`mb-3 ${sessionData.finalSignoff.productionDirector.approved ? 'text-green-800' : 'text-red-800'}`}>
                <strong>
                  {sessionData.finalSignoff.productionDirector.approved ? '✓ Aprobado' : '✗ Rechazado'}
                </strong>
              </div>
              <div className="text-sm text-gray-600 mb-2">
                <strong>Fecha:</strong> {new Date(sessionData.finalSignoff.productionDirector.approvedAt || '').toLocaleString()}
              </div>
              {sessionData.finalSignoff.productionDirector.comments && (
                <div className="text-sm text-gray-600">
                  <strong>Comentarios:</strong> {sessionData.finalSignoff.productionDirector.comments}
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-500">
              Pendiente de aprobación
            </div>
          )}
        </div>

        {/* Planning Director */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Director de Planeación</h3>
            {sessionData.finalSignoff?.planningDirector ? (
              sessionData.finalSignoff.planningDirector.approved ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <XCircle className="w-6 h-6 text-red-500" />
              )
            ) : (
              <Clock className="w-6 h-6 text-gray-400" />
            )}
          </div>
          
          {sessionData.finalSignoff?.planningDirector ? (
            <div>
              <div className={`mb-3 ${sessionData.finalSignoff.planningDirector.approved ? 'text-green-800' : 'text-red-800'}`}>
                <strong>
                  {sessionData.finalSignoff.planningDirector.approved ? '✓ Aprobado' : '✗ Rechazado'}
                </strong>
              </div>
              <div className="text-sm text-gray-600 mb-2">
                <strong>Fecha:</strong> {new Date(sessionData.finalSignoff.planningDirector.approvedAt || '').toLocaleString()}
              </div>
              {sessionData.finalSignoff.planningDirector.comments && (
                <div className="text-sm text-gray-600">
                  <strong>Comentarios:</strong> {sessionData.finalSignoff.planningDirector.comments}
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-500">
              Pendiente de aprobación
            </div>
          )}
        </div>
      </div>

      {/* Current User Actions */}
      {!hasCurrentUserSigned && readyForSignoff && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Tu Aprobación</h3>
          <p className="text-blue-800 mb-4">
            Como {currentUserRole === 'production_director' ? 'Director de Producción' : 'Director de Planeación'}, 
            tu aprobación es necesaria para completar el Hand Shake.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={() => handleSignoffClick(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Aprobar Hand Shake
            </button>
            <button
              onClick={() => handleSignoffClick(false)}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 flex items-center"
            >
              <XCircle className="w-5 h-5 mr-2" />
              Rechazar Hand Shake
            </button>
          </div>
        </div>
      )}

      {/* Already Signed */}
      {hasCurrentUserSigned && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center">
            <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-green-900">Ya has firmado</h3>
              <p className="text-green-800">
                Has {currentUserSignoff?.approved ? 'aprobado' : 'rechazado'} el Hand Shake el{' '}
                {new Date(currentUserSignoff?.approvedAt || '').toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Final Status */}
      {bothSigned && (
        <div className={`border rounded-lg p-6 ${
          currentUserSignoff?.approved && otherUserSignoff?.approved 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center">
            {currentUserSignoff?.approved && otherUserSignoff?.approved ? (
              <CheckCircle className="w-8 h-8 text-green-500 mr-4" />
            ) : (
              <XCircle className="w-8 h-8 text-red-500 mr-4" />
            )}
            <div>
              <h3 className="text-xl font-bold mb-2">
                {currentUserSignoff?.approved && otherUserSignoff?.approved 
                  ? '🎉 Hand Shake Aprobado' 
                  : '❌ Hand Shake Rechazado'}
              </h3>
              <p className={currentUserSignoff?.approved && otherUserSignoff?.approved ? 'text-green-800' : 'text-red-800'}>
                {currentUserSignoff?.approved && otherUserSignoff?.approved 
                  ? 'Ambos directores han aprobado el Hand Shake. El CBP puede proceder a la fase final.'
                  : 'El Hand Shake ha sido rechazado. Se requiere revisión antes de continuar.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Signoff Modal */}
      {showSignoffModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {pendingSignoff?.approved ? 'Aprobar' : 'Rechazar'} Hand Shake
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {pendingSignoff?.approved 
                ? 'Confirma tu aprobación del Hand Shake. Puedes agregar comentarios opcionales.'
                : 'Explica las razones del rechazo del Hand Shake.'}
            </p>
            <textarea
              value={signoffComments}
              onChange={(e) => setSignoffComments(e.target.value)}
              placeholder="Comentarios..."
              className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none"
              required={!pendingSignoff?.approved}
            />
            <div className="flex space-x-2 mt-4">
              <button
                onClick={confirmSignoff}
                disabled={!pendingSignoff?.approved && !signoffComments.trim()}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
              >
                Confirmar
              </button>
              <button
                onClick={cancelSignoff}
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

export default SignoffTab;