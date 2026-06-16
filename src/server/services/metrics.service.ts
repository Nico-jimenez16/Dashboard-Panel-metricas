import { getAllCases } from '@/server/gestar/client';
import { cacheGetOrSet } from '@/server/cache/memory-cache';
import type { Case, DashboardMetrics, MonthlyData, AreaStats } from '@/types/domain';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const MES_ORDER = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

function buildMonthlyTrend(cases: Case[]): MonthlyData[] {
  const map = new Map<string, { recibidos: number; cerrados: number }>();

  for (const c of cases) {
    const key = format(new Date(c.creadoEn), 'MMM yyyy', { locale: es });
    const entry = map.get(key) ?? { recibidos: 0, cerrados: 0 };
    entry.recibidos++;
    if (c.estado === 'cerrado' && c.cerradoEn) {
      const closedKey = format(new Date(c.cerradoEn), 'MMM yyyy', { locale: es });
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

function buildAreaStats(cases: Case[]): AreaStats[] {
  const map = new Map<string, { total: number; cerrados: number }>();

  for (const c of cases) {
    const entry = map.get(c.area) ?? { total: 0, cerrados: 0 };
    entry.total++;
    if (c.estado === 'cerrado') entry.cerrados++;
    map.set(c.area, entry);
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
  return cacheGetOrSet('dashboard_metrics', async () => {
    const cases = await getAllCases();

    return {
      totalCasos: cases.length,
      casosAtendidos: cases.filter((c) => c.estado === 'atendido').length,
      casosCerrados: cases.filter((c) => c.estado === 'cerrado').length,
      casosDerivados: cases.filter((c) => c.estado === 'derivado').length,
      casosDerivadosAProveedores: cases.filter((c) => c.estado === 'derivado a proveedor').length,
      casosDevueltosAlUsuario: cases.filter((c) => c.estado === 'devuelto al usuario').length,
      casosSuspendidos: cases.filter((c) => c.estado === 'suspendido').length,
      slaVencidos: cases.filter((c) => c.slaVencido).length,
      tendenciaMensual: buildMonthlyTrend(cases),
      porEstado: [
        { estado: 'atendido',   cantidad: cases.filter((c) => c.estado === 'atendido').length },
        { estado: 'cerrado',  cantidad: cases.filter((c) => c.estado === 'cerrado').length },
        { estado: 'derivado',   cantidad: cases.filter((c) => c.estado === 'derivado').length },
        { estado: 'derivado a proveedor', cantidad: cases.filter((c) => c.estado === 'derivado a proveedor').length },
        { estado: 'devuelto al usuario', cantidad: cases.filter((c) => c.estado === 'devuelto al usuario').length },
        { estado: 'suspendido', cantidad: cases.filter((c) => c.estado === 'suspendido').length },
      ],
      porTipo: [
        { tipo: 'incidente', cantidad: cases.filter((c) => c.tipo === 'incidente').length },
        { tipo: 'solicitud', cantidad: cases.filter((c) => c.tipo === 'solicitud').length },
        { tipo: 'problema',  cantidad: cases.filter((c) => c.tipo === 'problema').length },
        { tipo: 'cambio',    cantidad: cases.filter((c) => c.tipo === 'cambio').length },
      ],
      porArea: buildAreaStats(cases),
    };
  });
}
