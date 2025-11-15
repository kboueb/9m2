'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

export function ParcellesFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/dashboard/admin/parcelles');
  };

  const hasFilters = searchParams.toString().length > 0;

  return (
    <div className="flex flex-wrap gap-4 items-end">
      <div className="flex-1 min-w-[200px]">
        <label className="text-sm font-medium mb-2 block">Recherche</label>
        <Input
          placeholder="Code, région, localité..."
          defaultValue={searchParams.get('search') || ''}
          onChange={(e) => updateFilter('search', e.target.value)}
        />
      </div>

      <div className="min-w-[180px]">
        <label className="text-sm font-medium mb-2 block">Statut</label>
        <Select
          defaultValue={searchParams.get('statut') || 'all'}
          onValueChange={(value) => updateFilter('statut', value === 'all' ? '' : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="DISPONIBLE">Disponible</SelectItem>
            <SelectItem value="LOUEE">Louée</SelectItem>
            <SelectItem value="EN_PRODUCTION">En Production</SelectItem>
            <SelectItem value="RECOLTE_EN_COURS">Récolte en cours</SelectItem>
            <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-[180px]">
        <label className="text-sm font-medium mb-2 block">Activité</label>
        <Select
          defaultValue={searchParams.get('activite') || 'all'}
          onValueChange={(value) => updateFilter('activite', value === 'all' ? '' : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Toutes les activités" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les activités</SelectItem>
            <SelectItem value="MARAICHAGE">Maraîchage</SelectItem>
            <SelectItem value="PISCICULTURE">Pisciculture</SelectItem>
            <SelectItem value="AVICULTURE">Aviculture</SelectItem>
            <SelectItem value="BANANIER">Bananier</SelectItem>
            <SelectItem value="ARBORICULTURE">Arboriculture</SelectItem>
            <SelectItem value="ELEVAGE">Élevage</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-[180px]">
        <label className="text-sm font-medium mb-2 block">Type de Pack</label>
        <Select
          defaultValue={searchParams.get('packType') || 'all'}
          onValueChange={(value) => updateFilter('packType', value === 'all' ? '' : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tous les packs" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les packs</SelectItem>
            <SelectItem value="PACK_1">Pack 1 (9m²)</SelectItem>
            <SelectItem value="PACK_4">Pack 4 (36m²)</SelectItem>
            <SelectItem value="PACK_9">Pack 9 (81m²)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasFilters && (
        <Button variant="outline" onClick={clearFilters}>
          <X className="mr-2 h-4 w-4" />
          Réinitialiser
        </Button>
      )}
    </div>
  );
}
