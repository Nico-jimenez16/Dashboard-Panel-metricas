import { NextRequest, NextResponse } from 'next/server';
import { getRelatedCases } from '@/server/services/cases.service';
import { AppError, appErrorBody } from '@/server/errors';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const casos = await getRelatedCases(id);
    return NextResponse.json(casos);
  } catch (err) {
    if (err instanceof AppError) {
      return NextResponse.json(appErrorBody(err), { status: err.statusCode });
    }
    console.error('[GET /api/casos/[id]/relacionados]', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
