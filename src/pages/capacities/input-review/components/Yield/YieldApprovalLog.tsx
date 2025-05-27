import React from 'react';
import { X } from 'lucide-react';

interface YieldLog {
  id: number;
  pn: string;
  description: string;
  yieldValue: number;
  approvedBy: string;
  approvedAt: string;
  month: string;
}

interface YieldApprovalLogProps {
  logs: YieldLog[];
  onClose: () => void;
}

const YieldApprovalLog: React.FC<YieldApprovalLogProps> = ({ logs, onClose }) => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium text-gray-700">Historial de aprobaciones</h4>
        <button 
          className="text-gray-400 hover:text-gray-500"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {logs.length === 0 ? (
        <p className="text-sm text-gray-500">No hay registros de aprobación.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PN</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yield</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aprobado por</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{log.pn}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{log.description}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{log.yieldValue}%</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{log.approvedBy}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {new Date(log.approvedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default YieldApprovalLog; 