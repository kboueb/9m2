'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function DashboardRedirect() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const roleRoutes: Record<string, string> = {
      ADMIN: '/dashboard/admin',
      FARMER: '/dashboard/paysan',
      INVESTOR: '/dashboard/investisseur',
    };

    const redirectPath = roleRoutes[user.role] || '/login';
    router.replace(redirectPath);
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirection...</p>
      </div>
    </div>
  );
}
