import React, { useState } from 'react';
import { 
  Plus, 
  Save,
  CheckCircle2,
  Shield,
  Eye,
  Edit2,
  Trash2,
  Lock
} from 'lucide-react';
import { AddRoleModal } from '../../components/users/AddRoleModal';

interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

const mockPermissions: Permission[] = [
  {
    id: '1',
    name: 'view_dashboards',
    description: 'Ver dashboards',
    module: 'Dashboards'
  },
  {
    id: '2',
    name: 'edit_data',
    description: 'Editar datos',
    module: 'Input Data'
  },
  {
    id: '3',
    name: 'manage_actions',
    description: 'Gestionar planes de acción',
    module: 'Action Plans'
  }
];

const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Manager',
    description: 'Acceso completo al sistema',
    permissions: ['1', '2', '3']
  },
  {
    id: '2',
    name: 'Jefe de Línea',
    description: 'Gestión de línea y turno específico',
    permissions: ['1', '2']
  },
  {
    id: '3',
    name: 'Usuario General',
    description: 'Registro de datos básicos',
    permissions: ['1']
  }
];

export const RolesAndPermissions: React.FC = () => {
  const [roles] = useState<Role[]>(mockRoles);
  const [permissions] = useState<Permission[]>(mockPermissions);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleAddRole = () => {
    setSelectedRole(null);
    setShowRoleModal(true);
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setShowRoleModal(true);
  };

  const handleSaveRole = (roleData: any) => {
    // Aquí implementarías la lógica para guardar el rol
    console.log('Nuevo rol:', roleData);
    setSuccessMessage('Rol creado exitosamente');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Roles y Permisos</h1>
            <p className="text-gray-500">Gestiona los roles y permisos del sistema</p>
          </div>
          <button
            onClick={handleAddRole}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Rol
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

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div key={role.id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <Shield className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">{role.name}</h2>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditRole(role)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button className="text-gray-400 hover:text-red-500">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-4">{role.description}</p>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">Permisos:</h3>
              {permissions
                .filter(p => role.permissions.includes(p.id))
                .map((permission) => (
                  <div
                    key={permission.id}
                    className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-lg"
                  >
                    {permission.module === 'Dashboards' && <Eye className="w-4 h-4 mr-2" />}
                    {permission.module === 'Input Data' && <Edit2 className="w-4 h-4 mr-2" />}
                    {permission.module === 'Action Plans' && <Lock className="w-4 h-4 mr-2" />}
                    {permission.description}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Permissions Table */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Lista de Permisos Disponibles
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permiso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Módulo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {permissions.map((permission) => (
                <tr key={permission.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {permission.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {permission.module}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {permission.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Role Modal */}
      <AddRoleModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        onSave={handleSaveRole}
      />
    </div>
  );
};