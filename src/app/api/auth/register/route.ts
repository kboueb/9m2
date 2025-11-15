import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'votre-secret-jwt-a-changer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, nom, prenom, telephone, role } = body;

    console.log('🔍 Tentative d\'inscription pour:', email);

    // Validation
    if (!email || !password || !nom || !prenom) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('❌ Email déjà utilisé');
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 409 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nom,
        prenom,
        telephone,
        role: role || 'INVESTISSEUR',
      },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        role: true,
        telephone: true,
      },
    });

    // Générer le token JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Inscription réussie pour:', email);

    return NextResponse.json({
      message: 'Inscription réussie',
      user,
      token,
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'inscription' },
      { status: 500 }
    );
  }
}
