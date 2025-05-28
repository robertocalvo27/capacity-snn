import React from 'react';
import { Check } from 'lucide-react';

interface StatusItem {
  complete: boolean;
  date: string | null;
}

interface ProgressBarProps {
  status: Record<string, StatusItem>;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ status }) => {
  const completedPercentage = Object.values(status).filter(item => item.complete).length / Object.values(status).length * 100;
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-medium mb-2 text-gray-900">Progreso General</h3>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{ width: `${completedPercentage}%` }}
        ></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Object.entries(status).map(([key, value]) => (
          <div 
            key={key}
            className={`text-center p-3 rounded-lg border ${value.complete ? 'border-green-200 bg-green-50 text-green-700' : 'border-gray-200 bg-gray-50 text-gray-700'}`}
          >
            <div className="text-sm font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
            <div className="text-xs">{value.complete ? 'Completado' : 'Pendiente'}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar; 