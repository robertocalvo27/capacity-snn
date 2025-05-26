import React from 'react';
import { Bell, User } from 'lucide-react';
import { UserMenu } from './UserMenu';

export function Header() {
  const mockUser = {
    name: 'Juan Pérez',
    email: 'juan.perez@company.com',
    role: 'Usuario General'
  };

  const handleLogout = () => {
    // Implementar lógica de logout
    console.log('Logout clicked');
  };

  return (
    <header className="bg-white shadow">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Sistema de Gestión de Producción
          </h2>
        </div>
        <div className="flex items-center space-x-4">
          <button
            type="button"
            className="relative rounded-full bg-white p-1 text-gray-600 hover:text-gray-900"
          >
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              3
            </span>
            <Bell className="h-6 w-6" />
          </button>
          <UserMenu user={mockUser} onLogout={handleLogout} />
        </div>
      </div>
    </header>
  );
}