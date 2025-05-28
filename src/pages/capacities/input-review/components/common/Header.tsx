import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ClipboardList } from 'lucide-react';

interface HeaderProps {
  cbpId: string;
}

const Header: React.FC<HeaderProps> = ({ cbpId }) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <ClipboardList className="w-7 h-7 text-blue-600 mr-2" />
            Input Review - CBP {cbpId}
          </h1>
          <p className="text-gray-500">Revisión y gestión de los inputs necesarios para el modelo de capacidad</p>
        </div>
        <button 
          className="p-2 rounded-lg hover:bg-gray-100 flex items-center text-gray-600"
          onClick={() => navigate(`/capacities/${cbpId}`)}
        >
          <ArrowLeft className="w-5 h-5 mr-1" /> Volver
        </button>
      </div>
    </div>
  );
};

export default Header; 