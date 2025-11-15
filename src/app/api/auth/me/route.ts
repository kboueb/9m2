import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'votre-secret-jwt-a-changer';

export async function GET(request: NextRequest) {
  try {
    // Récupérer le token depuis le header Authorization
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token manquant ou invalide' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Enlever "Bearer "

    // Vérifier le token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
      role: string;
    };

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        role: true,
        telephone: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });

  } catch (error: any) {
    console.error('❌ Erreur token:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      );
    }
    
    if (error.name === 'TokenExpiredError') {
      return NextResponse.json(
        { error: 'Token expiré' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur d\'authentification' },
      { status: 500 }
    );
  }
}
