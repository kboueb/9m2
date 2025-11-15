'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createParcelle, updateParcelle } from '@/actions/parcelles.actions';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  region: z.string().min(1, 'La région est requise'),
  localite: z.string().min(1, 'La localité est requise'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  packType: z.enum(['PACK_1', 'PACK_4', 'PACK_9']),
  activite: z.enum(['MARAICHAGE', 'PISCICULTURE', 'AVICULTURE', 'BANANIER', 'ARBORICULTURE', 'ELEVAGE']),
  prixMensuel: z.number().min(0, 'Le prix doit être positif'),
  rendementEstime: z.number().min(0).max(100, 'Le rendement doit être entre 0 et 100'),
  cultureActuelle: z.string().optional(),
  qualiteSol: z.string().optional(),
  acceauEau: z.boolean().default(true),
  exposition: z.string().optional(),
  certificationBio: z.boolean().default(false),
  co2Absorbe: z.number().optional(),
  eauEconomisee: z.number().optional(),
  biodiversite: z.number().min(0).max(100).optional(),
  imagePrincipale: z.string().url().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ParcelleFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export function ParcelleForm({ initialData, isEdit = false }: ParcelleFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      region: '',
      localite: '',
      latitude: 0,
      longitude: 0,
      packType: 'PACK_1',
      activite: 'MARAICHAGE',
      prixMensuel: 0,
      rendementEstime: 15,
      acceauEau: true,
      certificationBio: false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      if (isEdit && initialData?.id) {
        await updateParcelle(initialData.id, data);
        toast.success('Parcelle mise à jour avec succès');
      } else {
        await createParcelle(data);
        toast.success('Parcelle créée avec succès');
      }
      router.push('/dashboard/admin/parcelles');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Localisation */}
        <Card>
          <CardHeader>
            <CardTitle>Localisation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Région</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Dakar, Thiès..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="localite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localité</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Mbour, Rufisque..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.000001"
                        placeholder="Ex: 14.7167"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.000001"
                        placeholder="Ex: -17.4677"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="packType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de Pack</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un pack" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PACK_1">Pack 1 (9m²)</SelectItem>
                        <SelectItem value="PACK_4">Pack 4 (36m²)</SelectItem>
                        <SelectItem value="PACK_9">Pack 9 (81m²)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="activite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type d'Activité</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une activité" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MARAICHAGE">Maraîchage</SelectItem>
                        <SelectItem value="PISCICULTURE">Pisciculture</SelectItem>
                        <SelectItem value="AVICULTURE">Aviculture</SelectItem>
                        <SelectItem value="BANANIER">Bananier</SelectItem>
                        <SelectItem value="ARBORICULTURE">Arboriculture</SelectItem>
                        <SelectItem value="ELEVAGE">Élevage</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="cultureActuelle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Culture Actuelle (optionnel)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Tomates, Oignons..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Prix et Rendement */}
        <Card>
          <CardHeader>
            <CardTitle>Prix et Rendement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="prixMensuel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix Mensuel (FCFA)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ex: 50000"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Prix pour 1 parcelle (9m²)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rendementEstime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rendement Estimé (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ex: 15"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Pourcentage de retour sur investissement estimé
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Caractéristiques */}
        <Card>
          <CardHeader>
            <CardTitle>Caractéristiques</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="qualiteSol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qualité du Sol</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner la qualité" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Excellent">Excellent</SelectItem>
                      <SelectItem value="Bon">Bon</SelectItem>
                      <SelectItem value="Moyen">Moyen</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="exposition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exposition</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner l'exposition" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Plein soleil">Plein soleil</SelectItem>
                      <SelectItem value="Mi-ombre">Mi-ombre</SelectItem>
                      <SelectItem value="Ombragé">Ombragé</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="acceauEau"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Accès à l'eau</FormLabel>
                      <FormDescription>
                        La parcelle a-t-elle un accès direct à l'eau ?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="certificationBio"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Certification Bio</FormLabel>
                      <FormDescription>
                        La parcelle est-elle certifiée biologique ?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Impact Environnemental */}
        <Card>
          <CardHeader>
            <CardTitle>Impact Environnemental</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="co2Absorbe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CO₂ Absorbé (kg/an)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ex: 150"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="eauEconomisee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Eau Économisée (L/an)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ex: 5000"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="biodiversite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Score Biodiversité</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ex: 75"
                        min="0"
                        max="100"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormDescription>
                      Score de 0 à 100
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Image */}
        <Card>
          <CardHeader>
            <CardTitle>Image Principale</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="imagePrincipale"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de l'image</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://images.unsplash.com/..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    URL d'une image (Unsplash, etc.)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? 'Mettre à jour' : 'Créer la parcelle'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
