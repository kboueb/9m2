'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { PackType, ActiviteType, StatutParcelle } from '@prisma/client';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// Helper pour récupérer l'utilisateur depuis le token
async function getCurrentUser() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    throw new Error('Non authentifié');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; role: string };
    return decoded;
  } catch (error) {
    throw new Error('Token invalide');
  }
}

// Helper pour vérifier le rôle admin
async function requireAdmin() {
  const user = await getCurrentUser();
  if (user.role !== 'ADMIN') {
    throw new Error('Accès réservé aux administrateurs');
  }
  return user;
}

// ========================================
// CRUD PARCELLES (ADMIN)
// ========================================

export async function createParcelle(data: {
  region: string;
  localite: string;
  latitude: number;
  longitude: number;
  packType: PackType;
  activite: ActiviteType;
  prixMensuel: number;
  rendementEstime: number;
  cultureActuelle?: string;
  qualiteSol?: string;
  acceauEau?: boolean;
  exposition?: string;
  certificationBio?: boolean;
  co2Absorbe?: number;
  eauEconomisee?: number;
  biodiversite?: number;
  images?: string[];
  imagePrincipale?: string;
  agriculteurId?: string;
}) {
  const user = await requireAdmin();

  // Calculer le nombre de parcelles selon le pack
  const nombreParcelles = getPackSize(data.packType);
  const surface = nombreParcelles * 9;
  const prixTotal = data.prixMensuel * nombreParcelles;

  // Générer le code unique
  const code = await generateParcelleCode(data.region);

  const parcelle = await prisma.parcelle.create({
    data: {
      ...data,
      code,
      nombreParcelles,
      surface,
      prixTotal,
      createdBy: user.userId,
    },
    include: {
      agriculteur: {
        select: {
          id: true,
          nom: true,
          prenom: true,
          email: true,
        },
      },
    },
  });

  // Créer une entrée dans l'historique
  await prisma.historiqueParcelle.create({
    data: {
      parcelleId: parcelle.id,
      action: 'CREATION',
      description: `Parcelle ${code} créée`,
      effectuePar: user.userId,
    },
  });

  revalidatePath('/dashboard/admin/parcelles');
  return { success: true, parcelle };
}

export async function updateParcelle(id: string, data: Partial<{
  region: string;
  localite: string;
  latitude: number;
  longitude: number;
  packType: PackType;
  activite: ActiviteType;
  prixMensuel: number;
  rendementEstime: number;
  statut: StatutParcelle;
  cultureActuelle: string;
  qualiteSol: string;
  acceauEau: boolean;
  exposition: string;
  certificationBio: boolean;
  co2Absorbe: number;
  eauEconomisee: number;
  biodiversite: number;
  images: string[];
  imagePrincipale: string;
  agriculteurId: string;
}>) {
  const user = await requireAdmin();

  // Vérifier que la parcelle existe
  const existingParcelle = await prisma.parcelle.findUnique({
    where: { id },
  });

  if (!existingParcelle) {
    throw new Error('Parcelle introuvable');
  }

  // Recalculer si le pack change
  let updateData: any = { ...data };

  if (data.packType) {
    const nombreParcelles = getPackSize(data.packType);
    updateData.nombreParcelles = nombreParcelles;
    updateData.surface = nombreParcelles * 9;
    if (data.prixMensuel) {
      updateData.prixTotal = data.prixMensuel * nombreParcelles;
    }
  }

  const parcelle = await prisma.parcelle.update({
    where: { id },
    data: updateData,
    include: {
      agriculteur: true,
    },
  });

  await prisma.historiqueParcelle.create({
    data: {
      parcelleId: id,
      action: 'MODIFICATION',
      description: 'Parcelle modifiée',
      effectuePar: user.userId,
    },
  });

  revalidatePath('/dashboard/admin/parcelles');
  revalidatePath(`/dashboard/investisseur/parcelles/${id}`);
  return { success: true, parcelle };
}

export async function deleteParcelle(id: string) {
  const user = await requireAdmin();

  // Vérifier qu'aucune location active
  const locationActive = await prisma.locationParcelle.findFirst({
    where: { parcelleId: id, statut: 'ACTIVE' },
  });

  if (locationActive) {
    throw new Error('Impossible de supprimer une parcelle avec une location active');
  }

  await prisma.parcelle.delete({ where: { id } });

  revalidatePath('/dashboard/admin/parcelles');
  return { success: true, message: 'Parcelle supprimée avec succès' };
}

