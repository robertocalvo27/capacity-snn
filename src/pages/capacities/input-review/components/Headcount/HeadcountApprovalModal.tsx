import React from 'react';

interface HeadcountItem {
  id: number;
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
        <p className="text-sm text-gray-500 mb-4">
          Estás a punto de aprobar el headcount para {selectedItems.length} líneas. Esta acción quedará registrada y no puede deshacerse.
        </p>

        <div className="mb-4 max-h-48 overflow-y-auto border rounded-md p-2">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Línea</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Operadores</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Supervisores</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {selectedItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">{item.line}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-center text-gray-900">{item.operators}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-center text-gray-900">{item.supervisors}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
            onClick={onConfirm}
          >
            Confirmar aprobación
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeadcountApprovalModal; 