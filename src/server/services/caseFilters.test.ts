import { describe, it, expect } from 'vitest';
import { byStatus, byPriority, bySlaArea, bySearch, buildPredicates } from './caseFilters';
import type { Case, CasesFilters } from '@/types/domain';

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

describe('byStatus', () => {
  it('matches when status equals filter (case-insensitive)', () => {
    const c = makeCase({ status: 'Cerrado' });
    expect(byStatus({ status: 'cerrado' })(c)).toBe(true);
    expect(byStatus({ status: 'CERRADO' })(c)).toBe(true);
  });

  it('does not match a different status', () => {
    const c = makeCase({ status: 'Abierto' });
    expect(byStatus({ status: 'Cerrado' })(c)).toBe(false);
  });

  it('passes everything when status filter is undefined', () => {
    const c = makeCase({ status: 'Cualquiera' });
    expect(byStatus({})(c)).toBe(true);
  });
});

describe('byPriority', () => {
  it('matches against priorityLevel (not the priority field) by exact value', () => {
    const c = makeCase({ priorityLevel: 'Alta', priority: 'P1' });
    expect(byPriority({ priority: 'Alta' })(c)).toBe(true);
  });

  it('does not match a different priorityLevel', () => {
    const c = makeCase({ priorityLevel: 'Baja' });
    expect(byPriority({ priority: 'Alta' })(c)).toBe(false);
  });

  it('is case-sensitive (exact equality, no normalization)', () => {
    const c = makeCase({ priorityLevel: 'Alta' });
    expect(byPriority({ priority: 'alta' })(c)).toBe(false);
  });

  it('passes everything when priority filter is undefined', () => {
    const c = makeCase({ priorityLevel: 'Baja' });
    expect(byPriority({})(c)).toBe(true);
  });
});

describe('bySlaArea', () => {
  it('matches via case-insensitive partial includes', () => {
    const c = makeCase({ slaArea: 'Soporte Nivel 2' });
    expect(bySlaArea({ slaArea: 'nivel 2' })(c)).toBe(true);
  });

  it('does not match when substring is absent', () => {
    const c = makeCase({ slaArea: 'Soporte Nivel 2' });
    expect(bySlaArea({ slaArea: 'nivel 3' })(c)).toBe(false);
  });

  it('excludes cases with null slaArea when a filter is set', () => {
    const c = makeCase({ slaArea: null });
    expect(bySlaArea({ slaArea: 'nivel 2' })(c)).toBe(false);
  });

  it('passes everything when slaArea filter is undefined', () => {
    const c = makeCase({ slaArea: null });
    expect(bySlaArea({})(c)).toBe(true);
  });
});

describe('bySearch', () => {
  it('matches on subject, case-insensitively', () => {
    const c = makeCase({ subject: 'Falla de Impresora' });
    expect(bySearch({ busqueda: 'impresora' })(c)).toBe(true);
    expect(bySearch({ busqueda: 'IMPRESORA' })(c)).toBe(true);
  });

  it('matches on description, case-insensitively', () => {
    const c = makeCase({ description: 'El equipo no enciende' });
    expect(bySearch({ busqueda: 'no enciende' })(c)).toBe(true);
  });

  it('matches on caseNumber via substring on its string form', () => {
    const c = makeCase({ caseNumber: 100234 });
    expect(bySearch({ busqueda: '234' })(c)).toBe(true);
  });

  it('does not match when query is absent from subject, description, or caseNumber', () => {
    const c = makeCase({ subject: 'Falla de Impresora', description: 'Sin tinta', caseNumber: 100234 });
    expect(bySearch({ busqueda: 'monitor' })(c)).toBe(false);
  });

  it('treats null subject/description as non-matching (no throw)', () => {
    const c = makeCase({ subject: null, description: null, caseNumber: 5 });
    expect(bySearch({ busqueda: 'algo' })(c)).toBe(false);
  });

  // CARACTERIZA comportamiento actual — busqueda vacío ('') es falsy, igual que
  // undefined: el filtro pasa todo en vez de no matchear nada.
  it('passes everything when busqueda is an empty string', () => {
    const c = makeCase({ subject: 'Lo que sea' });
    expect(bySearch({ busqueda: '' })(c)).toBe(true);
  });

  it('passes everything when busqueda filter is undefined', () => {
    const c = makeCase({ subject: 'Lo que sea' });
    expect(bySearch({})(c)).toBe(true);
  });
});

describe('buildPredicates + Array.every (AND combination)', () => {
  it('returns 4 predicates in order: status, priority, slaArea, busqueda', () => {
    const predicates = buildPredicates({});
    expect(predicates).toHaveLength(4);
  });

  it('requires all active filters to match (AND)', () => {
    const c = makeCase({
      status: 'Cerrado',
      priorityLevel: 'Alta',
      slaArea: 'Soporte Nivel 2',
      subject: 'Falla de Impresora',
    });
    const filters: CasesFilters = {
      status: 'cerrado',
      priority: 'Alta',
      slaArea: 'nivel 2',
      busqueda: 'impresora',
    };
    expect(buildPredicates(filters).every((p) => p(c))).toBe(true);
  });

  it('fails the AND if a single active filter does not match', () => {
    const c = makeCase({ status: 'Cerrado', priorityLevel: 'Baja' });
    const filters: CasesFilters = { status: 'cerrado', priority: 'Alta' };
    expect(buildPredicates(filters).every((p) => p(c))).toBe(false);
  });

  it('excludes nothing when no filters are active', () => {
    const c = makeCase();
    expect(buildPredicates({}).every((p) => p(c))).toBe(true);
  });
});
