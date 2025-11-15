'use client';

import { useState } from 'react';
import { PACKS, Pack, PackType } from '@/types/parcelle';
import { Check, TrendingUp } from 'lucide-react';

interface PackSelectorProps {
  selectedPack: PackType | null;
  onSelectPack: (pack: PackType) => void;
}

export function PackSelector({ selectedPack, onSelectPack }: PackSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {(Object.keys(PACKS) as PackType[]).map((packType) => {
        const pack = PACKS[packType];
        const isSelected = selectedPack === packType;
        const isPopular = pack.popular;

        return (
          <div
            key={packType}
            onClick={() => onSelectPack(packType)}
            className={`relative cursor-pointer rounded-2xl border-2 transition-all ${
              isSelected
                ? 'border-green-500 shadow-xl scale-105'
                : 'border-gray-200 hover:border-green-300 hover:shadow-lg'
            } ${isPopular ? 'ring-4 ring-green-100' : ''}`}
          >
            {/* Badge Popular */}
            {isPopular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg flex items-center space-x-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>POPULAIRE</span>
                </span>
              </div>
            )}

            {/* Checkmark */}
            {isSelected && (
              <div className="absolute top-4 right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <Check className="w-5 h-5 text-white" />
              </div>
            )}

            <div className="p-6">
              {/* Icon */}
              <div className="text-5xl mb-4 text-center">{pack.icon}</div>

              {/* Name */}
              <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
                {pack.name}
              </h3>

              {/* Price */}
              <div className="text-center mb-6">
                <div className="flex items-end justify-center space-x-1">
                  <span className="text-4xl font-bold text-gray-900">
                    {pack.price}€
                  </span>
                  <span className="text-gray-600 text-sm mb-1">/mois</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {pack.pricePerMonth}€ par parcelle
                </p>
              </div>

              {/* Surface Info */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600 mb-1">
                    {pack.parcellesCount}
                  </p>
                  <p className="text-sm text-gray-600">
                    {pack.parcellesCount === 1 ? 'parcelle' : 'parcelles'} de 9m²
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Total: {pack.surface}m²
                  </p>
                </div>
              </div>

              {/* Benefits */}
              <ul className="space-y-3">
                {pack.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>

              {/* Économies */}
              {packType !== 'PACK_1' && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-2 text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-semibold">
                      Économie de{' '}
                      {packType === 'PACK_4' ? '10%' : '20%'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
