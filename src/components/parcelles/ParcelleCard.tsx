'use client';

import { Parcelle, ACTIVITES } from '@/types/parcelle';
import { MapPin, Calendar, TrendingUp, User } from 'lucide-react';
import Image from 'next/image';

interface ParcelleCardProps {
  parcelle: Parcelle;
  onClick?: () => void;
  showActions?: boolean;
}

export function ParcelleCard({ parcelle, onClick, showActions = true }: ParcelleCardProps) {
  const getStatusColor = (status: string) => {
    const colors = {
      DISPONIBLE: 'bg-green-100 text-green-700',
      RESERVE: 'bg-yellow-100 text-yellow-700',
      LOUE: 'bg-blue-100 text-blue-700',
      EN_PREPARATION: 'bg-orange-100 text-orange-700',
      EN_CULTURE: 'bg-purple-100 text-purple-700',
      RECOLTE: 'bg-pink-100 text-pink-700',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      DISPONIBLE: 'Disponible',
      RESERVE: 'Réservée',
      LOUE: 'Louée',
      EN_PREPARATION: 'En préparation',
      EN_CULTURE: 'En culture',
      RECOLTE: 'Récolte',
    };
    return labels[status as keyof typeof labels] || status;
  };

  const activite = parcelle.activite ? ACTIVITES[parcelle.activite] : null;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 overflow-hidden cursor-pointer group"
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-green-400 to-green-600">
        {parcelle.images && parcelle.images[0] ? (
          <Image
            src={parcelle.images[0]}
            alt={parcelle.code}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl">{activite?.icon || '🌱'}</span>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(parcelle.status)}`}>
            {getStatusLabel(parcelle.status)}
          </span>
        </div>

        {/* Code */}
        <div className="absolute bottom-4 left-4">
          <span className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-mono font-semibold">
            {parcelle.code}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Location */}
        <div className="flex items-center space-x-2 text-gray-600 mb-3">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">
            {parcelle.location.ville}, {parcelle.location.region}
          </span>
        </div>

        {/* Activité */}
        {activite && (
          <div className="mb-4">
            <h3 className="font-bold text-gray-900 mb-1 flex items-center space-x-2">
              <span className="text-2xl">{activite.icon}</span>
              <span>{activite.name}</span>
            </h3>
            <p className="text-sm text-gray-600">{activite.description}</p>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Surface</p>
            <p className="text-lg font-bold text-gray-900">{parcelle.surface}m²</p>
          </div>
          
          {activite && (
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">Rendement</p>
              <p className="text-lg font-bold text-green-600">+{activite.rendementEstime}%</p>
            </div>
          )}
        </div>

        {/* Progression */}
        {parcelle.progression !== undefined && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Progression</span>
              <span className="font-semibold text-gray-900">{parcelle.progression}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all"
                style={{ width: `${parcelle.progression}%` }}
              />
            </div>
          </div>
        )}

        {/* Agriculteur */}
        {parcelle.agriculteur && (
          <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
              {parcelle.agriculteur.firstName[0]}{parcelle.agriculteur.lastName[0]}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {parcelle.agriculteur.firstName} {parcelle.agriculteur.lastName}
              </p>
              <p className="text-xs text-gray-600">Agriculteur</p>
            </div>
          </div>
        )}

        {/* Prochaine Récolte */}
        {parcelle.prochainRecolte && (
          <div className="flex items-center space-x-2 mt-4 text-orange-600 bg-orange-50 rounded-lg p-3">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-semibold">
              Récolte dans {parcelle.prochainRecolte}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && parcelle.status === 'DISPONIBLE' && (
        <div className="px-6 pb-6">
          <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all group-hover:shadow-lg">
            Louer cette parcelle
          </button>
        </div>
      )}
    </div>
  );
}
