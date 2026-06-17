import { NextRequest, NextResponse } from 'next/server';
import { listCases } from '@/server/services/cases.service';
import { casesFiltersSchema } from '@/server/gestar/schemas';
import { AppError } from '@/server/errors';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const parsed = casesFiltersSchema.safeParse({
      status:    searchParams.get('status')    ?? undefined,
      priority:  searchParams.get('priority')  ?? undefined,
      slaArea:   searchParams.get('slaArea')   ?? undefined,
      busqueda:  searchParams.get('busqueda')  ?? undefined,
      pagina:    searchParams.get('pagina')    ?? undefined,
      porPagina: searchParams.get('porPagina') ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Parámetros inválidos', detalles: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const result = await listCases(parsed.data);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof AppError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    console.error('[GET /api/casos]', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
