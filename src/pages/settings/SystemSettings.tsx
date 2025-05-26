import React, { useState } from 'react';
import { 
  Bell,
  AlertTriangle,
  History,
  Database,
  Save,
  CheckCircle2,
  Clock,
  Mail,
  MessageSquare,
  Trash2,
  Upload,
  FileUp,
  Lock,
  Settings
} from 'lucide-react';

export function SystemSettings() {
  const [activeTab, setActiveTab] = useState('notifications');
  const [successMessage, setSuccessMessage] = useState('');
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      inApp: true,
      desktop: false,
      slack: false,
      productionAlerts: true,
      qualityAlerts: true,
      systemAlerts: true,
      maintenanceAlerts: false
    },
    dataManagement: {
      retentionPeriod: '365',
      autoDelete: false,
      archiveData: true,
      backupFrequency: 'daily',
      allowModifications: false,
      modificationWindow: '24',
      requireApproval: true,
      auditChanges: true
    },
    historicalData: {
      importFormat: 'excel',
      validateData: true,
      overwriteExisting: false,
      requireApproval: true,
      notifyStakeholders: true
    }
  });

  const handleSave = () => {
    setSuccessMessage('Configuración guardada exitosamente');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const tabs = [
    { id: 'notifications', label: 'Notificaciones y Alertas', icon: Bell },
    { id: 'dataManagement', label: 'Gestión de Datos', icon: Database },
    { id: 'historicalData', label: 'Datos Históricos', icon: History }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configuración del Sistema</h1>
            <p className="text-gray-500">Administra las notificaciones, políticas de datos y configuraciones generales</p>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Save className="w-5 h-5 mr-2" />
            Guardar Cambios
          </button>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg flex items-center">
            <CheckCircle2 className="w-5 h-5 mr-2" />
            {successMessage}
          </div>
        )}

        <div className="flex space-x-4 border-b mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Canales de Notificación</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Correo Electrónico</p>
                      <p className="text-xs text-gray-500">Recibe notificaciones por email</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.email}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          email: e.target.checked
                        }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Notificaciones en App</p>
                      <p className="text-xs text-gray-500">Notificaciones dentro del sistema</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.inApp}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          inApp: e.target.checked
                        }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tipos de Alertas</h3>
              <div className="space-y-4">
                {[
                  { id: 'productionAlerts', label: 'Alertas de Producción', description: 'Notificaciones sobre metas y desviaciones' },
                  { id: 'qualityAlerts', label: 'Alertas de Calidad', description: 'Problemas de calidad y rechazos' },
                  { id: 'systemAlerts', label: 'Alertas del Sistema', description: 'Mantenimiento y actualizaciones' },
                  { id: 'maintenanceAlerts', label: 'Alertas de Mantenimiento', description: 'Mantenimiento preventivo y correctivo' }
                ].map(alert => (
                  <div key={alert.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{alert.label}</p>
                      <p className="text-xs text-gray-500">{alert.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications[alert.id as keyof typeof settings.notifications]}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: {
                            ...settings.notifications,
                            [alert.id]: e.target.checked
                          }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dataManagement' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Políticas de Retención de Datos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Período de Retención (días)
                  </label>
                  <input
                    type="number"
                    value={settings.dataManagement.retentionPeriod}
                    onChange={(e) => setSettings({
                      ...settings,
                      dataManagement: {
                        ...settings.dataManagement,
                        retentionPeriod: e.target.value
                      }
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Frecuencia de Respaldo
                  </label>
                  <select
                    value={settings.dataManagement.backupFrequency}
                    onChange={(e) => setSettings({
                      ...settings,
                      dataManagement: {
                        ...settings.dataManagement,
                        backupFrequency: e.target.value
                      }
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="daily">Diario</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensual</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  { id: 'autoDelete', label: 'Eliminación Automática', description: 'Eliminar datos antiguos automáticamente' },
                  { id: 'archiveData', label: 'Archivar Datos', description: 'Archivar datos antiguos antes de eliminar' },
                  { id: 'allowModifications', label: 'Permitir Modificaciones', description: 'Permitir modificar datos históricos' },
                  { id: 'requireApproval', label: 'Requerir Aprobación', description: 'Requerir aprobación para modificaciones' },
                  { id: 'auditChanges', label: 'Auditar Cambios', description: 'Registrar todos los cambios en datos' }
                ].map(setting => (
                  <div key={setting.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{setting.label}</p>
                      <p className="text-xs text-gray-500">{setting.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.dataManagement[setting.id as keyof typeof settings.dataManagement] as boolean}
                        onChange={(e) => setSettings({
                          ...settings,
                          dataManagement: {
                            ...settings.dataManagement,
                            [setting.id]: e.target.checked
                          }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'historicalData' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Importación de Datos Históricos</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Formato de Importación
                  </label>
                  <select
                    value={settings.historicalData.importFormat}
                    onChange={(e) => setSettings({
                      ...settings,
                      historicalData: {
                        ...settings.historicalData,
                        importFormat: e.target.value
                      }
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="excel">Excel</option>
                    <option value="csv">CSV</option>
                    <option value="json">JSON</option>
                  </select>
                </div>

                <div className="space-y-4">
                  {[
                    { id: 'validateData', label: 'Validar Datos', description: 'Validar integridad y formato de datos' },
                    { id: 'overwriteExisting', label: 'Sobrescribir Existentes', description: 'Sobrescribir datos existentes' },
                    { id: 'requireApproval', label: 'Requerir Aprobación', description: 'Aprobación para importación' },
                    { id: 'notifyStakeholders', label: 'Notificar Interesados', description: 'Notificar sobre importaciones' }
                  ].map(setting => (
                    <div key={setting.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{setting.label}</p>
                        <p className="text-xs text-gray-500">{setting.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.historicalData[setting.id as keyof typeof settings.historicalData] as boolean}
                          onChange={(e) => setSettings({
                            ...settings,
                            historicalData: {
                              ...settings.historicalData,
                              [setting.id]: e.target.checked
                            }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}