export async function getAllParcelles(filters?: {
  statut?: StatutParcelle;
  activite?: ActiviteType;
  region?: string;
  packType?: PackType;
  disponible?: boolean;
}) {
  const where: any = {};

  if (filters?.statut) where.statut = filters.statut;
  if (filters?.activite) where.activite = filters.activite;
  if (filters?.region) where.region = { contains: filters.region, mode: 'insensitive' };
  if (filters?.packType) where.packType = filters.packType;
  if (filters?.disponible === true) where.statut = StatutParcelle.DISPONIBLE;

  const [parcelles, total] = await Promise.all([
    prisma.parcelle.findMany({
      where,
      include: {
        agriculteur: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
          },
        },
        locations: {
          where: { statut: 'ACTIVE' },
          include: {
            investisseur: {
              select: {
                id: true,
                nom: true,
                prenom: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.parcelle.count({ where }),
  ]);

  return { parcelles, total };
}

export async function getParcelleById(id: string) {
  const parcelle = await prisma.parcelle.findUnique({
    where: { id },
    include: {
      agriculteur: {
        select: {
          id: true,
          nom: true,
          prenom: true,
          email: true,
          telephone: true,
        },
      },
      locations: {
        include: {
          investisseur: {
            select: {
              id: true,
              nom: true,
              prenom: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      taches: {
        include: {
          assigneA: {
            select: {
              id: true,
              nom: true,
              prenom: true,
            },
          },
        },
        orderBy: { dateDebut: 'desc' },
      },
      historique: {
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
    },
  });

  if (!parcelle) {
    throw new Error('Parcelle introuvable');
  }

  return parcelle;
}

// ========================================
// LOCATIONS
// ========================================

export async function createLocation(data: {
  parcelleId: string;
  packType: PackType;
  activite: ActiviteType;
  dateDebut: string;
  duree: number;
}) {
  const user = await getCurrentUser();

  const parcelle = await prisma.parcelle.findUnique({
    where: { id: data.parcelleId },
  });

  if (!parcelle) {
    throw new Error('Parcelle introuvable');
  }

  if (parcelle.statut !== StatutParcelle.DISPONIBLE) {
    throw new Error('Cette parcelle n\'est pas disponible à la location');
  }

  const dateDebut = new Date(data.dateDebut);
  const dateFin = new Date(dateDebut);
  dateFin.setMonth(dateFin.getMonth() + data.duree);

  const nombreParcelles = getPackSize(data.packType);
  const montantMensuel = parcelle.prixMensuel * nombreParcelles;
  const montantTotal = montantMensuel * data.duree;

  const location = await prisma.locationParcelle.create({
    data: {
      parcelleId: data.parcelleId,
      investisseurId: user.userId,
      packType: data.packType,
      activite: data.activite,
      dateDebut,
      dateFin,
      duree: data.duree,
      montantTotal,
      montantMensuel,
      rendementEstime: parcelle.rendementEstime,
      statut: 'ACTIVE',
    },
    include: {
      parcelle: true,
      investisseur: {
        select: {
          id: true,
          nom: true,
          prenom: true,
          email: true,
        },
      },
    },
  });

  // Mettre à jour le statut de la parcelle
  await prisma.parcelle.update({
    where: { id: data.parcelleId },
    data: { statut: StatutParcelle.LOUEE },
  });

  // Historique
  await prisma.historiqueParcelle.create({
    data: {
      parcelleId: data.parcelleId,
      action: 'LOCATION',
      description: `Parcelle louée à ${location.investisseur.prenom} ${location.investisseur.nom} pour ${data.duree} mois`,
      effectuePar: user.userId,
    },
  });

  revalidatePath('/dashboard/investisseur/parcelles');
  revalidatePath(`/dashboard/investisseur/parcelles/${data.parcelleId}`);
  
  return { success: true, location };
}

export async function getMyLocations() {
  const user = await getCurrentUser();

  const locations = await prisma.locationParcelle.findMany({
    where: { investisseurId: user.userId },
    include: {
      parcelle: {
        include: {
          agriculteur: {
            select: {
              id: true,
              nom: true,
              prenom: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return locations;
}

// ========================================
// STATISTIQUES
// ========================================

export async function getParcellesStats() {
  await requireAdmin();

  const [
    total,
    disponibles,
    louees,
    enProduction,
    parRegion,
    parActivite,
  ] = await Promise.all([
    prisma.parcelle.count(),
    prisma.parcelle.count({ where: { statut: StatutParcelle.DISPONIBLE } }),
    prisma.parcelle.count({ where: { statut: StatutParcelle.LOUEE } }),
    prisma.parcelle.count({ where: { statut: StatutParcelle.EN_PRODUCTION } }),
    prisma.parcelle.groupBy({
      by: ['region'],
      _count: true,
    }),
    prisma.parcelle.groupBy({
      by: ['activite'],
      _count: true,
    }),
  ]);

  return {
    total,
    disponibles,
    louees,
    enProduction,
    tauxOccupation: total > 0 ? ((louees + enProduction) / total) * 100 : 0,
    parRegion,
    parActivite,
  };
}

// ========================================
// HELPERS
// ========================================

function getPackSize(packType: PackType): number {
  const sizes = {
    PACK_1: 1,
    PACK_4: 4,
    PACK_9: 9,
  };
  return sizes[packType];
}

async function generateParcelleCode(region: string): Promise<string> {
  const year = new Date().getFullYear();
  const regionCode = region.substring(0, 3).toUpperCase();
  
  const count = await prisma.parcelle.count({
    where: {
      code: {
        startsWith: `PAR-${regionCode}-${year}`,
      },
    },
  });

  const numero = (count + 1).toString().padStart(4, '0');
  return `PAR-${regionCode}-${year}-${numero}`;
}
