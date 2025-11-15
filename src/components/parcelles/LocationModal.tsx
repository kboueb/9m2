'use client';

import { useState } from 'react';
import { PACKS, ACTIVITES, PackType, ActiviteType, LocationRequest } from '@/types/parcelle';
import { X, Calendar, Clock, TrendingUp, Check, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  parcelleId: string;
  parcelleCode: string;
  onConfirm: (request: LocationRequest) => Promise<void>;
}

export function LocationModal({ 
  isOpen, 
  onClose, 
  parcelleId, 
  parcelleCode,
  onConfirm 
}: LocationModalProps) {
  const { user } = useAuthStore();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    packType: 'PACK_1' as PackType,
    activite: 'MARAICHAGE' as ActiviteType,
    duree: 12,
    dateDebut: new Date().toISOString().split('T')[0],
  });

  if (!isOpen) return null;

  const selectedPack = PACKS[formData.packType];
  const selectedActivite = ACTIVITES[formData.activite];
  const totalCost = selectedPack.price * formData.duree;
  const rendementEstime = (totalCost * selectedActivite.rendementEstime) / 100;

  const handleSubmit = async () => {
    if (!user?.id) {
      setError('Vous devez être connecté pour effectuer une réservation');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const request: LocationRequest = {
        ...formData,
        investisseurId: user.id,
      };

      await onConfirm(request);
      
      // Success!
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Réserver des Parcelles</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Pack & Activité' },
              { num: 2, label: 'Durée & Date' },
              { num: 3, label: 'Confirmation' },
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step >= s.num 
                      ? 'bg-white text-green-600' 
                      : 'bg-white/30 text-white'
                  }`}>
                    {step > s.num ? <Check className="w-5 h-5" /> : s.num}
                  </div>
                  <span className="text-xs mt-2 text-white/90">{s.label}</span>
                </div>
                {idx < 2 && (
                  <div className={`flex-1 h-1 mx-2 rounded transition-all ${
                    step > s.num ? 'bg-white' : 'bg-white/30'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Step 1: Pack & Activité */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Pack Selection */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Choisissez votre Pack
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(Object.keys(PACKS) as PackType[]).map((packType) => {
                    const pack = PACKS[packType];
                    const isSelected = formData.packType === packType;

                    return (
                      <button
                        key={packType}
                        onClick={() => setFormData({ ...formData, packType })}
                        className={`relative border-2 rounded-xl p-4 text-left transition-all ${
                          isSelected
                            ? 'border-green-500 bg-green-50 shadow-lg'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                        
                        <div className="text-3xl mb-2">{pack.icon}</div>
                        <h4 className="font-bold text-gray-900 mb-1">{pack.name}</h4>
                        <p className="text-2xl font-bold text-green-600 mb-1">
                          {pack.price}€<span className="text-sm text-gray-600">/mois</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          {pack.parcellesCount} parcelle{pack.parcellesCount > 1 ? 's' : ''} • {pack.surface}m²
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Activité Selection */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Choisissez une Activité
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(Object.keys(ACTIVITES) as ActiviteType[]).map((activiteType) => {
                    const activite = ACTIVITES[activiteType];
                    const isSelected = formData.activite === activiteType;

                    return (
                      <button
                        key={activiteType}
                        onClick={() => setFormData({ ...formData, activite: activiteType })}
                        className={`relative border-2 rounded-xl p-4 text-left transition-all ${
                          isSelected
                            ? 'border-green-500 bg-green-50 shadow-lg'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                        
                        <div className="flex items-start space-x-3">
                          <div className="text-3xl">{activite.icon}</div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 mb-1">
                              {activite.name}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">
                              {activite.description}
                            </p>
                            <div className="flex items-center space-x-4 text-xs">
                              <span className="flex items-center text-green-600">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                +{activite.rendementEstime}%
                              </span>
                              <span className="flex items-center text-gray-600">
                                <Clock className="w-3 h-3 mr-1" />
                                {activite.dureeMin} mois min
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Durée & Date */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Durée */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Durée de location (mois)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[3, 6, 12, 24].map((duree) => (
                    <button
                      key={duree}
                      onClick={() => setFormData({ ...formData, duree })}
                      className={`border-2 rounded-xl p-4 text-center transition-all ${
                        formData.duree === duree
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <p className="text-2xl font-bold text-gray-900">{duree}</p>
                      <p className="text-xs text-gray-600">mois</p>
                    </button>
                  ))}
                </div>
                
                {/* Custom Duration */}
                <div className="mt-4">
                  <label className="block text-sm text-gray-600 mb-2">
                    Ou saisissez une durée personnalisée :
                  </label>
                  <input
                    type="number"
                    min={selectedActivite.dureeMin}
                    max={60}
                    value={formData.duree}
                    onChange={(e) => setFormData({ ...formData, duree: parseInt(e.target.value) || 12 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Durée en mois"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Durée minimale pour cette activité : {selectedActivite.dureeMin} mois
                  </p>
                </div>
              </div>

              {/* Date de début */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Date de début
                </label>
                <input
                  type="date"
                  value={formData.dateDebut}
                  onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Récapitulatif */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                  Estimation de votre investissement
                </h4>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pack sélectionné</span>
                    <span className="font-semibold">{selectedPack.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Prix mensuel</span>
                    <span className="font-semibold">{selectedPack.price}€</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Durée</span>
                    <span className="font-semibold">{formData.duree} mois</span>
                  </div>
                  
                  <div className="border-t border-green-200 pt-3 mt-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-gray-900">Coût total</span>
                      <span className="text-2xl font-bold text-gray-900">{totalCost}€</span>
                    </div>
                    <div className="flex justify-between items-center text-green-600">
                      <span className="font-semibold">Rendement estimé</span>
                      <span className="text-xl font-bold">+{rendementEstime.toFixed(0)}€</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      Soit un rendement de +{selectedActivite.rendementEstime}% sur {formData.duree} mois
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Réservation Confirmée ! 🎉
              </h3>
              
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Votre demande de location a été envoyée avec succès. 
                Vous recevrez une confirmation par email sous 24h.
              </p>

              <div className="bg-gray-50 rounded-xl p-6 max-w-md mx-auto mb-6">
                <div className="space-y-3 text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Parcelle</span>
                    <span className="font-semibold">{parcelleCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pack</span>
                    <span className="font-semibold">{selectedPack.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Activité</span>
                    <span className="font-semibold">{selectedActivite.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Durée</span>
                    <span className="font-semibold">{formData.duree} mois</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="text-xl font-bold text-green-600">{totalCost}€</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all"
              >
                Retour au Dashboard
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {step < 3 && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex items-center justify-between">
              <button
                onClick={() => step === 1 ? onClose() : setStep((step - 1) as 1 | 2)}
                className="px-6 py-3 text-gray-700 hover:text-gray-900 font-semibold transition-colors"
              >
                {step === 1 ? 'Annuler' : 'Retour'}
              </button>

              <button
                onClick={() => step === 2 ? handleSubmit() : setStep((step + 1) as 2 | 3)}
                disabled={loading}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    <span>Traitement...</span>
                  </>
                ) : (
                  <span>{step === 2 ? 'Confirmer la réservation' : 'Continuer'}</span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
