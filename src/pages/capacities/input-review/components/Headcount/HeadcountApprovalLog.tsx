import React from 'react';
import { X } from 'lucide-react';

interface HeadcountLog {
  id: number;
  valueStream: string;
  line: string;
  operators: number;
  supervisors: number;
  month: string;
  approvedBy: string;
  approvedAt: string;
}

interface HeadcountApprovalLogProps {
  logs: HeadcountLog[];
  onClose: () => void;
}

const HeadcountApprovalLog: React.FC<HeadcountApprovalLogProps> = ({ logs, onClose }) => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium text-gray-700">Historial de aprobaciones de Headcount</h4>
        <button 
          className="text-gray-400 hover:text-gray-600" 
          onClick={onClose}
          aria-label="Cerrar historial"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value Stream</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Línea</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operarios</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supervisores</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mes</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aprobado por</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.length > 0 ? (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{log.valueStream}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{log.line}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{log.operators}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{log.supervisors}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{log.month}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{log.approvedBy}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{log.approvedAt}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-3 py-4 text-center text-sm text-gray-500">
                  No hay registros de aprobación.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HeadcountApprovalLog; 