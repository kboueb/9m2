import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log('🔒 Middleware - Path:', pathname);

  // Routes publiques
  const publicPaths = ['/login', '/register', '/'];
  if (publicPaths.includes(pathname)) {
    console.log('✅ Middleware - Route publique');
    return NextResponse.next();
  }

  // Vérifier le token dans les cookies
  const token = request.cookies.get('token')?.value;
  console.log('🔑 Token présent:', !!token);

  // Si pas de token, rediriger vers login
  if (!token && pathname.startsWith('/dashboard')) {
    console.log('❌ Middleware - Pas de token, redirection vers /login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  console.log('✅ Middleware - Autorisation accordée');
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
