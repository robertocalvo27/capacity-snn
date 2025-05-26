import React from 'react';
import { Mail, Phone } from 'lucide-react';

export function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Política de Privacidad</h1>

        <div className="prose prose-blue max-w-none">
          <p className="text-gray-600 mb-8">
            En Smith & Nephew, nos comprometemos a proteger la privacidad y seguridad de los datos personales recopilados y procesados a través de nuestro sistema. Este documento describe cómo recopilamos, utilizamos y protegemos la información de los usuarios del sistema.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Datos Recopilados</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Datos personales: nombre, cargo, identificación, correo electrónico.</li>
              <li>Datos operativos: registros de actividad, resultados de procesos y tareas asignadas.</li>
              <li>Información técnica: dirección IP, tipo de dispositivo, navegador utilizado y registros de acceso.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Finalidad del Tratamiento de Datos</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Mejorar la eficiencia operativa y el cumplimiento de tareas.</li>
              <li>Garantizar la seguridad del sistema y la trazabilidad de las acciones realizadas.</li>
              <li>Cumplir con las regulaciones legales aplicables al sector médico.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Protección de los Datos</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Implementamos medidas técnicas y organizativas adecuadas para proteger los datos contra accesos no autorizados, pérdidas o alteraciones.</li>
              <li>Los datos son accesibles solo para personal autorizado y con base en el principio de necesidad.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Derechos de los Usuarios</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Acceder a sus datos personales almacenados en el sistema.</li>
              <li>Solicitar la corrección de datos incorrectos o incompletos.</li>
              <li>Solicitar la eliminación de sus datos personales, siempre que no interfiera con obligaciones legales o regulatorias.</li>
            </ul>
            <p className="mt-4 text-gray-600">
              Para ejercer estos derechos, los usuarios deben comunicarse con el responsable de protección de datos al correo:{' '}
              <a href="mailto:privacidad@smithandnephew.com" className="text-blue-600 hover:text-blue-800">
                privacidad@smithandnephew.com
              </a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Conservación de Datos</h2>
            <p className="text-gray-600">
              Los datos se conservarán durante el tiempo necesario para cumplir con los fines descritos en esta política o según lo exijan las leyes aplicables.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Transferencia de Datos</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Smith & Nephew no compartirá datos personales con terceros, salvo en los siguientes casos:</li>
              <li>Cuando sea necesario para el cumplimiento de obligaciones legales o regulatorias.</li>
              <li>Con proveedores de servicios que apoyen nuestras operaciones, bajo estrictos acuerdos de confidencialidad.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cambios en la Política</h2>
            <p className="text-gray-600">
              Esta política podrá ser actualizada periódicamente para reflejar cambios en las prácticas de tratamiento de datos o en las leyes aplicables. Notificaremos a los usuarios sobre cualquier cambio significativo a través del sistema o por correo electrónico.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contacto</h2>
            <p className="text-gray-600 mb-4">
              Para cualquier consulta o inquietud relacionada con esta política de privacidad, comuníquese con nuestro responsable de protección de datos:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Mail className="w-5 h-5 text-blue-600" />
                <a href="mailto:privacidad@smithandnephew.com" className="text-blue-600 hover:text-blue-800">
                  privacidad@smithandnephew.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-blue-600" />
                <span className="text-gray-600">(123) 456-7890</span>
              </div>
            </div>
          </section>

          <section className="mt-8 bg-blue-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Aceptación de la Política</h2>
            <p className="text-gray-600">
              Al utilizar el sistema, los usuarios aceptan los términos de esta política de privacidad. Si no está de acuerdo con alguna parte de esta política, por favor absténgase de utilizar el sistema.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}