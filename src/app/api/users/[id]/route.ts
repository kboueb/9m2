import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { hash } from 'bcryptjs';
import { z } from 'zod';

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: z.string().optional(),
  role: z.enum(['ADMIN', 'INVESTISSEUR', 'PAYSAN']).optional(),
  isActive: z.boolean().optional(),
  password: z.string().min(6).optional(),
});

// GET - Récupérer un utilisateur
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Un user peut voir son propre profil, un ADMIN peut voir tous les profils
    if (authResult.user.id !== params.id && authResult.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Accès refusé' },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// PUT - Modifier un utilisateur
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Un user peut modifier son propre profil, un ADMIN peut modifier tous les profils
    if (authResult.user.id !== params.id && authResult.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Accès refusé' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = updateUserSchema.parse(body);

    // Si modification du mot de passe
    const updateData: any = { ...validatedData };
    if (validatedData.password) {
      updateData.password = await hash(validatedData.password, 10);
    }

    // Seul un ADMIN peut modifier le role et isActive
    if (authResult.user.role !== 'ADMIN') {
      delete updateData.role;
      delete updateData.isActive;
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: 'Utilisateur modifié',
      user,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Données invalides', errors: error.errors },
        { status: 400 }
      );
    }

    console.error('Update user error:', error);
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un utilisateur (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Seul un ADMIN peut supprimer
    if (authResult.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Accès refusé' },
        { status: 403 }
      );
    }

    // Soft delete (désactiver le compte)
    await prisma.user.update({
      where: { id: params.id },
      data: { isActive: false },
    });

    return NextResponse.json({
      message: 'Utilisateur désactivé',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
