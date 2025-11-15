'use client';

import { ReactNode, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import {
  LogOut,
  Menu,
  X,
  Home,
  Users,
  MapPin,
  TrendingUp,
  Settings,
  Bell,
  User,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navigation = [
    { name: 'Tableau de bord', icon: Home, href: '/dashboard' },
    { name: 'Parcelles', icon: MapPin, href: '/dashboard/parcelles' },
    { name: 'Investissements', icon: TrendingUp, href: '/dashboard/investissements' },
    { name: 'Utilisateurs', icon: Users, href: '/dashboard/users', adminOnly: true },
    { name: 'Paramètres', icon: Settings, href: '/dashboard/settings' },
  ];

  const filteredNavigation = navigation.filter(
    item => !item.adminOnly || user?.role === 'ADMIN'
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Mobile */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div
          className={`absolute inset-0 bg-gray-900/50 transition-opacity ${
            sidebarOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setSidebarOpen(false)}
        />
        <div
          className={`absolute inset-y-0 left-0 w-64 bg-white transform transition-transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-6">
            <button onClick={() => setSidebarOpen(false)} className="mb-8">
              <X size={24} />
            </button>
            <nav className="space-y-2">
              {filteredNavigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-emerald-50 text-gray-700 hover:text-emerald-600 transition-colors"
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Sidebar Desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-white border-r border-gray-200">
        <div className="flex flex-col flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-emerald-600">🌾 9M2</h1>
            <p className="text-sm text-gray-500 mt-1">Plateforme Agricole</p>
          </div>

          <nav className="flex-1 space-y-2">
            {filteredNavigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-emerald-50 text-gray-700 hover:text-emerald-600 transition-colors"
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </a>
            ))}
          </nav>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <User size={20} className="text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <Menu size={24} />
              </button>
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className="lg:hidden">
                <button className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <User size={16} className="text-emerald-600" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
