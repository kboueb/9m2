import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { LoginCredentials, RegisterData, AuthResponse } from '@/types/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await api.post<AuthResponse>('/api/auth/login', credentials);
      return data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success('Connexion réussie !');
      router.push('/dashboard');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur de connexion');
    },
  });
}

export function useRegister() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const { data: response } = await api.post<AuthResponse>('/api/auth/register', data);
      return response;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success('Inscription réussie !');
      router.push('/dashboard');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erreur d'inscription");
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  return () => {
    logout();
    toast.success('Déconnexion réussie');
    router.push('/login');
  };
}
