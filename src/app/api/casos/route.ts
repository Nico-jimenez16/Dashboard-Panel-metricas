import { NextRequest, NextResponse } from 'next/server';
import { listCases, createCase } from '@/server/services/cases.service';
import { casesFiltersSchema } from '@/server/gestar/schemas';
import { createCaseSchema } from '@/components/ui/forms/CreateCaseForm/CreateCaseForm.schema';
import { AppError, ValidationError, validationErrorFromZod, appErrorBody } from '@/server/errors';

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
      throw validationErrorFromZod(parsed.error, 'Parámetros inválidos');
    }

    const result = await listCases(parsed.data);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof AppError) {
      return NextResponse.json(appErrorBody(err), { status: err.statusCode });
    }
    console.error('[GET /api/casos]', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      throw new ValidationError('Body JSON inválido');
    }

    const parsed = createCaseSchema.safeParse(body);
    if (!parsed.success) {
      throw validationErrorFromZod(parsed.error, 'Datos inválidos');
    }
    const result = await createCase(parsed.data);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    if (err instanceof AppError) {
      return NextResponse.json(appErrorBody(err), { status: err.statusCode });
    }
    console.error('[POST /api/casos]', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
