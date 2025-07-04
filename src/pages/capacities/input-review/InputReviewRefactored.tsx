import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Componentes comunes
import Header from './components/common/Header';
import ProgressBar from './components/common/ProgressBar';
import TabNavigation from './components/common/TabNavigation';
import Notification from './components/common/Notification';

// Componentes específicos de cada pestaña
import BuildPlanTab from './components/BuildPlan/BuildPlanTab';
import BuildPlanImportModal from './components/BuildPlan/BuildPlanImportModal';
import YieldTab from './components/Yield/YieldTab';
import DowntimesTab from './components/Downtimes/DowntimesTab';
import HeadcountTab from './components/Headcount/HeadcountTab';
import SummaryTab from './components/Summary/SummaryTab';

// Nuevos componentes
import CalendarDaysTab from './components/Calendar/CalendarDaysTab';
import ImportHistoryTab from './components/ImportHistory/ImportHistoryTab';
import TrainingCurvesTab from './components/TrainingCurves/TrainingCurvesTab';
import RunRatesTab from './components/RunRates/RunRatesTab';

// Datos mock
import { inputReviewStatus, tabData, approvalLogs, StatusItem } from './data/mockData';

const InputReviewRefactored: React.FC = () => {
  // Obtener ID del CBP de los parámetros de la URL
  const { cbpId = '24-01' } = useParams<{ cbpId?: string }>();

  // Estados generales
  const [activeTab, setActiveTab] = useState<string>('buildPlan');
  const [reviewStatus, setReviewStatus] = useState(inputReviewStatus);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>('');
  const [selectedValueStream, setSelectedValueStream] = useState<string>('all');

  // Estados específicos para BuildPlan
  const [buildPlanData, setBuildPlanData] = useState<any[]>(tabData.buildPlan);
  const [showBuildPlanImportModal, setShowBuildPlanImportModal] = useState<boolean>(false);
  const [lastBuildPlanImportedFile, setLastBuildPlanImportedFile] = useState<string | null>(null);

  // Estados específicos para Yield
  const [yieldData, setYieldData] = useState<any[]>(tabData.yield);
  const [yieldApprovalLogs, setYieldApprovalLogs] = useState<any[]>(approvalLogs.yield || []);

  // Estados específicos para Downtimes
  const [downtimeData, setDowntimeData] = useState<any[]>(tabData.downtimes);
  const [lastDowntimeImportedFile, setLastDowntimeImportedFile] = useState<string | null>(null);
  const [downtimeApprovalLogs, setDowntimeApprovalLogs] = useState<any[]>(approvalLogs.downtimes || []);
  const [showDowntimeImportModal, setShowDowntimeImportModal] = useState<boolean>(false);

  // Estados específicos para Headcount
  const [headcountData, setHeadcountData] = useState<any[]>(tabData.headcount);
  const [headcountApprovalLogs, setHeadcountApprovalLogs] = useState<any[]>([]);

  // Función para mostrar notificación
  const showSuccessNotification = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    
    // Ocultar notificación después de 5 segundos
    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
  };

  // Manejadores para BuildPlan
  const handleBuildPlanImport = () => {
    setShowBuildPlanImportModal(true);
  };

  const handleBuildPlanImportComplete = (file: File, data: any[]) => {
    setBuildPlanData(data);
    setLastBuildPlanImportedFile(file.name);
    setShowBuildPlanImportModal(false);
    
    // Actualizar estado de revisión
    setReviewStatus({
      ...reviewStatus,
      buildPlan: { complete: true, date: new Date().toISOString().split('T')[0] }
    });
    
    showSuccessNotification(`Se ha importado correctamente el Build Plan para el CBP ${cbpId}.`);
  };

  const handleBuildPlanSave = () => {
    // Aquí iría la lógica para guardar los datos de buildPlan en el backend
    showSuccessNotification('Se ha guardado correctamente el plan de construcción.');
  };

  // Manejadores para Yield
  const handleYieldSave = () => {
    // Aquí iría la lógica para guardar los datos de yield en el backend
    showSuccessNotification('Se han aprobado correctamente los yields seleccionados.');
    
    // Actualizar estado de revisión si hay cambios aprobados
    const anyApproved = yieldData.some(item => item.status === 'approved');
    if (anyApproved) {
      setReviewStatus({
        ...reviewStatus,
        yield: { complete: true, date: new Date().toISOString().split('T')[0] }
      });
    }
  };

  // Manejadores para Downtimes
  const handleDowntimeImport = () => {
    setShowDowntimeImportModal(true);
  };

  const handleDowntimeImportComplete = (file: File, data: any[]) => {
    setDowntimeData(data);
    setLastDowntimeImportedFile(file.name);
    setShowDowntimeImportModal(false);
    showSuccessNotification('Se han importado correctamente los Downtimes.');
  };

  const handleDowntimeSave = () => {
    // Aquí iría la lógica para guardar los datos de downtimes en el backend
    showSuccessNotification('Se han aprobado correctamente los downtimes seleccionados.');
    
    // Actualizar estado de revisión si hay cambios aprobados
    const anyApproved = downtimeData.some(item => item.status === 'approved');
    if (anyApproved) {
      const updatedStatus: StatusItem = { 
        complete: true, 
        date: new Date().toISOString().split('T')[0] 
      };
      
      setReviewStatus({
        ...reviewStatus,
        downtimes: updatedStatus
      });
    }
  };

  // Manejadores para Headcount
  const handleHeadcountSave = () => {
    // Aquí iría la lógica para guardar los datos de headcount en el backend
    showSuccessNotification('Se han aprobado correctamente los registros de headcount seleccionados.');
    
    // Actualizar estado de revisión
    const updatedStatus: StatusItem = { 
      complete: true, 
      date: new Date().toISOString().split('T')[0] 
    };
    
    setReviewStatus({
      ...reviewStatus,
      headcount: updatedStatus
    });
  };

  // Manejadores para Summary
  const handleSummarySave = () => {
    showSuccessNotification('Se ha aprobado el resumen de capacidad.');
    
    // Actualizar estado de revisión para summary
    const updatedStatus: StatusItem = { 
      complete: true, 
      date: new Date().toISOString().split('T')[0] 
    };
    
    setReviewStatus({
      ...reviewStatus,
      summary: updatedStatus
    });
  };

  // Nuevos manejadores para Calendar Days
  const handleCalendarDaysSave = () => {
    showSuccessNotification('Se han aprobado correctamente los días calendario seleccionados.');
    
    // Actualizar estado de revisión
    const updatedStatus: StatusItem = { 
      complete: true, 
      date: new Date().toISOString().split('T')[0] 
    };
    
    setReviewStatus({
      ...reviewStatus,
      calendarDays: updatedStatus
    });
  };

  // Manejadores para Training Curves
  const handleTrainingCurvesSave = () => {
    showSuccessNotification('Se han guardado correctamente las curvas de entrenamiento.');
    
    // Actualizar estado de revisión
    const updatedStatus: StatusItem = { 
      complete: true, 
      date: new Date().toISOString().split('T')[0] 
    };
    
    setReviewStatus({
      ...reviewStatus,
      trainingCurves: updatedStatus
    });
  };

  // Manejadores para Run Rates
  const handleRunRatesSave = () => {
    showSuccessNotification('Se han guardado correctamente las configuraciones de Run Rates.');
    
    // Actualizar estado de revisión
    const updatedStatus: StatusItem = { 
      complete: true, 
      date: new Date().toISOString().split('T')[0] 
    };
    
    setReviewStatus({
      ...reviewStatus,
      runRates: updatedStatus
    });
  };

  // Renderizar la pestaña activa
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'buildPlan':
        return (
          <BuildPlanTab
            data={buildPlanData}
            onSave={handleBuildPlanSave}
            onImport={() => setShowBuildPlanImportModal(true)}
            lastImportedFile={lastBuildPlanImportedFile}
          />
        );
      case 'yield':
        return (
          <YieldTab
            data={yieldData}
            setData={setYieldData}
            onSave={handleYieldSave}
            approvalLogs={yieldApprovalLogs}
            setApprovalLogs={setYieldApprovalLogs}
          />
        );
      case 'downtimes':
        return (
          <DowntimesTab
            data={downtimeData}
            setData={setDowntimeData}
            onSave={handleDowntimeSave}
            onImport={handleDowntimeImport}
            approvalLogs={downtimeApprovalLogs}
            setApprovalLogs={setDowntimeApprovalLogs}
            lastImportedFile={lastDowntimeImportedFile}
          />
        );
      case 'headcount':
        return (
          <HeadcountTab
            onSave={handleHeadcountSave}
          />
        );
      case 'runRates':
        return (
          <RunRatesTab
            onSave={handleRunRatesSave}
            selectedValueStream={selectedValueStream}
          />
        );
      case 'calendarDays':
        return (
          <CalendarDaysTab
            onSave={handleCalendarDaysSave}
          />
        );
      case 'trainingCurves':
        return (
          <TrainingCurvesTab
            selectedValueStream={selectedValueStream}
          />
        );
      case 'importHistory':
        return <ImportHistoryTab />;
      case 'summary':
        return (
          <SummaryTab
            buildPlanData={buildPlanData}
            headcountData={headcountData}
            downtimesData={downtimeData}
            runRatesData={tabData.runRates}
            yieldData={yieldData}
            onSave={handleSummarySave}
            cbpId={cbpId}
          />
        );
      default:
        return <div>Selecciona una pestaña</div>;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <Header cbpId={cbpId} />
      
      {/* Barra de progreso */}
      <div className="my-6">
        <ProgressBar status={reviewStatus} />
      </div>
      
      {/* Navegación de pestañas */}
      <div className="mb-6">
        <TabNavigation 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          status={reviewStatus}
        />
      </div>
      
      {/* Contenido de pestañas */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {renderActiveTab()}
      </div>
      
      {/* Modales */}
      {showBuildPlanImportModal && (
        <BuildPlanImportModal 
          isOpen={showBuildPlanImportModal}
          onClose={() => setShowBuildPlanImportModal(false)}
          onImport={handleBuildPlanImportComplete}
        />
      )}
      
      {/* Notificación */}
      <Notification 
        show={showNotification}
        onClose={() => setShowNotification(false)}
        message={notificationMessage}
      />
    </div>
  );
};

export default InputReviewRefactored; 