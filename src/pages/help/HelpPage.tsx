import React, { useState } from 'react';
import { 
  MessageSquare, 
  Ticket, 
  Phone, 
  Mail, 
  Upload,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export function HelpPage() {
  const [ticketForm, setTicketForm] = useState({
    title: '',
    description: '',
    category: '',
    screenshot: null as File | null
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTicketForm({ ...ticketForm, screenshot: e.target.files[0] });
    }
  };

  const systemStatus = {
    api: { status: 'operational', label: 'API' },
    database: { status: 'operational', label: 'Base de Datos' },
    auth: { status: 'operational', label: 'Autenticación' },
    notifications: { status: 'degraded', label: 'Notificaciones' }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">Centro de Ayuda</h1>
        <p className="text-gray-500">Encuentra ayuda y soporte para el sistema KPI</p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
          <div className="flex items-center">
            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-green-700">Tu ticket ha sido enviado correctamente</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Support Options */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chat Support */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <MessageSquare className="w-5 h-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Chat en Vivo</h2>
              </div>
              <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                En línea
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Nuestro equipo de soporte está disponible para ayudarte en tiempo real.
            </p>
            <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              Iniciar Chat
            </button>
          </div>

          {/* Ticket Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-6">
              <Ticket className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Crear Ticket de Soporte</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Título del Problema
                </label>
                <input
                  type="text"
                  value={ticketForm.title}
                  onChange={(e) => setTicketForm({ ...ticketForm, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Ej: Error al cargar dashboard"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Categoría
                </label>
                <select
                  value={ticketForm.category}
                  onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="technical">Problema técnico</option>
                  <option value="access">Acceso y permisos</option>
                  <option value="feature">Solicitud de mejora</option>
                  <option value="other">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Descripción Detallada
                </label>
                <textarea
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Describe el problema con el mayor detalle posible..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Adjuntar Captura de Pantalla (opcional)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="screenshot"
                        className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500"
                      >
                        <span>Subir archivo</span>
                        <input
                          id="screenshot"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">o arrastra y suelta</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG hasta 10MB
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Enviar Ticket
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Información de Contacto
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Teléfono</p>
                  <p className="text-sm text-gray-500">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-500">soporte@empresa.com</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  Horario de atención:<br />
                  Lun-Vie: 9:00 - 18:00<br />
                  Sáb: 9:00 - 13:00
                </p>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Estado del Sistema
            </h2>
            <div className="space-y-3">
              {Object.entries(systemStatus).map(([key, { status, label }]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{label}</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    status === 'operational'
                      ? 'bg-green-100 text-green-800'
                      : status === 'degraded'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {status === 'operational' ? (
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                    ) : status === 'degraded' ? (
                      <AlertTriangle className="w-3 h-3 mr-1" />
                    ) : (
                      <HelpCircle className="w-3 h-3 mr-1" />
                    )}
                    {status === 'operational' ? 'Operativo' : 
                     status === 'degraded' ? 'Degradado' : 'Inactivo'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Enlaces Rápidos
            </h2>
            <div className="space-y-2">
              {[
                { label: 'Guía de Usuario', href: '#' },
                { label: 'Preguntas Frecuentes', href: '#' },
                { label: 'Tutoriales en Video', href: '#' },
                { label: 'Notas de Versión', href: '#' }
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex items-center justify-between p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md"
                >
                  {link.label}
                  <ExternalLink className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}