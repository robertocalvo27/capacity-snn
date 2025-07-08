import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Componentes comunes (reutilizamos del input-review)
import Header from '../input-review/components/common/Header';
import ProgressBar from '../input-review/components/common/ProgressBar';
import TabNavigation from './components/common/TabNavigation';
import Notification from '../input-review/components/common/Notification';

// Componentes específicos del HandShake
import VSTReviewTab from './components/VSTReview/VSTReviewTab';
import AgreementsTab from './components/Agreements/AgreementsTab';
import ConcernsTab from './components/Concerns/ConcernsTab';
import SignoffTab from './components/Signoff/SignoffTab';
import SummaryTab from './components/Summary/SummaryTab';

// Datos mock y tipos
import { handShakeData, handShakeStatus as initialHandShakeStatus, HandShakeStatusItem } from './data/mockData';
import type { HandShakeSession, VST_HandShakeData, HandShakeApproval, HandShakeConcern, HandShakeAgreement } from '../../../types/capacity';

const HandShake: React.FC = () => {
  // Obtener ID del CBP de los parámetros de la URL
  const { cbpId = '24-01' } = useParams<{ cbpId?: string }>();

  // Estados generales
  const [activeTab, setActiveTab] = useState<string>('vstReview');
  const [handShakeStatus, setHandShakeStatus] = useState<HandShakeStatusItem>(initialHandShakeStatus);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>('');
  
  // Estados específicos del HandShake
  const [sessionData, setSessionData] = useState<HandShakeSession>(handShakeData);
  const [currentUserRole] = useState<'production_director' | 'planning_director'>('production_director'); // Simular rol actual

  // Función para mostrar notificación
  const showSuccessNotification = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    
    // Ocultar notificación después de 5 segundos
    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
  };

  // Manejadores para VST Review
  const handleVSTApproval = (vstId: string, approved: boolean, comments?: string) => {
    setSessionData(prev => ({
      ...prev,
      vstData: prev.vstData.map(vst => 
        vst.id === vstId 
          ? {
              ...vst,
              status: approved ? 'approved' : 'rejected',
              approvals: [
                ...vst.approvals.filter(approval => approval.approverRole !== currentUserRole),
                {
                  id: `approval_${Date.now()}`,
                  approverRole: currentUserRole,
                  approverName: currentUserRole === 'production_director' ? 'Director de Producción' : 'Director de Planeación',
                  approverEmail: currentUserRole === 'production_director' ? 'prod.director@company.com' : 'plan.director@company.com',
                  approved,
                  approvedAt: new Date().toISOString(),
                  comments
                }
              ],
              lastUpdated: new Date().toISOString()
            }
          : vst
      )
    }));

    // Verificar si todos los VSTs han sido revisados
    const allVSTsReviewed = sessionData.vstData.every(vst => 
      vst.approvals.some(approval => approval.approverRole === currentUserRole)
    );

    if (allVSTsReviewed) {
      setHandShakeStatus(prev => ({ ...prev, vstReviewed: true }));
    }

    showSuccessNotification(`VST ${vstId} ha sido ${approved ? 'aprobado' : 'rechazado'} exitosamente.`);
  };

  // Manejadores para Concerns
  const handleAddConcern = (vstId: string, concern: Omit<HandShakeConcern, 'id' | 'raisedAt' | 'raisedBy'>) => {
    const newConcern: HandShakeConcern = {
      ...concern,
      id: `concern_${Date.now()}`,
      raisedAt: new Date().toISOString(),
      raisedBy: currentUserRole
    };

    setSessionData(prev => ({
      ...prev,
      vstData: prev.vstData.map(vst => 
        vst.id === vstId 
          ? { ...vst, concerns: [...vst.concerns, newConcern] }
          : vst
      )
    }));

    showSuccessNotification('Preocupación agregada exitosamente.');
  };

  const handleResolveConcern = (vstId: string, concernId: string, resolution: string) => {
    setSessionData(prev => ({
      ...prev,
      vstData: prev.vstData.map(vst => 
        vst.id === vstId 
          ? {
              ...vst,
              concerns: vst.concerns.map(concern =>
                concern.id === concernId
                  ? {
                      ...concern,
                      status: 'resolved',
                      resolution,
                      resolvedAt: new Date().toISOString(),
                      resolvedBy: currentUserRole
                    }
                  : concern
              )
            }
          : vst
      )
    }));

    // Verificar si todas las preocupaciones han sido abordadas
    const allConcernsAddressed = sessionData.vstData.every(vst =>
      vst.concerns.every(concern => concern.status === 'resolved' || concern.status === 'dismissed')
    );

    if (allConcernsAddressed) {
      setHandShakeStatus(prev => ({ ...prev, concernsAddressed: true }));
    }

    showSuccessNotification('Preocupación resuelta exitosamente.');
  };

  // Manejadores para Agreements
  const handleAddAgreement = (agreement: Omit<HandShakeAgreement, 'id' | 'agreedAt' | 'agreedBy'>) => {
    const newAgreement: HandShakeAgreement = {
      ...agreement,
      id: `agreement_${Date.now()}`,
      agreedAt: new Date().toISOString(),
      agreedBy: [currentUserRole]
    };

    setSessionData(prev => ({
      ...prev,
      globalAgreements: [...prev.globalAgreements, newAgreement]
    }));

    setHandShakeStatus(prev => ({ ...prev, agreementsReached: true }));
    showSuccessNotification('Acuerdo agregado exitosamente.');
  };

  const handleAgreeToAgreement = (agreementId: string) => {
    setSessionData(prev => ({
      ...prev,
      globalAgreements: prev.globalAgreements.map(agreement =>
        agreement.id === agreementId
          ? {
              ...agreement,
              agreedBy: [...new Set([...agreement.agreedBy, currentUserRole])]
            }
          : agreement
      )
    }));

    showSuccessNotification('Has acordado a este compromiso.');
  };

  // Manejador para Final Signoff
  const handleFinalSignoff = (approved: boolean, comments?: string) => {
    const signoff: HandShakeApproval = {
      id: `signoff_${Date.now()}`,
      approverRole: currentUserRole,
      approverName: currentUserRole === 'production_director' ? 'Director de Producción' : 'Director de Planeación',
      approverEmail: currentUserRole === 'production_director' ? 'prod.director@company.com' : 'plan.director@company.com',
      approved,
      approvedAt: new Date().toISOString(),
      comments
    };

    setSessionData(prev => ({
      ...prev,
      finalSignoff: {
        ...prev.finalSignoff,
        [currentUserRole === 'production_director' ? 'productionDirector' : 'planningDirector']: signoff
      },
      status: approved ? 'approved' : 'rejected',
      completedAt: approved ? new Date().toISOString() : undefined
    }));

    // Verificar si ambos directores han firmado
    const bothSignedOff = sessionData.finalSignoff?.productionDirector && sessionData.finalSignoff?.planningDirector;
    if (bothSignedOff) {
      setHandShakeStatus(prev => ({ ...prev, finalSignoffComplete: true }));
    }

    showSuccessNotification(`Hand Shake ${approved ? 'aprobado' : 'rechazado'} exitosamente.`);
  };

  // Renderizar la pestaña activa
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'vstReview':
        return (
          <VSTReviewTab
            vstData={sessionData.vstData}
            currentUserRole={currentUserRole}
            onVSTApproval={handleVSTApproval}
          />
        );
      case 'concerns':
        return (
          <ConcernsTab
            vstData={sessionData.vstData}
            currentUserRole={currentUserRole}
            onAddConcern={handleAddConcern}
            onResolveConcern={handleResolveConcern}
          />
        );
      case 'agreements':
        return (
          <AgreementsTab
            agreements={sessionData.globalAgreements}
            currentUserRole={currentUserRole}
            onAddAgreement={handleAddAgreement}
            onAgreeToAgreement={handleAgreeToAgreement}
          />
        );
      case 'signoff':
        return (
          <SignoffTab
            sessionData={sessionData}
            currentUserRole={currentUserRole}
            onFinalSignoff={handleFinalSignoff}
          />
        );
      case 'summary':
        return (
          <SummaryTab
            sessionData={sessionData}
            handShakeStatus={handShakeStatus}
            cbpId={cbpId}
          />
        );
      default:
        return <div>Selecciona una pestaña</div>;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header personalizado para HandShake */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              🤝 Hand Shake - CBP {cbpId}
            </h1>
            <p className="text-gray-500">Proceso de acuerdo entre Producción y Planeación</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">
              Usuario actual: <span className="font-semibold text-blue-600">
                {currentUserRole === 'production_director' ? 'Director de Producción' : 'Director de Planeación'}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Estado: <span className={`font-semibold ${
                sessionData.status === 'approved' ? 'text-green-600' : 
                sessionData.status === 'rejected' ? 'text-red-600' : 
                'text-amber-600'
              }`}>
                {sessionData.status === 'draft' ? 'Borrador' :
                 sessionData.status === 'in_review' ? 'En Revisión' :
                 sessionData.status === 'approved' ? 'Aprobado' :
                 sessionData.status === 'rejected' ? 'Rechazado' : 'Condicional'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Barra de progreso personalizada para HandShake */}
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Progreso del Hand Shake</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className={`p-4 rounded-lg border ${handShakeStatus.vstReviewed ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="text-center">
                <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${handShakeStatus.vstReviewed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'}`}>
                  1
                </div>
                <div className="text-sm font-medium">VSTs Revisados</div>
              </div>
            </div>
            <div className={`p-4 rounded-lg border ${handShakeStatus.concernsAddressed ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="text-center">
                <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${handShakeStatus.concernsAddressed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'}`}>
                  2
                </div>
                <div className="text-sm font-medium">Preocupaciones Abordadas</div>
              </div>
            </div>
            <div className={`p-4 rounded-lg border ${handShakeStatus.agreementsReached ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="text-center">
                <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${handShakeStatus.agreementsReached ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'}`}>
                  3
                </div>
                <div className="text-sm font-medium">Acuerdos Alcanzados</div>
              </div>
            </div>
            <div className={`p-4 rounded-lg border ${handShakeStatus.approvalsReceived ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="text-center">
                <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${handShakeStatus.approvalsReceived ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'}`}>
                  4
                </div>
                <div className="text-sm font-medium">Aprobaciones Recibidas</div>
              </div>
            </div>
            <div className={`p-4 rounded-lg border ${handShakeStatus.finalSignoffComplete ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="text-center">
                <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${handShakeStatus.finalSignoffComplete ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'}`}>
                  5
                </div>
                <div className="text-sm font-medium">Signoff Final</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navegación de pestañas */}
      <div className="mb-6">
        <TabNavigation 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          handShakeStatus={handShakeStatus}
        />
      </div>
      
      {/* Contenido de pestañas */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {renderActiveTab()}
      </div>
      
      {/* Notificación */}
      <Notification 
        show={showNotification}
        onClose={() => setShowNotification(false)}
        message={notificationMessage}
      />
    </div>
  );
};

export default HandShake;