/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('INVESTISSEUR', 'AGRICULTEUR', 'ADMIN');

-- CreateEnum
CREATE TYPE "PackType" AS ENUM ('PACK_1', 'PACK_4', 'PACK_9');

-- CreateEnum
CREATE TYPE "ActiviteType" AS ENUM ('MARAICHAGE', 'PISCICULTURE', 'AVICULTURE', 'BANANIER', 'ARBORICULTURE', 'ELEVAGE');

-- CreateEnum
CREATE TYPE "StatutParcelle" AS ENUM ('DISPONIBLE', 'LOUEE', 'EN_PRODUCTION', 'RECOLTE_EN_COURS', 'MAINTENANCE', 'INACTIVE');

-- DropTable
DROP TABLE "users";

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "telephone" TEXT,
    "role" "Role" NOT NULL DEFAULT 'INVESTISSEUR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parcelle" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "localite" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "surface" DOUBLE PRECISION NOT NULL DEFAULT 9,
    "packType" "PackType" NOT NULL DEFAULT 'PACK_1',
    "nombreParcelles" INTEGER NOT NULL DEFAULT 1,
    "activite" "ActiviteType" NOT NULL DEFAULT 'MARAICHAGE',
    "cultureActuelle" TEXT,
    "statut" "StatutParcelle" NOT NULL DEFAULT 'DISPONIBLE',
    "prixMensuel" DOUBLE PRECISION NOT NULL,
    "prixTotal" DOUBLE PRECISION NOT NULL,
    "rendementEstime" DOUBLE PRECISION NOT NULL,
    "qualiteSol" TEXT,
    "acceauEau" BOOLEAN NOT NULL DEFAULT true,
    "exposition" TEXT,
    "certificationBio" BOOLEAN NOT NULL DEFAULT false,
    "co2Absorbe" DOUBLE PRECISION,
    "eauEconomisee" DOUBLE PRECISION,
    "biodiversite" INTEGER,
    "images" TEXT[],
    "imagePrincipale" TEXT,
    "agriculteurId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,

    CONSTRAINT "Parcelle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocationParcelle" (
    "id" TEXT NOT NULL,
    "parcelleId" TEXT NOT NULL,
    "investisseurId" TEXT NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3) NOT NULL,
    "duree" INTEGER NOT NULL,
    "packType" "PackType" NOT NULL,
    "activite" "ActiviteType" NOT NULL,
    "montantTotal" DOUBLE PRECISION NOT NULL,
    "montantMensuel" DOUBLE PRECISION NOT NULL,
    "montantPaye" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "statut" TEXT NOT NULL DEFAULT 'ACTIVE',
    "rendementEstime" DOUBLE PRECISION NOT NULL,
    "rendementReel" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LocationParcelle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoriqueParcelle" (
    "id" TEXT NOT NULL,
    "parcelleId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "effectuePar" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HistoriqueParcelle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tache" (
    "id" TEXT NOT NULL,
    "parcelleId" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3),
    "statut" TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    "priorite" TEXT NOT NULL DEFAULT 'NORMALE',
    "assigneAId" TEXT NOT NULL,
    "photos" TEXT[],
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Parcelle_code_key" ON "Parcelle"("code");

-- CreateIndex
CREATE INDEX "Parcelle_statut_idx" ON "Parcelle"("statut");

-- CreateIndex
CREATE INDEX "Parcelle_activite_idx" ON "Parcelle"("activite");

-- CreateIndex
CREATE INDEX "Parcelle_region_idx" ON "Parcelle"("region");

-- CreateIndex
CREATE INDEX "Parcelle_agriculteurId_idx" ON "Parcelle"("agriculteurId");

-- CreateIndex
CREATE INDEX "LocationParcelle_investisseurId_idx" ON "LocationParcelle"("investisseurId");

-- CreateIndex
CREATE INDEX "LocationParcelle_parcelleId_idx" ON "LocationParcelle"("parcelleId");

-- CreateIndex
CREATE INDEX "LocationParcelle_statut_idx" ON "LocationParcelle"("statut");

-- CreateIndex
CREATE INDEX "HistoriqueParcelle_parcelleId_idx" ON "HistoriqueParcelle"("parcelleId");

-- CreateIndex
CREATE INDEX "HistoriqueParcelle_createdAt_idx" ON "HistoriqueParcelle"("createdAt");

-- CreateIndex
CREATE INDEX "Tache_parcelleId_idx" ON "Tache"("parcelleId");

-- CreateIndex
CREATE INDEX "Tache_assigneAId_idx" ON "Tache"("assigneAId");

-- CreateIndex
CREATE INDEX "Tache_statut_idx" ON "Tache"("statut");

-- AddForeignKey
ALTER TABLE "Parcelle" ADD CONSTRAINT "Parcelle_agriculteurId_fkey" FOREIGN KEY ("agriculteurId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationParcelle" ADD CONSTRAINT "LocationParcelle_parcelleId_fkey" FOREIGN KEY ("parcelleId") REFERENCES "Parcelle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationParcelle" ADD CONSTRAINT "LocationParcelle_investisseurId_fkey" FOREIGN KEY ("investisseurId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoriqueParcelle" ADD CONSTRAINT "HistoriqueParcelle_parcelleId_fkey" FOREIGN KEY ("parcelleId") REFERENCES "Parcelle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tache" ADD CONSTRAINT "Tache_parcelleId_fkey" FOREIGN KEY ("parcelleId") REFERENCES "Parcelle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tache" ADD CONSTRAINT "Tache_assigneAId_fkey" FOREIGN KEY ("assigneAId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
