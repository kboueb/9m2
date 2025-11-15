'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LocationModal } from '@/components/parcelles/LocationModal';
import { Parcelle, ACTIVITES, LocationRequest } from '@/types/parcelle';
import { 
  MapPin, 
  Calendar, 
  TrendingUp, 
  User, 
  Thermometer,
  Droplet,
  Activity,
  ArrowLeft,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Image from 'next/image';

export default function ParcelleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const parcelleId = params.id as string;

  const [parcelle, setParcelle] = useState<Parcelle | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock data - À remplacer par API call
  useEffect(() => {
    const mockParcelle: Parcelle = {
      id: parcelleId,
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
        avatar: '',
      },
      images: [
        'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800',
        'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800',
        'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800',
      ],
      metriques: {
        temperatureMoy: 28,
        humiditeMoy: 65,
        phSol: 6.5,
      },
      progression: 0,
    };

    setParcelle(mockParcelle);
    setLoading(false);
  }, [parcelleId]);

  const handleLocationConfirm = async (request: LocationRequest) => {
    // TODO: API call pour créer la réservation
    console.log('Réservation:', request);
    
    // Simuler un délai
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Success handled in modal
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

  if (!parcelle) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="text-6xl mb-4">🌾</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Parcelle non trouvée</h2>
          <button
            onClick={() => router.back()}
            className="text-green-600 hover:text-green-700 font-semibold"
          >
            Retour à la liste
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const activite = parcelle.activite ? ACTIVITES[parcelle.activite] : null;
  const images = parcelle.images || [];

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Retour</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isFavorite
                  ? 'bg-red-100 text-red-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button className="w-10 h-10 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {images.length > 0 ? (
                <div className="relative">
                  <div className="relative h-96">
                    <Image
                      src={images[currentImageIndex]}
                      alt={`${parcelle.code} - Image ${currentImageIndex + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}

                  {/* Thumbnails */}
                  {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentImageIndex
                              ? 'bg-white w-8'
                              : 'bg-white/50 hover:bg-white/75'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      ✨ Disponible
                    </span>
                  </div>
                </div>
              ) : (
                <div className="h-96 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <span className="text-8xl">{activite?.icon || '🌱'}</span>
                </div>
              )}
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-xs text-gray-600 mb-1">Localisation</p>
                <p className="font-semibold text-gray-900">{parcelle.location.ville}</p>
                <p className="text-xs text-gray-500">{parcelle.location.region}</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                  <Activity className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-xs text-gray-600 mb-1">Surface</p>
                <p className="text-2xl font-bold text-gray-900">{parcelle.surface}m²</p>
              </div>

              {activite && (
                <>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-xs text-gray-600 mb-1">Rendement</p>
                    <p className="text-2xl font-bold text-purple-600">+{activite.rendementEstime}%</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                      <Calendar className="w-5 h-5 text-orange-600" />
                    </div>
                    <p className="text-xs text-gray-600 mb-1">Durée min</p>
                    <p className="text-2xl font-bold text-gray-900">{activite.dureeMin}m</p>
                  </div>
                </>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-3xl mr-3">{activite?.icon}</span>
                {activite?.name}
              </h2>
              <p className="text-gray-600 mb-6">
                {activite?.description}
              </p>

              {/* Avantages */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Rendement Élevé</h4>
                    <p className="text-sm text-gray-600">
                      Jusqu'à {activite?.rendementEstime}% de rendement annuel
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Suivi Expert</h4>
                    <p className="text-sm text-gray-600">
                      Agriculteur professionnel dédié
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Durée Flexible</h4>
                    <p className="text-sm text-gray-600">
                      À partir de {activite?.dureeMin} mois
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Activity className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Bio & Durable</h4>
                    <p className="text-sm text-gray-600">
                      Pratiques agricoles respectueuses
                    </p>
                  </div>
                </div>
              </div>

              {/* Métriques Environnementales */}
              {parcelle.metriques && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-bold text-gray-900 mb-4">Conditions Environnementales</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Thermometer className="w-5 h-5 text-orange-600" />
                        <span className="text-sm text-gray-600">Température</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {parcelle.metriques.temperatureMoy}°C
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Moyenne</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Droplet className="w-5 h-5 text-blue-600" />
                        <span className="text-sm text-gray-600">Humidité</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {parcelle.metriques.humiditeMoy}%
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Moyenne</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Activity className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-gray-600">pH du Sol</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {parcelle.metriques.phSol}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Optimal</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Agriculteur */}
            {parcelle.agriculteur && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Votre Agriculteur</h3>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {parcelle.agriculteur.firstName[0]}{parcelle.agriculteur.lastName[0]}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg">
                      {parcelle.agriculteur.firstName} {parcelle.agriculteur.lastName}
                    </h4>
                    <p className="text-sm text-gray-600">Agriculteur Professionnel</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs text-gray-500 flex items-center">
                        ⭐ 4.9/5
                      </span>
                      <span className="text-xs text-gray-500">
                        • 12 projets réussis
                      </span>
                    </div>
                  </div>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold">
                    Contacter
                  </button>
                </div>
              </div>
            )}

            {/* Map Preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-64 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-green-600 mx-auto mb-2" />
                  <p className="text-gray-700 font-semibold">
                    {parcelle.location.ville}, {parcelle.location.region}
                  </p>
                  <p className="text-sm text-gray-600">
                    Lat: {parcelle.location.coordonnees.lat}, Lng: {parcelle.location.coordonnees.lng}
                  </p>
                  <button className="mt-3 text-green-600 hover:text-green-700 text-sm font-semibold">
                    Voir sur la carte →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-8">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">À partir de</span>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                    −20% PACK 9
                  </span>
                </div>
                <div className="flex items-end space-x-2">
                  <span className="text-4xl font-bold text-gray-900">50€</span>
                  <span className="text-gray-600 mb-1">/mois</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Parcelle de 9m² • Code {parcelle.code}
                </p>
              </div>

              <button
                onClick={() => setShowLocationModal(true)}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl mb-4"
              >
                🌱 Louer cette parcelle
              </button>

              <p className="text-xs text-center text-gray-500 mb-6">
                Aucun frais caché • Garantie satisfait ou remboursé
              </p>

              <div className="border-t border-gray-200 pt-6 space-y-4">
                <h4 className="font-bold text-gray-900">Ce qui est inclus :</h4>
                <ul className="space-y-3">
                  {[
                    '✅ Suivi en temps réel',
                    '✅ Photos hebdomadaires',
                    '✅ Expertise agricole',
                    '✅ Récolte livrée',
                    '✅ Assurance récolte',
                    '✅ Support 7j/7',
                  ].map((item, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-center">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-gray-200 mt-6 pt-6">
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Activity className="w-4 h-4 mr-1" />
                    Bio certifié
                  </span>
                  <span>•</span>
                  <span className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    ROI garanti
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location Modal */}
      <LocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        parcelleId={parcelle.id}
        parcelleCode={parcelle.code}
        onConfirm={handleLocationConfirm}
      />
    </DashboardLayout>
  );
}
