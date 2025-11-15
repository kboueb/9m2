/*
  Warnings:

  - You are about to drop the `Producer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Production` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'INVESTISSEUR', 'PAYSAN');

-- DropForeignKey
ALTER TABLE "Production" DROP CONSTRAINT "Production_producerId_fkey";

-- DropTable
DROP TABLE "Producer";

-- DropTable
DROP TABLE "Production";

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "PaymentStatus";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'INVESTISSEUR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
