import { describe, it, expect } from 'vitest';
import { buildMonthlyTrend, buildGroupStats } from './metrics.service';
import type { Case } from '@/types/domain';

// getDashboardMetrics() queda fuera de alcance: depende del cache
// (cacheGetOrSet) y de getAllCases() (fetch a Gestar), lo cual requiere
// mockear servicios externos en vez de testear matemática pura.

function makeCase(overrides: Partial<Case> = {}): Case {
  return {
    id: 1,
    caseNumber: 1001,
    status: 'Abierto',
    statusId: 1,
    service: null,
    serviceId: null,
    typeCode: null,
    typeId: null,
    priority: null,
    priorityLevel: null,
    branchOffice: null,
    branchCode: null,
    slaArea: null,
    slaId: null,
    subject: null,
    description: null,
    requester: null,
    requesterId: null,
    requesterEmail: null,
    requesterPhone: null,
    assignee: null,
    assigneeId: null,
    team: null,
    teamId: null,
    teamLeader: null,
    teamLeaderId: null,
    createdAt: '2024-01-01T00:00:00.000Z',
    solvedAt: null,
    provider: null,
    providerId: null,
    providerService: null,
    providerClosedAt: null,
    solutionDateType: null,
    resolutionHours: null,
    isClosed: false,
    ...overrides,
  };
}

describe('buildMonthlyTrend', () => {
  it('agrupa por mes de creación y cuenta recibidos', () => {
    const cases = [
      makeCase({ createdAt: '2024-01-05T00:00:00.000Z' }),
      makeCase({ createdAt: '2024-01-20T00:00:00.000Z' }),
      makeCase({ createdAt: '2024-02-10T00:00:00.000Z' }),
    ];
    const trend = buildMonthlyTrend(cases);
    expect(trend).toEqual([
      { mes: 'ene 2024', recibidos: 2, cerrados: 0 },
      { mes: 'feb 2024', recibidos: 1, cerrados: 0 },
    ]);
  });

  it('cuenta cerrados en el mes de solvedAt, no en el de createdAt', () => {
    const cases = [
      makeCase({ createdAt: '2024-01-15T00:00:00.000Z', isClosed: true, solvedAt: '2024-02-20T00:00:00.000Z' }),
    ];
    const trend = buildMonthlyTrend(cases);
    // El caso aporta "recibido" a enero y "cerrado" a febrero: dos entradas separadas.
    expect(trend).toEqual(
      expect.arrayContaining([
        { mes: 'ene 2024', recibidos: 1, cerrados: 0 },
        { mes: 'feb 2024', recibidos: 0, cerrados: 1 },
      ]),
    );
    expect(trend).toHaveLength(2);
  });

  it('no rellena con ceros los meses sin casos (gap real, no aparece)', () => {
    const cases = [
      makeCase({ createdAt: '2024-01-15T00:00:00.000Z' }),
      makeCase({ createdAt: '2024-04-15T00:00:00.000Z' }),
    ];
    const trend = buildMonthlyTrend(cases);
    expect(trend.map((t) => t.mes)).toEqual(['ene 2024', 'abr 2024']);
  });

  it('ordena correctamente cuando cruza de año (por año sí funciona)', () => {
    const casesA = [
      makeCase({ createdAt: '2024-01-15T00:00:00.000Z' }),
      makeCase({ createdAt: '2023-12-15T00:00:00.000Z' }),
    ];
    expect(buildMonthlyTrend(casesA).map((t) => t.mes)).toEqual(['dic 2023', 'ene 2024']);
  });

  // CARACTERIZA comportamiento actual — posible bug, revisar en Fase 2.3.
  // El orden por mes dentro de un mismo año está roto: date-fns con locale
  // 'es' devuelve los nombres en minúscula ("ene", "mar"), pero MES_ORDER
  // tiene los nombres capitalizados ("Ene", "Mar"). MES_ORDER.indexOf(ma)
  // devuelve -1 para todos los meses, así que esa rama del comparador
  // siempre da 0 y el sort (estable) deja el orden de inserción del Map,
  // NO el orden cronológico real.
  it('NO ordena cronológicamente dentro del mismo año (mismatch ene/Ene)', () => {
    const cases = [
      makeCase({ createdAt: '2024-03-10T00:00:00.000Z' }), // insertado primero
      makeCase({ createdAt: '2024-01-05T00:00:00.000Z' }), // cronológicamente antes, pero insertado segundo
    ];
    const trend = buildMonthlyTrend(cases);
    // Si el sort funcionara, "ene 2024" debería ir antes que "mar 2024".
    // El comportamiento actual conserva el orden de inserción.
    expect(trend.map((t) => t.mes)).toEqual(['mar 2024', 'ene 2024']);
  });

  it('se limita a los últimos 12 resultados del array ya ordenado (slice(-12))', () => {
    const cases = Array.from({ length: 13 }, (_, i) => {
      const year = i < 12 ? 2023 : 2024;
      const month = i < 12 ? i + 1 : 1;
      return makeCase({ createdAt: new Date(year, month - 1, 10).toISOString() });
    });
    const trend = buildMonthlyTrend(cases);
    expect(trend).toHaveLength(12);
    // El primer mes (ene 2023) queda afuera por el slice(-12).
    expect(trend.map((t) => t.mes)).not.toContain('ene 2023');
    expect(trend[trend.length - 1].mes).toBe('ene 2024');
  });
});

describe('buildGroupStats', () => {
  it('agrupa, cuenta total/cerrados y calcula tasaCierre (redondeada)', () => {
    const cases = [
      makeCase({ branchOffice: 'Centro', isClosed: true }),
      makeCase({ branchOffice: 'Centro', isClosed: false }),
      makeCase({ branchOffice: 'Centro', isClosed: false }),
      makeCase({ branchOffice: 'Norte', isClosed: true }),
      makeCase({ branchOffice: null, isClosed: false }),
    ];
    const stats = buildGroupStats(cases, (c) => c.branchOffice, 'Sin sucursal');
    expect(stats).toEqual([
      { area: 'Centro', total: 3, cerrados: 1, tasaCierre: 33 },
      { area: 'Norte', total: 1, cerrados: 1, tasaCierre: 100 },
      { area: 'Sin sucursal', total: 1, cerrados: 0, tasaCierre: 0 },
    ]);
  });

  it('usa el fallback cuando keyFn devuelve null', () => {
    const cases = [makeCase({ branchOffice: null })];
    const stats = buildGroupStats(cases, (c) => c.branchOffice, 'Sin sucursal');
    expect(stats[0].area).toBe('Sin sucursal');
  });

  it('ordena por total descendente', () => {
    const cases = [
      makeCase({ branchOffice: 'Pequeña', isClosed: false }),
      makeCase({ branchOffice: 'Grande', isClosed: false }),
      makeCase({ branchOffice: 'Grande', isClosed: false }),
    ];
    const stats = buildGroupStats(cases, (c) => c.branchOffice, 'Sin sucursal');
    expect(stats.map((s) => s.area)).toEqual(['Grande', 'Pequeña']);
  });

  it('devuelve array vacío cuando no hay casos', () => {
    expect(buildGroupStats([], (c) => c.branchOffice, 'Sin sucursal')).toEqual([]);
  });
});
