'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PackSelector } from '@/components/parcelles/PackSelector';
import { ParcelleCard } from '@/components/parcelles/ParcelleCard';
import { useAuthStore } from '@/store/authStore';
import { Parcelle, PackType, ACTIVITES, ActiviteType } from '@/types/parcelle';
import { Search, Filter, MapPin, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ParcellesPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [selectedPack, setSelectedPack] = useState<PackType | null>(null);
  const [selectedActivite, setSelectedActivite] = useState<ActiviteType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [parcelles, setParcelles] = useState<Parcelle[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data - À remplacer par API call
  useEffect(() => {
    const mockParcelles: Parcelle[] = [
      {
        id: '1',
        code: 'SN-DAK-001',
        surface: 9,
        status: 'DISPONIBLE',
        location: {
          region: 'Dakar',
          ville: 'Rufisque',
          coordonnees: { lat: 14.7167, lng: -17.2667 },
        },
        activite: 'MARAICHAGE',
        agriculteur: {
          id: 'agri1',
          firstName: 'Mamadou',
          lastName: 'Diop',
        },
        images: [],
      },
      {
        id: '2',
        code: 'SN-DAK-002',
        surface: 9,
        status: 'DISPONIBLE',
        location: {
          region: 'Dakar',
          ville: 'Rufisque',
          coordonnees: { lat: 14.7167, lng: -17.2667 },
        },
        activite: 'PISCICULTURE',
        agriculteur: {
          id: 'agri2',
          firstName: 'Fatou',
          lastName: 'Sall',
        },
        images: [],
      },
      {
        id: '3',
        code: 'SN-THI-001',
        surface: 9,
        status: 'DISPONIBLE',
        location: {
          region: 'Thiès',
          ville: 'Thiès',
          coordonnees: { lat: 14.7886, lng: -16.9260 },
        },
        activite: 'PLANTATION_BANANIERS',
        agriculteur: {
          id: 'agri3',
          firstName: 'Ibrahima',
          lastName: 'Ndiaye',
        },
        images: [],
      },
      {
        id: '4',
        code: 'SN-DAK-003',
        surface: 9,
        status: 'DISPONIBLE',
        location: {
          region: 'Dakar',
          ville: 'Rufisque',
          coordonnees: { lat: 14.7167, lng: -17.2667 },
        },
        activite: 'MARAICHAGE',
        agriculteur: {
          id: 'agri1',
          firstName: 'Mamadou',
          lastName: 'Diop',
        },
        images: [],
      },
      {
        id: '5',
        code: 'SN-SL-001',
        surface: 9,
        status: 'DISPONIBLE',
        location: {
          region: 'Saint-Louis',
          ville: 'Richard Toll',
          coordonnees: { lat: 16.4667, lng: -15.7000 },
        },
        activite: 'PLANTATION_MANIOC',
        agriculteur: {
          id: 'agri4',
          firstName: 'Aminata',
          lastName: 'Ba',
        },
        images: [],
      },
      {
        id: '6',
        code: 'SN-DAK-004',
        surface: 9,
        status: 'DISPONIBLE',
        location: {
          region: 'Dakar',
          ville: 'Rufisque',
          coordonnees: { lat: 14.7167, lng: -17.2667 },
        },
        activite: 'ELEVAGE_POULETS',
        agriculteur: {
          id: 'agri5',
          firstName: 'Moussa',
          lastName: 'Kane',
        },
        images: [],
      },
      {
        id: '7',
        code: 'SN-THI-002',
        surface: 9,
        status: 'DISPONIBLE',
        location: {
          region: 'Thiès',
          ville: 'Thiès',
          coordonnees: { lat: 14.7886, lng: -16.9260 },
        },
        activite: 'APICULTURE',
        agriculteur: {
          id: 'agri6',
          firstName: 'Khadija',
          lastName: 'Sy',
        },
        images: [],
      },
      {
        id: '8',
        code: 'SN-DAK-005',
        surface: 9,
        status: 'DISPONIBLE',
        location: {
          region: 'Dakar',
          ville: 'Rufisque',
          coordonnees: { lat: 14.7167, lng: -17.2667 },
        },
        activite: 'MARAICHAGE',
        agriculteur: {
          id: 'agri1',
          firstName: 'Mamadou',
          lastName: 'Diop',
        },
        images: [],
      },
      {
        id: '9',
        code: 'SN-KL-001',
        surface: 9,
        status: 'DISPONIBLE',
        location: {
          region: 'Kaolack',
          ville: 'Kaolack',
          coordonnees: { lat: 14.1500, lng: -16.0667 },
        },
        activite: 'PISCICULTURE',
        agriculteur: {
          id: 'agri7',
          firstName: 'Ousmane',
          lastName: 'Fall',
        },
        images: [],
      },
    ];

    setParcelles(mockParcelles);
    setLoading(false);
  }, []);

  const filteredParcelles = parcelles.filter((parcelle) => {
    const matchesSearch = parcelle.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcelle.location.ville.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesActivite = !selectedActivite || parcelle.activite === selectedActivite;
    
    return matchesSearch && matchesActivite;
  });

  const handlePackSelect = (packType: PackType) => {
    setSelectedPack(selectedPack === packType ? null : packType);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Louer des Parcelles
          </h1>
          <p className="text-gray-600">
            Choisissez votre pack et investissez dans l'agriculture sénégalaise
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <MapPin className="w-8 h-8" />
              <span className="text-3xl">🇸🇳</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{filteredParcelles.length}</h3>
            <p className="text-green-100">Parcelles disponibles</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8" />
              <span className="text-3xl">📈</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">15-35%</h3>
            <p className="text-blue-100">Rendement annuel</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Filter className="w-8 h-8" />
              <span className="text-3xl">🌾</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">6</h3>
            <p className="text-purple-100">Types d'activités</p>
          </div>
        </div>

        {/* Pack Selector */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Choisissez votre Pack
          </h2>
          <PackSelector
            selectedPack={selectedPack}
            onSelectPack={handlePackSelect}
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par code ou ville..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Activité Filter */}
            <select
              value={selectedActivite || ''}
              onChange={(e) => setSelectedActivite(e.target.value as ActiviteType || null)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Toutes les activités</option>
              {Object.values(ACTIVITES).map((activite) => (
                <option key={activite.id} value={activite.id}>
                  {activite.icon} {activite.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Parcelles Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Parcelles Disponibles
            </h2>
            <p className="text-gray-600">
              {filteredParcelles.length} parcelle{filteredParcelles.length > 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredParcelles.map((parcelle) => (
              <ParcelleCard
                key={parcelle.id}
                parcelle={parcelle}
                onClick={() => router.push(`/dashboard/investisseur/parcelles/${parcelle.id}`)}
              />
            ))}
          </div>

          {filteredParcelles.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Aucune parcelle trouvée
              </h3>
              <p className="text-gray-600">
                Essayez de modifier vos filtres de recherche
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
