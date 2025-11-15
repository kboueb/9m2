'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

import {
  LayoutDashboard,
  TrendingUp,
  Wallet,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Sprout,
  Users,
  BarChart3,
  Shield,
  Package,
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
}

interface SidebarProps {
  userRole: 'ADMIN' | 'FARMER' | 'INVESTOR' | 'AGRICULTEUR' | 'INVESTISSEUR';
}

export function Sidebar({ userRole }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  // Menus selon le rôle
  const getMenuItems = (): MenuItem[] => {
    if (userRole === 'ADMIN') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/dashboard/admin' },
        { id: 'users', label: 'Utilisateurs', icon: <Users className="w-5 h-5" />, path: '/dashboard/admin/users' },
        { id: 'projects', label: 'Projets', icon: <Package className="w-5 h-5" />, path: '/dashboard/admin/projects' },
        { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" />, path: '/dashboard/admin/analytics' },
        { id: 'settings', label: 'Paramètres', icon: <Settings className="w-5 h-5" />, path: '/dashboard/admin/settings' },
      ];
    }

    if (userRole === 'FARMER' || userRole === 'AGRICULTEUR') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/dashboard/agriculteur' },
        { id: 'projects', label: 'Mes Projets', icon: <Sprout className="w-5 h-5" />, path: '/dashboard/agriculteur/projects' },
        { id: 'investors', label: 'Investisseurs', icon: <Users className="w-5 h-5" />, path: '/dashboard/agriculteur/investors', badge: 3 },
        { id: 'documents', label: 'Documents', icon: <FileText className="w-5 h-5" />, path: '/dashboard/agriculteur/documents' },
        { id: 'profile', label: 'Mon Profil', icon: <User className="w-5 h-5" />, path: '/dashboard/agriculteur/profile' },
      ];
    }

    // INVESTOR / INVESTISSEUR
    // INVESTOR / INVESTISSEUR
    return [
      { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/dashboard/investisseur' },
      { id: 'parcelles', label: 'Louer Parcelles', icon: <Package className="w-5 h-5" />, path: '/dashboard/investisseur/parcelles', badge: 24 }, // ✅ AJOUT
      { id: 'mes-parcelles', label: 'Mes Parcelles', icon: <Sprout className="w-5 h-5" />, path: '/dashboard/investisseur/mes-parcelles' }, // ✅ AJOUT
      { id: 'investments', label: 'Mes Investissements', icon: <Wallet className="w-5 h-5" />, path: '/dashboard/investisseur/investments' },
      // ... reste du code
    ];

  };

  const menuItems = getMenuItems();

  // Gradient selon le rôle
  const getGradient = () => {
    if (userRole === 'ADMIN') return 'from-red-600 to-orange-600';
    if (userRole === 'FARMER' || userRole === 'AGRICULTEUR') return 'from-green-600 to-emerald-600';
    return 'from-blue-600 to-indigo-600';
  };

  // Icon selon le rôle
  const getRoleIcon = () => {
    if (userRole === 'ADMIN') return '👑';
    if (userRole === 'FARMER' || userRole === 'AGRICULTEUR') return '🚜';
    return '💰';
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col h-screen sticky top-0`}
    >
      {/* Header */}
      <div className={`bg-gradient-to-r ${getGradient()} p-4`}>
        <div className="flex items-center justify-between text-white">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getRoleIcon()}</span>
              <div>
                <h2 className="font-bold text-sm">9m2</h2>
                <p className="text-xs opacity-90">
                  {userRole === 'ADMIN' && 'Admin'}
                  {(userRole === 'FARMER' || userRole === 'AGRICULTEUR') && 'Agriculteur'}
                  {(userRole === 'INVESTOR' || userRole === 'INVESTISSEUR') && 'Investisseur'}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* User Info */}
      {!collapsed && user && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 bg-gradient-to-br ${getGradient()} rounded-full flex items-center justify-center text-white font-bold`}>
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.id}>
                <button
                  onClick={() => router.push(item.path)}
                  className={`w-full flex items-center ${
                    collapsed ? 'justify-center' : 'justify-between'
                  } px-3 py-2.5 rounded-lg transition-all ${
                    isActive
                      ? `bg-gradient-to-r ${getGradient()} text-white shadow-md`
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={isActive ? 'text-white' : 'text-gray-500'}>
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <span className="font-medium text-sm">{item.label}</span>
                    )}
                  </div>
                  {!collapsed && item.badge && (
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                      isActive ? 'bg-white text-blue-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer - Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center ${
            collapsed ? 'justify-center' : 'space-x-3'
          } px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors`}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="font-medium text-sm">Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
}
