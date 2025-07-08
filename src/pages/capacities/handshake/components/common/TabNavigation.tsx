import React from 'react';
import { CheckCircle, Eye, AlertTriangle, FileText, PenTool, BarChart3 } from 'lucide-react';
import type { HandShakeStatusItem } from '../../../../../types/capacity';

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handShakeStatus: HandShakeStatusItem;
}

interface TabItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  status: boolean;
  description: string;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ 
  activeTab, 
  setActiveTab, 
  handShakeStatus 
}) => {
  const tabs: TabItem[] = [
    {
      id: 'vstReview',
      name: 'Revisión VSTs',
      icon: <Eye className="w-5 h-5" />,
      status: handShakeStatus.vstReviewed,
      description: 'Revisar y aprobar cada Value Stream'
    },
    {
      id: 'concerns',
      name: 'Preocupaciones',
      icon: <AlertTriangle className="w-5 h-5" />,
      status: handShakeStatus.concernsAddressed,
      description: 'Gestionar preocupaciones y riesgos'
    },
    {
      id: 'agreements',
      name: 'Acuerdos',
      icon: <FileText className="w-5 h-5" />,
      status: handShakeStatus.agreementsReached,
      description: 'Definir compromisos y condiciones'
    },
    {
      id: 'signoff',
      name: 'Aprobación Final',
      icon: <PenTool className="w-5 h-5" />,
      status: handShakeStatus.finalSignoffComplete,
      description: 'Firma final de ambos directores'
    },
    {
      id: 'summary',
      name: 'Resumen',
      icon: <BarChart3 className="w-5 h-5" />,
      status: handShakeStatus.finalSignoffComplete,
      description: 'Resumen ejecutivo del Hand Shake'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-2">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title={tab.description}
          >
            <div className="flex items-center space-x-2">
              {tab.icon}
              <span className="hidden sm:inline">{tab.name}</span>
              {tab.status && (
                <CheckCircle className="w-4 h-4 text-green-500 ml-1" />
              )}
            </div>
          </button>
        ))}
      </div>
      
      {/* Indicador de progreso */}
      <div className="mt-4 px-2">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Progreso del Hand Shake</span>
          <span>
            {Object.values(handShakeStatus).filter(Boolean).length} / {Object.keys(handShakeStatus).length} completado
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${(Object.values(handShakeStatus).filter(Boolean).length / Object.keys(handShakeStatus).length) * 100}%` 
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;