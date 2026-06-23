import { NextResponse } from 'next/server';
import { getDashboardMetrics } from '@/server/services/metrics.service';
import { AppError, appErrorBody } from '@/server/errors';

export async function GET() {
  try {
    const metrics = await getDashboardMetrics();
    return NextResponse.json(metrics);
  } catch (err) {
    if (err instanceof AppError) {
      return NextResponse.json(appErrorBody(err), { status: err.statusCode });
    }
    console.error('[GET /api/metricas/dashboard]', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
