import React, { useState } from 'react';
import { X, Save, Shield, Eye, Edit2, Lock, BarChart2, ClipboardList, Target } from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  module: string;
  description: string;
}

interface AddRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (roleData: any) => void;
}

export function AddRoleModal({ isOpen, onClose, onSave }: AddRoleModalProps) {
  const [roleData, setRoleData] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });

  const availablePermissions: Permission[] = [
    // Dashboards
    { id: 'view_dashboards', name: 'Ver dashboards', module: 'Dashboards', description: 'Acceso a visualización de dashboards' },
    { id: 'export_dashboards', name: 'Exportar dashboards', module: 'Dashboards', description: 'Exportar datos de dashboards' },
    
    // Datos
    { id: 'view_data', name: 'Ver datos', module: 'Datos', description: 'Ver datos de producción' },
    { id: 'edit_data', name: 'Editar datos', module: 'Datos', description: 'Editar datos de producción' },
    { id: 'delete_data', name: 'Eliminar datos', module: 'Datos', description: 'Eliminar registros de producción' },
    
    // Planes de Acción
    { id: 'view_actions', name: 'Ver planes', module: 'Planes de Acción', description: 'Ver planes de acción' },
    { id: 'create_actions', name: 'Crear planes', module: 'Planes de Acción', description: 'Crear nuevos planes de acción' },
    { id: 'manage_actions', name: 'Gestionar planes', module: 'Planes de Acción', description: 'Gestión completa de planes' },
    
    // Reportes
    { id: 'view_reports', name: 'Ver reportes', module: 'Reportes', description: 'Acceso a reportes' },
    { id: 'export_reports', name: 'Exportar reportes', module: 'Reportes', description: 'Exportar reportes' },
    
    // Configuración
    { id: 'manage_settings', name: 'Gestionar configuración', module: 'Configuración', description: 'Acceso a configuración del sistema' }
  ];

  const modules = Array.from(new Set(availablePermissions.map(p => p.module)));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(roleData);
    onClose();
  };

  const togglePermission = (permissionId: string) => {
    setRoleData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'Dashboards':
        return <BarChart2 className="w-5 h-5 text-blue-500" />;
      case 'Datos':
        return <ClipboardList className="w-5 h-5 text-green-500" />;
      case 'Planes de Acción':
        return <Target className="w-5 h-5 text-purple-500" />;
      case 'Reportes':
        return <Eye className="w-5 h-5 text-orange-500" />;
      case 'Configuración':
        return <Lock className="w-5 h-5 text-gray-500" />;
      default:
        return <Shield className="w-5 h-5 text-gray-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Nuevo Rol</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Información básica */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre del Rol
                </label>
                <input
                  type="text"
                  required
                  value={roleData.name}
                  onChange={(e) => setRoleData({ ...roleData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Ej: Ingeniero de Producción"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Descripción
                </label>
                <textarea
                  required
                  value={roleData.description}
                  onChange={(e) => setRoleData({ ...roleData, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Describe las responsabilidades principales de este rol..."
                />
              </div>
            </div>

            {/* Permisos por módulo */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Permisos</h3>
              
              {modules.map(module => (
                <div key={module} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    {getModuleIcon(module)}
                    <h4 className="text-lg font-medium text-gray-900">{module}</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availablePermissions
                      .filter(p => p.module === module)
                      .map(permission => (
                        <label
                          key={permission.id}
                          className="relative flex items-start p-4 rounded-lg border border-gray-200 hover:bg-white cursor-pointer"
                        >
                          <div className="flex items-center h-5">
                            <input
                              type="checkbox"
                              checked={roleData.permissions.includes(permission.id)}
                              onChange={() => togglePermission(permission.id)}
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{permission.name}</p>
                            <p className="text-sm text-gray-500">{permission.description}</p>
                          </div>
                        </label>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar Rol
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}