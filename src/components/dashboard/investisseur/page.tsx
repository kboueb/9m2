'use client';

import { DashboardLayout } from '@/components/dashboard/shared/DashboardLayout';
import { StatCard } from '@/components/dashboard/shared/StatCard';
import { Wallet, TrendingUp, MapPin, Clock } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const stats = [
  { label: 'Investissement Total', value: '45 000 €', change: 12.5, icon: Wallet, color: 'emerald' as const },
  { label: 'Rendement Moyen', value: '8.5%', change: 2.3, icon: TrendingUp, color: 'blue' as const },
  { label: 'Parcelles Actives', value: '12', icon: MapPin, color: 'amber' as const },
  { label: 'En Attente', value: '3', icon: Clock, color: 'red' as const },
];

const investmentData = [
  { mois: 'Jan', montant: 5000 },
  { mois: 'Fév', montant: 8000 },
  { mois: 'Mar', montant: 12000 },
  { mois: 'Avr', montant: 15000 },
  { mois: 'Mai', montant: 22000 },
  { mois: 'Juin', montant: 28000 },
];

const rendementData = [
  { mois: 'Jan', rendement: 5.2 },
  { mois: 'Fév', rendement: 6.1 },
  { mois: 'Mar', rendement: 7.3 },
  { mois: 'Avr', rendement: 7.8 },
  { mois: 'Mai', rendement: 8.2 },
  { mois: 'Juin', rendement: 8.5 },
];

const cultureData = [
  { name: 'Tomates', value: 35, color: '#ef4444' },
  { name: 'Salades', value: 25, color: '#10b981' },
  { name: 'Carottes', value: 20, color: '#f59e0b' },
  { name: 'Autres', value: 20, color: '#6b7280' },
];

const recentInvestments = [
  { id: '1', parcelle: 'Parcelle A', culture: 'Tomates', montant: 5000, date: '2024-01-15', status: 'ACCEPTE' },
  { id: '2', parcelle: 'Parcelle B', culture: 'Salades', montant: 3000, date: '2024-01-12', status: 'EN_ATTENTE' },
  { id: '3', parcelle: 'Parcelle C', culture: 'Carottes', montant: 4000, date: '2024-01-10', status: 'ACCEPTE' },
];

export default function InvestisseurDashboard() {
  return (
    <DashboardLayout title="Tableau de bord Investisseur">
      <div className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Investment Evolution */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Évolution des investissements</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={investmentData}>
                <defs>
                  <linearGradient id="colorMontant" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="mois" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value: number) => `${value} €`}
                />
                <Area type="monotone" dataKey="montant" stroke="#10b981" fillOpacity={1} fill="url(#colorMontant)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Return Evolution */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Évolution du rendement (%)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={rendementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="mois" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value: number) => `${value}%`}
                />
                <Line type="monotone" dataKey="rendement" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Culture Distribution */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Répartition par culture</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={cultureData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {cultureData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Investments */}
          <div className="bg-white rounded-2xl p-6 shadow-sm lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Investissements récents</h3>
            <div className="space-y-4">
              {recentInvestments.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{inv.parcelle}</p>
                    <p className="text-sm text-gray-500">{inv.culture}</p>
                  </div>
                  <div className="text-right mr-6">
                    <p className="font-semibold text-gray-900">{inv.montant} €</p>
                    <p className="text-xs text-gray-500">{new Date(inv.date).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    inv.status === 'ACCEPTE' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {inv.status === 'ACCEPTE' ? 'Accepté' : 'En attente'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
