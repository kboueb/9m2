export type PackType = 'PACK_1' | 'PACK_4' | 'PACK_9';

export interface Pack {
  type: PackType;
  name: string;
  parcellesCount: 1 | 4 | 9;
  surface: number; // m²
  price: number;
  pricePerMonth: number;
  benefits: string[];
  icon: string;
  popular?: boolean;
}

export const PACKS: Record<PackType, Pack> = {
  PACK_1: {
    type: 'PACK_1',
    name: 'Pack Découverte',
    parcellesCount: 1,
    surface: 9,
    price: 50,
    pricePerMonth: 50,
    benefits: [
      '1 parcelle de 9m²',
      'Suivi mensuel',
      'Photos de croissance',
      'Récolte livrée',
    ],
    icon: '🌱',
  },
  PACK_4: {
    type: 'PACK_4',
    name: 'Pack Famille',
    parcellesCount: 4,
    surface: 36,
    price: 180,
    pricePerMonth: 45,
    benefits: [
      '4 parcelles de 9m²',
      'Économie de 10%',
      'Suivi hebdomadaire',
      'Photos HD',
      'Récolte livrée',
      'Visite sur site',
    ],
    icon: '🌾',
    popular: true,
  },
  PACK_9: {
    type: 'PACK_9',
    name: 'Pack Investisseur',
    parcellesCount: 9,
    surface: 81,
    price: 360,
    pricePerMonth: 40,
    benefits: [
      '9 parcelles de 9m²',
      'Économie de 20%',
      'Suivi quotidien',
      'Photos & vidéos HD',
      'Récolte livrée',
      'Visite VIP',
      'Rapport mensuel détaillé',
      'Choix des cultures',
    ],
    icon: '🏆',
  },
};

export type ParcelleStatus = 
  | 'DISPONIBLE'
  | 'RESERVE'
  | 'LOUE'
  | 'EN_PREPARATION'
  | 'EN_CULTURE'
  | 'RECOLTE';

export type ActiviteType = 
  | 'MARAICHAGE'
  | 'PISCICULTURE'
  | 'PLANTATION_BANANIERS'
  | 'PLANTATION_MANIOC'
  | 'ELEVAGE_POULETS'
  | 'APICULTURE';

export interface Activite {
  id: string;
  name: string;
  description: string;
  icon: string;
  dureeMin: number; // mois
  rendementEstime: number; // pourcentage
  investissementMin: number;
}

export const ACTIVITES: Record<ActiviteType, Activite> = {
  MARAICHAGE: {
    id: 'MARAICHAGE',
    name: 'Maraîchage Bio',
    description: 'Culture de légumes biologiques',
    icon: '🥬',
    dureeMin: 3,
    rendementEstime: 15,
    investissementMin: 50,
  },
  PISCICULTURE: {
    id: 'PISCICULTURE',
    name: 'Pisciculture',
    description: 'Élevage de poissons (Tilapia)',
    icon: '🐟',
    dureeMin: 6,
    rendementEstime: 25,
    investissementMin: 200,
  },
  PLANTATION_BANANIERS: {
    id: 'PLANTATION_BANANIERS',
    name: 'Plantation de Bananiers',
    description: 'Culture de bananes plantain',
    icon: '🍌',
    dureeMin: 9,
    rendementEstime: 30,
    investissementMin: 150,
  },
  PLANTATION_MANIOC: {
    id: 'PLANTATION_MANIOC',
    name: 'Plantation de Manioc',
    description: 'Culture de manioc',
    icon: '🥔',
    dureeMin: 8,
    rendementEstime: 20,
    investissementMin: 80,
  },
  ELEVAGE_POULETS: {
    id: 'ELEVAGE_POULETS',
    name: 'Élevage de Poulets',
    description: 'Poulets de chair bio',
    icon: '🐔',
    dureeMin: 2,
    rendementEstime: 18,
    investissementMin: 100,
  },
  APICULTURE: {
    id: 'APICULTURE',
    name: 'Apiculture',
    description: 'Production de miel',
    icon: '🍯',
    dureeMin: 12,
    rendementEstime: 35,
    investissementMin: 300,
  },
};

export interface Parcelle {
  id: string;
  code: string; // Ex: SN-DAK-001
  surface: 9; // Toujours 9m²
  status: ParcelleStatus;
  location: {
    region: string;
    ville: string;
    coordonnees: {
      lat: number;
      lng: number;
    };
  };
  activite?: ActiviteType;
  agriculteur?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  investisseur?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  pack?: {
    type: PackType;
    parcelles: string[]; // IDs des parcelles du pack
  };
  dateDebut?: string;
  dateFin?: string;
  progression?: number; // 0-100
  prochainRecolte?: string;
  images?: string[];
  metriques?: {
    temperatureMoy: number;
    humiditeMoy: number;
    phSol: number;
  };
}

export interface LocationRequest {
  packType: PackType;
  activite: ActiviteType;
  duree: number; // mois
  dateDebut: string;
  investisseurId: string;
}
