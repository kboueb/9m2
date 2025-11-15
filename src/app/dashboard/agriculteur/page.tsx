'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Sprout, Users, TrendingUp, Package } from 'lucide-react';

export default function AgriculteurDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'FARMER' && user.role !== 'AGRICULTEUR') {
      router.push('/login');
      return;
    }

    setLoading(false);
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Agriculteur
          </h1>
          <p className="text-gray-600">
            Bienvenue, {user?.firstName}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Projets Actifs</h3>
            <p className="text-3xl font-bold">3</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Investisseurs</h3>
            <p className="text-3xl font-bold">12</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Fonds Levés</h3>
            <p className="text-3xl font-bold">45 000 €</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Production</h3>
            <p className="text-3xl font-bold">2.5T</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
