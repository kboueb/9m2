import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'votre-secret-jwt-a-changer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('🔍 Tentative de connexion pour:', email);

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // Rechercher l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        nom: true,
        prenom: true,
        role: true,
        telephone: true,
      },
    });

    if (!user) {
      console.log('❌ Utilisateur non trouvé');
      return NextResponse.json(
        { error: 'Identifiants invalides' },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log('❌ Mot de passe incorrect');
      return NextResponse.json(
        { error: 'Identifiants invalides' },
        { status: 401 }
      );
    }

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

    // Retirer le password avant de renvoyer
    const { password: _, ...userWithoutPassword } = user;

    console.log('✅ Connexion réussie pour:', email);

    return NextResponse.json({
      message: 'Connexion réussie',
      user: userWithoutPassword,
      token,
    });

  } catch (error: any) {
    console.error('❌ Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la connexion' },
      { status: 500 }
    );
  }
}
