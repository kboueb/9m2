'use client';

import { create } from 'zustand';

interface Producer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  address: string | null;
}

interface ProducersState {
  producers: Producer[];
  isLoading: boolean;
  fetchProducers: () => Promise<void>;
}

export const useProducers = create<ProducersState>((set) => ({
  producers: [],
  isLoading: false,

  fetchProducers: async () => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/producers', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      set({ producers: data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },
}));
