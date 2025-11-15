import { getAllParcelles, getParcellesStats } from '@/actions/parcelles.actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Plus, MapPin, TrendingUp, Activity, Package } from 'lucide-react';
import { ParcellesTable } from '@/components/admin/ParcellesTable';
import { ParcellesFilters } from '@/components/admin/ParcellesFilters';

export default async function AdminParcellesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const filters = {
    statut: searchParams.statut as any,
    activite: searchParams.activite as any,
    region: searchParams.region,
    packType: searchParams.packType as any,
    disponible: searchParams.disponible === 'true',
  };

  const [{ parcelles, total }, stats] = await Promise.all([
    getAllParcelles(filters),
    getParcellesStats(),
  ]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Parcelles</h1>
          <p className="text-muted-foreground mt-1">
            Gérez l'ensemble des parcelles disponibles à la location
          </p>
        </div>
        <Link href="/dashboard/admin/parcelles/new">
          <Button size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Nouvelle Parcelle
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Parcelles</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.disponibles} disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'Occupation</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tauxOccupation.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.louees + stats.enProduction} parcelles actives
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Production</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.enProduction}</div>
            <p className="text-xs text-muted-foreground">
              Cultures en cours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Régions Actives</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.parRegion.length}</div>
            <p className="text-xs text-muted-foreground">
              Zones géographiques
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <ParcellesFilters />

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Parcelles ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          <ParcellesTable parcelles={parcelles} />
        </CardContent>
      </Card>
    </div>
  );
}
