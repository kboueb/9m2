import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // En JWT, le logout est géré côté client (supprimer le token)
    // On peut aussi implémenter une blacklist si nécessaire
    
    return NextResponse.json({
      message: 'Déconnexion réussie',
    });
  } catch (error: any) {
    console.error('❌ Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la déconnexion' },
      { status: 500 }
    );
  }
}
