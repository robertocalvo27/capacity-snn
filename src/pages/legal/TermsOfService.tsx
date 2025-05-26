import React from 'react';
import { Mail, Phone, AlertTriangle } from 'lucide-react';

export function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Términos de Uso</h1>

        <div className="prose prose-blue max-w-none">
          <p className="text-gray-600 mb-8">
            Bienvenido al sistema desarrollado para Smith & Nephew. Este sistema ha sido diseñado para mejorar la gestión y eficiencia en las operaciones del sector médico. Al utilizar este sistema, los usuarios aceptan cumplir con los términos y condiciones establecidos en este documento.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceso al Sistema</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>El acceso al sistema está restringido exclusivamente a usuarios autorizados por Smith & Nephew.</li>
              <li>Cada usuario recibirá credenciales únicas (nombre de usuario y contraseña) que deben ser protegidas y no compartidas.</li>
              <li>Es responsabilidad del usuario notificar al equipo de soporte de inmediato ante cualquier sospecha de acceso no autorizado.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Uso Aceptable del Sistema</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>El sistema debe ser utilizado únicamente para tareas relacionadas con las operaciones laborales asignadas.</li>
              <li>
                Está estrictamente prohibido:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Usar el sistema para fines personales.</li>
                  <li>Manipular datos sin autorización.</li>
                  <li>Compartir información confidencial con personas no autorizadas.</li>
                </ul>
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Propiedad Intelectual</h2>
            <p className="text-gray-600">
              Todo el contenido del sistema, incluyendo códigos, diseños y datos, es propiedad exclusiva de Smith & Nephew. El uso indebido o la reproducción no autorizada de cualquier parte del sistema podría resultar en sanciones legales.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Seguridad del Sistema</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Smith & Nephew implementará medidas razonables para garantizar la seguridad del sistema y la protección de los datos.</li>
              <li>Los usuarios son responsables de reportar cualquier vulnerabilidad o actividad sospechosa que detecten.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Limitación de Responsabilidad</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Smith & Nephew no se hace responsable de daños directos o indirectos causados por el mal uso del sistema por parte de los usuarios.</li>
              <li>Los usuarios deben garantizar que sus acciones dentro del sistema estén alineadas con estos términos.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Consecuencias por Incumplimiento</h2>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-4">
              <div className="flex">
                <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
                <div>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li>El incumplimiento de estos términos podrá resultar en la suspensión o cancelación del acceso al sistema.</li>
                    <li>Smith & Nephew se reserva el derecho de tomar acciones legales si el incumplimiento resulta en daños o pérdidas significativas.</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Modificaciones de los Términos</h2>
            <p className="text-gray-600">
              Smith & Nephew se reserva el derecho de modificar estos términos en cualquier momento. Las actualizaciones serán notificadas a los usuarios oportunamente.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contacto</h2>
            <p className="text-gray-600 mb-4">
              Para cualquier duda o consulta relacionada con estos términos, comuníquese con el departamento de soporte:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Mail className="w-5 h-5 text-blue-600" />
                <a href="mailto:soporte@smithandnephew.com" className="text-blue-600 hover:text-blue-800">
                  soporte@smithandnephew.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-blue-600" />
                <span className="text-gray-600">(123) 456-7890</span>
              </div>
            </div>
          </section>

          <section className="mt-8 bg-blue-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Aceptación de los Términos</h2>
            <p className="text-gray-600">
              El acceso y uso del sistema implica la aceptación de los presentes términos y condiciones. Si no está de acuerdo con alguna parte de estos términos, por favor absténgase de utilizar el sistema.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}