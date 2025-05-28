import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface HeadcountItem {
  id: number | string;
  line: string;
  operators: number;
  supervisors: number;
  month: string;
  valueStream?: string;
}

interface HeadcountApprovalModalProps {
  selectedItems: HeadcountItem[];
  onConfirm: () => void;
  onCancel: () => void;
}

const HeadcountApprovalModal: React.FC<HeadcountApprovalModalProps> = ({
  selectedItems,
  onConfirm,
  onCancel
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmar aprobación de Headcount</h3>
        <p className="text-sm text-gray-600 mb-4">
          Estás a punto de aprobar la siguiente información de headcount:
        </p>
        
        <div className="overflow-y-auto max-h-60 mb-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value Stream</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Línea</th>
                <th scope="col" className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Operarios</th>
                <th scope="col" className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Supervisores</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {selectedItems.map((item) => (
                <tr key={item.id.toString()} className="hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{item.valueStream || '-'}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{item.line}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-center text-gray-900">{item.operators}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-center text-gray-900">{item.supervisors}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Esta acción no se puede deshacer. ¿Estás seguro de que deseas continuar?
        </p>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            onClick={onCancel}
          >
            <XCircle className="mr-2 h-4 w-4 text-gray-500" />
            Cancelar
          </button>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none"
            onClick={onConfirm}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Confirmar aprobación
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeadcountApprovalModal; 