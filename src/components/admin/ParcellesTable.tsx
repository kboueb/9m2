'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Edit, Trash2, MapPin, User } from 'lucide-react';
import Link from 'next/link';
import { deleteParcelle } from '@/actions/parcelles.actions';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const STATUT_COLORS = {
  DISPONIBLE: 'bg-green-500',
  LOUEE: 'bg-blue-500',
  EN_PRODUCTION: 'bg-orange-500',
  RECOLTE_EN_COURS: 'bg-purple-500',
  MAINTENANCE: 'bg-yellow-500',
  INACTIVE: 'bg-gray-500',
};

const STATUT_LABELS = {
  DISPONIBLE: 'Disponible',
  LOUEE: 'Louée',
  EN_PRODUCTION: 'En Production',
  RECOLTE_EN_COURS: 'Récolte',
  MAINTENANCE: 'Maintenance',
  INACTIVE: 'Inactive',
};

const ACTIVITE_LABELS = {
  MARAICHAGE: 'Maraîchage',
  PISCICULTURE: 'Pisciculture',
  AVICULTURE: 'Aviculture',
  BANANIER: 'Bananier',
  ARBORICULTURE: 'Arboriculture',
  ELEVAGE: 'Élevage',
};

const PACK_LABELS = {
  PACK_1: '1 parcelle (9m²)',
  PACK_4: '4 parcelles (36m²)',
  PACK_9: '9 parcelles (81m²)',
};

interface ParcellesTableProps {
  parcelles: any[];
}

export function ParcellesTable({ parcelles }: ParcellesTableProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteParcelle(id);
      toast.success('Parcelle supprimée avec succès');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la suppression');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Localisation</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Activité</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Prix/mois</TableHead>
            <TableHead>Rendement</TableHead>
            <TableHead>Agriculteur</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {parcelles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                Aucune parcelle trouvée
              </TableCell>
            </TableRow>
          ) : (
            parcelles.map((parcelle) => (
              <TableRow key={parcelle.id}>
                <TableCell className="font-mono font-medium">
                  {parcelle.code}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{parcelle.localite}</div>
                      <div className="text-sm text-muted-foreground">
                        {parcelle.region}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {PACK_LABELS[parcelle.packType as keyof typeof PACK_LABELS]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {ACTIVITE_LABELS[parcelle.activite as keyof typeof ACTIVITE_LABELS]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={STATUT_COLORS[parcelle.statut as keyof typeof STATUT_COLORS]}
                  >
                    {STATUT_LABELS[parcelle.statut as keyof typeof STATUT_LABELS]}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">
                  {parcelle.prixTotal.toLocaleString()} FCFA
                </TableCell>
                <TableCell>
                  <span className="text-green-600 font-medium">
                    {parcelle.rendementEstime}%
                  </span>
                </TableCell>
                <TableCell>
                  {parcelle.agriculteur ? (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {parcelle.agriculteur.prenom} {parcelle.agriculteur.nom}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Non assigné</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <Link href={`/dashboard/admin/parcelles/${parcelle.id}`}>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Voir les détails
                        </DropdownMenuItem>
                      </Link>
                      <Link href={`/dashboard/admin/parcelles/${parcelle.id}/edit`}>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => setDeleteId(parcelle.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette parcelle ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
