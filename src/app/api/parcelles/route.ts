import { NextRequest, NextResponse } from 'next/server';
import { getAllParcelles } from '@/actions/parcelles.actions';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const filters = {
      statut: searchParams.get('statut') as any,
      activite: searchParams.get('activite') as any,
      region: searchParams.get('region') || undefined,
      packType: searchParams.get('packType') as any,
      disponible: searchParams.get('disponible') === 'true',
    };

    const result = await getAllParcelles(filters);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
