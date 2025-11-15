import { getParcelleById } from '@/actions/parcelles.actions';
import { ParcelleForm } from '@/components/admin/ParcelleForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function EditParcellePage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const parcelle = await getParcelleById(params.id);

    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-6">
          <Link href="/dashboard/admin/parcelles">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la liste
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Modifier la Parcelle</h1>
          <p className="text-muted-foreground mt-2">
            Code: {parcelle.code}
          </p>
        </div>

        <ParcelleForm initialData={parcelle} isEdit />
      </div>
    );
  } catch (error) {
    notFound();
  }
}
