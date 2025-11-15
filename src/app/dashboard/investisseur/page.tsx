'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TrendingUp, DollarSign, PieChart, ArrowUpRight } from 'lucide-react';

export default function InvestisseurDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'INVESTOR' && user.role !== 'INVESTISSEUR') {
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Investisseur
          </h1>
          <p className="text-gray-600">
            Bienvenue, {user?.firstName} {user?.lastName}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Investi */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-600 text-sm font-semibold flex items-center bg-green-50 px-2 py-1 rounded-full">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +12.5%
              </span>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Total Investi</h3>
            <p className="text-3xl font-bold text-gray-900">25 000 €</p>
            <p className="text-xs text-gray-500 mt-2">Depuis le début</p>
          </div>

          {/* Rendement */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-600 text-sm font-semibold flex items-center bg-green-50 px-2 py-1 rounded-full">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +8.2%
              </span>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Rendement Total</h3>
            <p className="text-3xl font-bold text-gray-900">2 050 €</p>
            <p className="text-xs text-gray-500 mt-2">Ce mois : +320 €</p>
          </div>

          {/* Projets */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <PieChart className="w-6 h-6 text-white" />
              </div>
              <span className="text-blue-600 text-sm font-semibold bg-blue-50 px-2 py-1 rounded-full">
                Actifs
              </span>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Projets</h3>
            <p className="text-3xl font-bold text-gray-900">8</p>
            <p className="text-xs text-gray-500 mt-2">+2 ce mois</p>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Mes Investissements Récents
            </h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
              Voir tout →
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Project 1 */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-md transition-all border border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🌾</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Ferme Bio du Val de Loire
                  </h3>
                  <p className="text-sm text-gray-600">
                    Investissement : <span className="font-semibold">5 000 €</span>
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      En cours
                    </span>
                    <span className="text-xs text-gray-500">3 mois</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600 text-lg">+12%</p>
                <p className="text-sm text-gray-600">600 €</p>
              </div>
            </div>

            {/* Project 2 */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-md transition-all border border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🍯</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Ruches Urbaines Paris
                  </h3>
                  <p className="text-sm text-gray-600">
                    Investissement : <span className="font-semibold">3 000 €</span>
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      En cours
                    </span>
                    <span className="text-xs text-gray-500">2 mois</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600 text-lg">+8%</p>
                <p className="text-sm text-gray-600">240 €</p>
              </div>
            </div>

            {/* Project 3 */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-md transition-all border border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🍅</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Maraîchage Bio Provence
                  </h3>
                  <p className="text-sm text-gray-600">
                    Investissement : <span className="font-semibold">7 000 €</span>
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                      Nouveau
                    </span>
                    <span className="text-xs text-gray-500">1 mois</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600 text-lg">+15%</p>
                <p className="text-sm text-gray-600">1 050 €</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
