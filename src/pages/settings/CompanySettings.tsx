import React, { useState } from 'react';
import { 
  Save,
  Upload,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Lock,
  Database,
  CheckCircle2,
  Link,
  Webhook,
  FileSpreadsheet,
  Settings,
  Server,
  Network,
  Camera
} from 'lucide-react';

export function CompanySettings() {
  const [activeTab, setActiveTab] = useState('info');
  const [successMessage, setSuccessMessage] = useState('');
  const [companyData, setCompanyData] = useState({
    name: 'Mi Empresa',
    legalName: 'Mi Empresa S.A.',
    taxId: '12345678901',
    email: 'contacto@miempresa.com',
    phone: '+1234567890',
    address: 'Calle Principal 123',
    city: 'Ciudad',
    country: 'País',
    logo: null as File | null,
    favicon: null as File | null,
    colors: {
      primary: '#3B82F6',
      secondary: '#10B981'
    },
    welcomeMessage: '¡Bienvenido al sistema de gestión de KPIs!',
    backupFrequency: 'daily',
    securitySettings: {
      twoFactor: true,
      passwordPolicy: true,
      locationAlerts: true
    }
  });

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleInputChange = (field: string, value: any) => {
    setCompanyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setCompanyData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleFileChange = (field: 'logo' | 'favicon', file: File | null) => {
    setCompanyData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleSave = async () => {
    try {
      // Simular una llamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMessage('Cambios guardados exitosamente');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  const tabs = [
    { id: 'info', label: 'Información General', icon: Building2 },
    { id: 'appearance', label: 'Apariencia', icon: Settings },
    { id: 'security', label: 'Seguridad', icon: Lock },
    { id: 'integrations', label: 'Integraciones', icon: Link },
    { id: 'backup', label: 'Respaldo', icon: Database },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Configuración de la Empresa</h1>
        
        {/* Tabs */}
        <div className="flex space-x-4 border-b mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
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

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg flex items-center">
            <CheckCircle2 className="w-5 h-5 mr-2" />
            {successMessage}
          </div>
        )}

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre de la Empresa
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50">
                    <Building2 className="h-4 w-4 text-gray-400" />
                  </span>
                  <input
                    type="text"
                    value={companyData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Razón Social
                </label>
                <input
                  type="text"
                  value={companyData.legalName}
                  onChange={(e) => handleInputChange('legalName', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  RUT/NIT
                </label>
                <input
                  type="text"
                  value={companyData.taxId}
                  onChange={(e) => handleInputChange('taxId', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Correo Electrónico
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </span>
                  <input
                    type="email"
                    value={companyData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50">
                    <Phone className="h-4 w-4 text-gray-400" />
                  </span>
                  <input
                    type="tel"
                    value={companyData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Dirección
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50">
                    <MapPin className="h-4 w-4 text-gray-400" />
                  </span>
                  <input
                    type="text"
                    value={companyData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ciudad
                </label>
                <input
                  type="text"
                  value={companyData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  País
                </label>
                <input
                  type="text"
                  value={companyData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Logo de la Empresa
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  <div className="w-20 h-20 border border-gray-300 rounded-lg flex items-center justify-center">
                    {companyData.logo ? (
                      <img
                        src={URL.createObjectURL(companyData.logo)}
                        alt="Logo"
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <Camera className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <span>Cambiar Logo</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileChange('logo', e.target.files?.[0] || null)}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Favicon
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  <div className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center">
                    {companyData.favicon ? (
                      <img
                        src={URL.createObjectURL(companyData.favicon)}
                        alt="Favicon"
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <Globe className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <span>Cambiar Favicon</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileChange('favicon', e.target.files?.[0] || null)}
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Color Primario
                  </label>
                  <input
                    type="color"
                    value={companyData.colors.primary}
                    onChange={(e) => handleNestedInputChange('colors', 'primary', e.target.value)}
                    className="mt-1 block w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Color Secundario
                  </label>
                  <input
                    type="color"
                    value={companyData.colors.secondary}
                    onChange={(e) => handleNestedInputChange('colors', 'secondary', e.target.value)}
                    className="mt-1 block w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mensaje de Bienvenida
                </label>
                <textarea
                  value={companyData.welcomeMessage}
                  onChange={(e) => handleInputChange('welcomeMessage', e.target.value)}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Configuración de Seguridad
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        Autenticación de Dos Factores
                      </h4>
                      <p className="text-sm text-gray-500">
                        Requiere verificación adicional al iniciar sesión
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={companyData.securitySettings.twoFactor}
                        onChange={(e) => handleNestedInputChange('securitySettings', 'twoFactor', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        Política de Contraseñas
                      </h4>
                      <p className="text-sm text-gray-500">
                        Requiere contraseñas seguras y cambios periódicos
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={companyData.securitySettings.passwordPolicy}
                        onChange={(e) => handleNestedInputChange('securitySettings', 'passwordPolicy', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        Alertas de Ubicación
                      </h4>
                      <p className="text-sm text-gray-500">
                        Notifica sobre inicios de sesión desde ubicaciones nuevas
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={companyData.securitySettings.locationAlerts}
                        onChange={(e) => handleNestedInputChange('securitySettings', 'locationAlerts', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-4">
                    <Webhook className="w-6 h-6 text-blue-500" />
                    <h3 className="text-lg font-medium">Webhooks</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Configura webhooks para recibir notificaciones en tiempo real
                  </p>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Configurar →
                  </button>
                </div>

                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-4">
                    <FileSpreadsheet className="w-6 h-6 text-green-500" />
                    <h3 className="text-lg font-medium">Exportación</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Configura la exportación automática de datos
                  </p>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Configurar →
                  </button>
                </div>

                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-4">
                    <Server className="w-6 h-6 text-purple-500" />
                    <h3 className="text-lg font-medium">API</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Gestiona las credenciales y accesos a la API
                  </p>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Configurar →
                  </button>
                </div>

                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-4">
                    <Network className="w-6 h-6 text-orange-500" />
                    <h3 className="text-lg font-medium">Servicios Externos</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Conecta con servicios de terceros
                  </p>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Configurar →
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Configuración de Respaldo
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Frecuencia de Respaldo
                    </label>
                    <select
                      value={companyData.backupFrequency}
                      onChange={(e) => handleInputChange('backupFrequency', e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="daily">Diario</option>
                      <option value="weekly">Semanal</option>
                      <option value="monthly">Mensual</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <Database className="w-6 h-6 text-blue-500" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          Último respaldo
                        </h4>
                        <p className="text-sm text-gray-500">
                          Hace 2 días
                        </p>
                      </div>
                    </div>
                    <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                      Respaldar ahora
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}