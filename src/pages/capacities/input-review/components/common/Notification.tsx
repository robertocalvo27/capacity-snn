import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface NotificationProps {
  show: boolean;
  onClose: () => void;
  message: string;
}

const Notification: React.FC<NotificationProps> = ({ show, onClose, message }) => {
  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-green-50 border border-green-200 rounded-lg shadow-lg p-4 w-80 z-50 transition-all duration-300 ease-in-out transform translate-x-0 opacity-100">
      <div className="flex">
        <div className="flex-shrink-0">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-green-800">Operación exitosa</h3>
          <div className="mt-1 text-xs text-green-700">
            {message}
          </div>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              onClick={onClose}
              className="inline-flex rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none"
            >
              <span className="sr-only">Cerrar</span>
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification; 