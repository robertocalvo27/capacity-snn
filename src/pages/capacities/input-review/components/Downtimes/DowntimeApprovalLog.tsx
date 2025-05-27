import React from 'react';
import { X } from 'lucide-react';

interface DowntimeLog {
  id: number;
  type: string;
  date: string;
  hours: number;
  reason: string;
  description: string;
  valueStream: string;
  line: string;
  approvedBy: string;
  approvedAt: string;
  area: string;
}

interface DowntimeApprovalLogProps {
  logs: DowntimeLog[];
  onClose: () => void;
}

const DowntimeApprovalLog: React.FC<DowntimeApprovalLogProps> = ({ logs, onClose }) => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium text-gray-700">Historial de aprobaciones de Downtimes</h4>
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horas</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motivo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aplicación</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aprobado por</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      log.type === 'general' 
                        ? 'bg-blue-100 text-blue-800' 
                        : log.type === 'valueStream' 
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                    }`}>
                      {log.type === 'general' 
                        ? 'General' 
                        : log.type === 'valueStream' 
                          ? 'Value Stream' 
                          : 'Línea'
                      }
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{log.date}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{log.hours}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{log.reason}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {log.type === 'general' 
                      ? 'Toda la planta' 
                      : log.type === 'valueStream' 
                        ? log.valueStream 
                        : `${log.valueStream} / ${log.line}`
                    }
                  </td>
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

export default DowntimeApprovalLog; 