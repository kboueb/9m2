'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('🔍 Tentative de connexion avec:', email);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      console.log('📥 Statut de la réponse:', response.status);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur de connexion');
      }

      const data = await response.json();
      console.log('✅ Données reçues:', data);

      // ✅ CORRECTION : L'API retourne "token" pas "access_token"
      const authToken = data.token || data.access_token;
      
      if (!authToken) {
        throw new Error('Token manquant dans la réponse');
      }

      console.log('🔑 Token extrait:', authToken.substring(0, 20) + '...');

      // Set auth in store
      login(data.user, authToken);
      
      toast.success('Connexion réussie !');
      
      // Attendre un peu pour que le store se mette à jour
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Redirection selon le rôle
      const roleMap: Record<string, string> = {
        'ADMIN': 'admin',
        'FARMER': 'agriculteur',
        'INVESTOR': 'investisseur',
      };
      
      const dashboardPath = `/dashboard/${roleMap[data.user.role] || 'investisseur'}`;
      console.log('🚀 Redirection vers:', dashboardPath);
      
      router.push(dashboardPath);
      router.refresh();

    } catch (error: any) {
      console.error('❌ Erreur:', error);
      toast.error(error.message || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <span className="text-3xl">🌱</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">9m2</h1>
            <p className="text-gray-600 mt-2">Connexion à votre compte</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="investisseur@9m2.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion...
                </span>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Pas encore de compte ?{' '}
            <Link href="/register" className="text-green-600 hover:text-green-700 font-semibold">
              S'inscrire
            </Link>
          </div>

          {/* Test Accounts */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs font-semibold text-gray-700 mb-2">Comptes de test :</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p>👨‍🌾 Agriculteur : <code className="bg-white px-1 py-0.5 rounded">agriculteur@9m2.com</code></p>
              <p>💰 Investisseur : <code className="bg-white px-1 py-0.5 rounded">investisseur@9m2.com</code></p>
              <p>🔑 Mot de passe : <code className="bg-white px-1 py-0.5 rounded">password123</code></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
