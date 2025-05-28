import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileDown, Calendar, History, Share2 } from 'lucide-react';
import SummaryOverview from './components/SummaryOverview';

// Datos mock para desarrollo
const mockData = {
  metrics: {
    totalDemand: 342800,
    totalCapacity: 356200,
    utilization: 96.24,
    headcount: 543,
    productivity: 108.5,
    timeUtilization: 92.6
  },
  valueStreams: [
    {
      id: 'roadster',
      name: 'Roadster',
      demand: 87400,
      capacity: 85200,
      utilization: 102.58,
      status: 'over' as const
    },
    {
      id: 'sportsMedicine',
      name: 'Sports Medicine',
      demand: 125600,
      capacity: 132400,
      utilization: 94.86,
      status: 'balanced' as const
    },
    {
      id: 'ent',
      name: 'ENT',
      demand: 42300,
      capacity: 46500,
      utilization: 90.97,
      status: 'balanced' as const
    },
    {
      id: 'wound',
      name: 'Wound',
      demand: 56800,
      capacity: 64100,
      utilization: 88.61,
      status: 'under' as const
    },
    {
      id: 'fixation',
      name: 'Fixation',
      demand: 30700,
      capacity: 28000,
      utilization: 109.64,
      status: 'over' as const
    }
  ],
  detailData: {
    // Aquí irían datos detallados para cada pestaña
    // Se puede expandir según sea necesario
  },
  approvalStatus: {
    approvedBy: 'Juan Pérez',
    approvedAt: '2024-06-03T15:42:30Z',
    productionApproval: {
      approved: true,
      by: 'María Rodríguez',
      at: '2024-06-02T11:25:10Z',
      comments: 'Aprobado con ajuste en headcount de Roadster.'
    },
    planningApproval: {
      approved: true,
      by: 'Carlos Gómez',
      at: '2024-06-03T09:15:45Z',
      comments: 'Aceptado con ajuste de volumen en Fixation.'
    }
  }
};

const CBPSummary: React.FC = () => {
  const { cbpId = '24-06' } = useParams<{ cbpId?: string }>();
  const [activeTab, setActiveTab] = useState('overview');

  // Función para descargar el reporte (simulada)
  const handleDownloadReport = () => {
    alert('Descargando reporte en Excel...');
    // Aquí iría la lógica real para descargar el informe
  };

  // Función para compartir el reporte (simulada)
  const handleShareReport = () => {
    alert('Compartiendo reporte por correo electrónico...');
    // Aquí iría la lógica real para compartir el informe
  };

  const renderTabContent = () => {
    if (activeTab === 'overview') {
      return (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <SummaryOverview 
            cbpId={cbpId} 
            metrics={mockData.metrics} 
            valueStreams={mockData.valueStreams} 
          />
        </div>
      );
    } else {
      return (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Detalles por Value Stream</h3>
            <p className="text-gray-500">
              Esta sección mostrará información detallada por Value Stream y será implementada en la próxima fase.
            </p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">CBP Final Summary</h1>
            <p className="text-gray-500">Resumen ejecutivo para el CBP {cbpId}</p>
            <div className="flex items-center mt-2 space-x-4">
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                Junio 2024
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <History className="w-4 h-4 mr-1" />
                Actualizado: {new Date(mockData.approvalStatus.approvedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              onClick={handleDownloadReport}
            >
              <FileDown className="w-4 h-4 mr-2" />
              Exportar
            </button>
            <button 
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
              onClick={handleShareReport}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Compartir
            </button>
          </div>
        </div>
      </div>

      {/* Approval Status */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-green-800 font-medium">Resumen Aprobado</h2>
            <p className="text-sm text-green-700 mt-1">
              Este CBP ha sido aprobado y firmado por todos los responsables.
            </p>
          </div>
          <div className="flex space-x-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Producción</h3>
              <p className="text-xs text-gray-500">
                {mockData.approvalStatus.productionApproval.by}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(mockData.approvalStatus.productionApproval.at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Planeación</h3>
              <p className="text-xs text-gray-500">
                {mockData.approvalStatus.planningApproval.by}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(mockData.approvalStatus.planningApproval.at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de navegación */}
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`py-4 px-6 border-b-2 font-medium text-sm ${
              activeTab === 'overview' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Vista General
          </button>
          <button
            className={`py-4 px-6 border-b-2 font-medium text-sm ${
              activeTab === 'details' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('details')}
          >
            Detalles por Value Stream
          </button>
        </div>
      </div>
      
      {/* Contenido de la pestaña activa */}
      {renderTabContent()}
    </div>
  );
};

export default CBPSummary; 