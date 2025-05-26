import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  HelpCircle,
  Book,
  Sun,
  Moon,
  LogOut,
  Settings,
  ChevronDown
} from 'lucide-react';

interface UserMenuProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
  onLogout: () => void;
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Aquí implementarías la lógica real del modo oscuro
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <User className="h-5 w-5 text-blue-600" />
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-700">{user.name}</p>
          <p className="text-xs text-gray-500">{user.role}</p>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${
          isOpen ? 'transform rotate-180' : ''
        }`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
          {/* User Info */}
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              to="/help"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <HelpCircle className="h-4 w-4 mr-3" />
              Ayuda
            </Link>

            <Link
              to="/help/knowledge-base"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <Book className="h-4 w-4 mr-3" />
              Knowledge Base
            </Link>

            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4 mr-3" />
              ) : (
                <Moon className="h-4 w-4 mr-3" />
              )}
              {isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
            </button>

            <Link
              to="/settings/personal"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="h-4 w-4 mr-3" />
              Configuración Personal
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 pt-2">
            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}