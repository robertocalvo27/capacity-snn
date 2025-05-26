import React, { useState } from 'react';
import { 
  Save,
  CheckCircle2,
  Shield,
  BadgeCheck,
  Truck,
  Factory,
  DollarSign,
  Clock,
  Search
} from 'lucide-react';

interface Assignment {
  userId: string;
  userName: string;
  email: string;
  areas: string[];
  lines: string[];
  shifts: string[];
}

const mockAssignments: Assignment[] = [
  {
    userId: '1',
    userName: 'Juan Pérez',
    email: 'juan.perez@company.com',
    areas: ['Safety', 'Quality'],
    lines: ['L06', 'L07'],
    shifts: ['T1', 'T2']
  },
  {
    userId: '2',
    userName: 'María García',
    email: 'maria.garcia@company.com',
    areas: ['Production'],
    lines: ['Rapid Rhino'],
    shifts: ['T3']
  }
];

const areas = [
  { id: 'safety', name: 'Safety', icon: Shield },
  { id: 'quality', name: 'Quality', icon: BadgeCheck },
  { id: 'delivery', name: 'Delivery', icon: Truck },
  { id: 'production', name: 'Production', icon: Factory },
  { id: 'cost', name: 'Cost', icon: DollarSign }
];

const lines = ['L06', 'L07', 'Rapid Rhino', 'ENT'];
const shifts = ['T1', 'T2', 'T3'];

export const Assignments: React.FC = () => {
  const [assignments] = useState<Assignment[]>(mockAssignments);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Asignaciones</h1>
            <p className="text-gray-500">Gestiona las asignaciones de usuarios a áreas, líneas y turnos</p>
          </div>
          <button
            onClick={() => showSuccess('Cambios guardados correctamente')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Save className="w-5 h-5 mr-2" />
            Guardar Cambios
          </button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
          <div className="flex items-center">
            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-green-700">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="max-w-md">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar usuarios..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Assignments Table */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Áreas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Líneas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Turnos
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assignments.map((assignment) => (
                <tr key={assignment.userId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {assignment.userName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {assignment.userName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {assignment.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-2">
                      {areas.map((area) => {
                        const isAssigned = assignment.areas.includes(area.name);
                        return (
                          <label
                            key={area.id}
                            className={`flex items-center px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                              isAssigned
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isAssigned}
                              className="hidden"
                              onChange={() => {}}
                            />
                            <area.icon className="w-4 h-4 mr-2" />
                            {area.name}
                          </label>
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-2">
                      {lines.map((line) => {
                        const isAssigned = assignment.lines.includes(line);
                        return (
                          <label
                            key={line}
                            className={`flex items-center px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                              isAssigned
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isAssigned}
                              className="hidden"
                              onChange={() => {}}
                            />
                            <Factory className="w-4 h-4 mr-2" />
                            {line}
                          </label>
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-2">
                      {shifts.map((shift) => {
                        const isAssigned = assignment.shifts.includes(shift);
                        return (
                          <label
                            key={shift}
                            className={`flex items-center px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                              isAssigned
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isAssigned}
                              className="hidden"
                              onChange={() => {}}
                            />
                            <Clock className="w-4 h-4 mr-2" />
                            {shift}
                          </label>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};