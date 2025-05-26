import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, HelpCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <Link to="/legal/privacy" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
              <Shield className="w-4 h-4 mr-1" />
              Política de Privacidad
            </Link>
            <Link to="/legal/terms" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
              <FileText className="w-4 h-4 mr-1" />
              Términos de Uso
            </Link>
            <Link to="/help" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
              <HelpCircle className="w-4 h-4 mr-1" />
              Ayuda
            </Link>
          </div>
          
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} Smith & Nephew. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}