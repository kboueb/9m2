import { NextRequest } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

// Signer un token JWT
export async function signToken(payload: JWTPayload): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // Token valide 7 jours
    .sign(secret);

  return token;
}

// Vérifier un token JWT
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JWTPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// Vérifier l'authentification depuis une requête
export async function verifyAuth(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { success: false, user: null };
    }

    const token = authHeader.substring(7); // Enlever "Bearer "
    const payload = await verifyToken(token);

    if (!payload) {
      return { success: false, user: null };
    }

    return {
      success: true,
      user: {
        id: payload.userId,
        email: payload.email,
        role: payload.role,
      },
    };
  } catch (error) {
    console.error('Auth verification error:', error);
    return { success: false, user: null };
  }
}

// Extraire le token depuis les cookies (pour les Server Components)
export async function getSessionFromCookies(cookieHeader: string | null) {
  if (!cookieHeader) return null;

  const cookies = Object.fromEntries(
    cookieHeader.split('; ').map(c => {
      const [key, ...v] = c.split('=');
      return [key, v.join('=')];
    })
  );

  const token = cookies['auth-token'];
  if (!token) return null;

  return await verifyToken(token);
}
