import { getAllCases } from '@/server/gestar/client';
import { cacheGetOrSet } from '@/server/cache/memory-cache';
import { CACHE_KEYS } from '@/server/cache/keys';
import type { Case, DashboardMetrics, MonthlyData, AreaStats } from '@/types/domain';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const MES_ORDER = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

export function buildMonthlyTrend(cases: Case[]): MonthlyData[] {
  const map = new Map<string, { recibidos: number; cerrados: number }>();

  for (const c of cases) {
    const key = format(new Date(c.createdAt), 'MMM yyyy', { locale: es });
    const entry = map.get(key) ?? { recibidos: 0, cerrados: 0 };
    entry.recibidos++;
    if (c.isClosed && c.solvedAt) {
      const closedKey = format(new Date(c.solvedAt), 'MMM yyyy', { locale: es });
      const closedEntry = map.get(closedKey) ?? { recibidos: 0, cerrados: 0 };
      closedEntry.cerrados++;
      map.set(closedKey, closedEntry);
    }
    map.set(key, entry);
  }

  return Array.from(map.entries())
    .map(([mes, data]) => ({ mes, ...data }))
    .sort((a, b) => {
      const [ma, ya] = a.mes.split(' ');
      const [mb, yb] = b.mes.split(' ');
      const yearDiff = Number(ya) - Number(yb);
      if (yearDiff !== 0) return yearDiff;
      return MES_ORDER.indexOf(ma) - MES_ORDER.indexOf(mb);
    })
    .slice(-12);
}

export function buildGroupStats(cases: Case[], keyFn: (c: Case) => string | null, fallback: string): AreaStats[] {
  const map = new Map<string, { total: number; cerrados: number }>();

  for (const c of cases) {
    const area = keyFn(c) ?? fallback;
    const entry = map.get(area) ?? { total: 0, cerrados: 0 };
    entry.total++;
    if (c.isClosed) entry.cerrados++;
    map.set(area, entry);
  }

  return Array.from(map.entries())
    .map(([area, { total, cerrados }]) => ({
      area,
      total,
      cerrados,
      tasaCierre: total > 0 ? Math.round((cerrados / total) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total);
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  return cacheGetOrSet(CACHE_KEYS.dashboardMetrics, async () => {
    const cases = await getAllCases();

    const byStatus = (s: string) =>
      cases.filter((c) => c.status.toLowerCase() === s.toLowerCase()).length;

    const serviceMap = new Map<string, number>();
    for (const c of cases) {
      const key = c.service ?? 'Sin servicio';
      serviceMap.set(key, (serviceMap.get(key) ?? 0) + 1);
    }
    const porServicio = Array.from(serviceMap.entries())
      .map(([tipo, cantidad]) => ({ tipo, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad);

    return {
      totalCasos: cases.length,
      casosAtendidos: byStatus('Atendido'),
      casosCerrados: cases.filter((c) => c.isClosed).length,
      casosDerivados: byStatus('Derivado'),
      casosDerivadosAProveedores: byStatus('Derivado a proveedor'),
      casosDevueltosAlUsuario: byStatus('Devuelto al usuario'),
      casosSuspendidos: byStatus('Suspendido'),
      slaVencidos: 0, // Gestar no expone fecha SLA
      tendenciaMensual: buildMonthlyTrend(cases),
      porEstado: [
        { estado: 'Atendido',            cantidad: byStatus('Atendido') },
        { estado: 'Cerrado',             cantidad: byStatus('Cerrado') },
        { estado: 'Derivado',            cantidad: byStatus('Derivado') },
        { estado: 'Derivado a proveedor', cantidad: byStatus('Derivado a proveedor') },
        { estado: 'Devuelto al usuario', cantidad: byStatus('Devuelto al usuario') },
        { estado: 'Suspendido',          cantidad: byStatus('Suspendido') },
      ],
      porServicio,
      porSucursal: buildGroupStats(cases, (c) => c.branchOffice, 'Sin sucursal'),
    };
  });
}
