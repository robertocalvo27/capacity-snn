import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileBarChart,
  Upload,
  Target,
  Settings,
  Users,
  ChevronDown,
  ChevronUp,
  Home,
  UserCog,
  ClipboardList,
  History,
  User,
  Building2,
  Sliders,
  Bell,
  ChevronLeft,
  ChevronRight,
  ListTodo,
  BarChart2,
  Plus,
  Factory
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  subItems?: {
    name: string;
    href: string;
    icon: React.ElementType;
  }[];
}

const navigation: NavItem[] = [
  {
    name: 'Inicio',
    href: '/',
    icon: Home
  },
  {
    name: 'Dashboards',
    href: '/dashboards',
    icon: LayoutDashboard,
    subItems: [
      { name: 'Líder', href: '/dashboards/leader', icon: User },
      { name: 'Supervisor', href: '/dashboards/supervisor', icon: Users }
    ]
  },
  {
    name: 'Reportes',
    href: '/reports',
    icon: FileBarChart
  },
  {
    name: 'Entrada de Datos',
    href: '/data-entry',
    icon: Upload
  },
  {
    name: 'Planes de Acción',
    href: '/actions',
    icon: Target,
    subItems: [
      { name: 'Historial', href: '/actions/history', icon: ListTodo },
      { name: 'Nuevo Plan', href: '/actions/new', icon: Plus },
      { name: 'Análisis', href: '/actions/analysis', icon: BarChart2 }
    ]
  },
  {
    name: 'Usuarios',
    href: '/users',
    icon: Users,
    subItems: [
      { name: 'Gestión de Usuarios', href: '/users/management', icon: Users },
      { name: 'Roles y Permisos', href: '/users/roles', icon: UserCog },
      { name: 'Asignaciones', href: '/users/assignments', icon: ClipboardList },
      { name: 'Auditoría', href: '/users/audit', icon: History }
    ]
  },
  {
    name: 'Configuración',
    href: '/settings',
    icon: Settings,
    subItems: [
      { name: 'Configuración Personal', href: '/settings/personal', icon: User },
      { name: 'Configuración de Compañía', href: '/settings/company', icon: Building2 },
      { name: 'Parámetros de Producción', href: '/settings/production', icon: Sliders },
      { name: 'Configuración del Sistema', href: '/settings/system', icon: Bell }
    ]
  },
  {
    name: 'Engineering (IE)',
    href: '/engineering',
    icon: Factory,
    subItems: [
      { name: 'Balance Linea', href: '/engineering/balance-linea', icon: Sliders }
    ]
  },
  {
    name: 'Capacity Model',
    href: '/capacities',
    icon: BarChart2
  }
];

export function Sidebar() {
  const location = useLocation();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSection = (name: string) => {
    setExpandedSection(expandedSection === name ? null : name);
  };

  return (
    <div className={`relative h-full bg-white border-r border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1 shadow-md hover:bg-gray-50"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        )}
      </button>

      <div className="p-4">
        <div className="flex items-center space-x-2">
          <LayoutDashboard className="h-8 w-8 text-blue-600 flex-shrink-0" />
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-gray-900">Producción HxH</h1>
              <p className="text-sm text-gray-500">Control</p>
            </div>
          )}
        </div>
      </div>

      <nav className={`mt-4 px-2 space-y-1 ${isCollapsed ? 'px-1' : 'px-2'}`}>
        {navigation.map((item) => (
          <div key={item.href} className="mb-1">
            <Link
              to={item.subItems ? '#' : item.href}
              onClick={item.subItems ? () => toggleSection(item.name) : undefined}
              className={`w-full group flex items-center justify-start rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                location.pathname === item.href
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className={`h-5 w-5 flex-shrink-0 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left">{item.name}</span>
                  {item.subItems && (
                    expandedSection === item.name ? (
                      <ChevronUp className="ml-auto h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-auto h-4 w-4" />
                    )
                  )}
                </>
              )}
            </Link>

            {!isCollapsed && expandedSection === item.name && item.subItems && (
              <div className="mt-1 ml-4 space-y-1">
                {item.subItems.map((subItem) => {
                  const SubIcon = subItem.icon;
                  const isSubActive = location.pathname === subItem.href;
                  return (
                    <Link
                      key={subItem.href}
                      to={subItem.href}
                      className={`group flex items-center justify-start rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isSubActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <SubIcon className="h-4 w-4 mr-3" />
                      <span>{subItem.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}