import { describe, it, expect } from 'vitest';
import { mapGestarCase, mapGestarCases } from './mappers';
import type { GestarRawCase } from './schemas';

function makeRaw(overrides: Partial<GestarRawCase> = {}): GestarRawCase {
  return {
    ID: 1,
    DOC_ID: 1001,
    STATEID: 1,
    STATE: 'Abierto',
    CREATEDDATE: '2024-01-01T00:00:00.000Z',
    SLA: null,
    SLAID: null,
    SERVICE: null,
    SERVICEID: null,
    TYPE: null,
    TYPEID: null,
    SUCURSAL: null,
    CID: null,
    TITLE: null,
    DESCRIPTION: null,
    DATATYPE: null,
    PRIORITY: null,
    PRIORITIES: null,
    USER: null,
    USERID: null,
    USERPHONE: null,
    USEREMAIL: null,
    RESPONSIBLE: null,
    RESPONSIBLEID: null,
    TEAMNAME: null,
    TEAMID: null,
    TEAMLEADER: null,
    TEAMLEADERID: null,
    SOLUTIONDATE: null,
    PROVIDER: null,
    PROVIDERID: null,
    PROVIDERSERVICE: null,
    DATECLOSEPROVIDER: null,
    TYPE_FECHASOLUCION: null,
    ...overrides,
  };
}

describe('mapGestarCase — mapeo campo a campo', () => {
  it('mapea los campos básicos al modelo Case', () => {
    const raw = makeRaw({
      ID: 42,
      DOC_ID: 100234,
      STATE: 'Abierto',
      STATEID: 2,
      SERVICE: '  Soporte Técnico  ',
      SERVICEID: 7,
      TYPE: 'INC',
      TYPEID: 3,
      SUCURSAL: 'Casa Central',
      CID: 'CC01',
      SLA: 'Nivel 2',
      SLAID: 5,
      TITLE: 'Falla de impresora',
      DESCRIPTION: '<p>El equipo <b>no enciende</b></p>',
      USER: 'Juan Perez',
      USERID: 10,
      USEREMAIL: 'juan@example.com',
      USERPHONE: '12345678',
      RESPONSIBLE: 'Mesa de Ayuda',
      RESPONSIBLEID: 20,
      TEAMNAME: 'Soporte N1',
      TEAMID: 30,
      TEAMLEADER: 'Ana Lider',
      TEAMLEADERID: 40,
      PROVIDER: 'Proveedor SA',
      PROVIDERID: 50,
      PROVIDERSERVICE: 'Garantía',
      DATECLOSEPROVIDER: '2024-01-05T00:00:00.000Z',
      TYPE_FECHASOLUCION: 'Manual',
    });

    const mapped = mapGestarCase(raw);

    expect(mapped.id).toBe(42);
    expect(mapped.caseNumber).toBe(100234);
    expect(mapped.status).toBe('Abierto');
    expect(mapped.statusId).toBe(2);
    expect(mapped.service).toBe('Soporte Técnico'); // se trimea
    expect(mapped.serviceId).toBe(7);
    expect(mapped.typeCode).toBe('INC');
    expect(mapped.typeId).toBe(3);
    expect(mapped.branchOffice).toBe('Casa Central');
    expect(mapped.branchCode).toBe('CC01');
    expect(mapped.slaArea).toBe('Nivel 2');
    expect(mapped.slaId).toBe(5);
    expect(mapped.subject).toBe('Falla de impresora');
    expect(mapped.description).toBe('El equipo no enciende'); // HTML stripeado
    expect(mapped.requester).toBe('Juan Perez');
    expect(mapped.requesterId).toBe(10);
    expect(mapped.requesterEmail).toBe('juan@example.com');
    expect(mapped.requesterPhone).toBe('12345678');
    expect(mapped.assignee).toBe('Mesa de Ayuda');
    expect(mapped.assigneeId).toBe(20);
    expect(mapped.team).toBe('Soporte N1');
    expect(mapped.teamId).toBe(30);
    expect(mapped.teamLeader).toBe('Ana Lider');
    expect(mapped.teamLeaderId).toBe(40);
    expect(mapped.provider).toBe('Proveedor SA');
    expect(mapped.providerId).toBe(50);
    expect(mapped.providerService).toBe('Garantía');
    expect(mapped.providerClosedAt).toBe('2024-01-05T00:00:00.000Z');
    expect(mapped.solutionDateType).toBe('Manual');
  });

  // CARACTERIZA comportamiento actual — el mapper cruza PRIORITIES/PRIORITY:
  // Case.priority viene de raw.PRIORITIES y Case.priorityLevel viene de
  // raw.PRIORITY (los nombres están invertidos respecto a lo intuitivo).
  it('mapea priority desde PRIORITIES y priorityLevel desde PRIORITY', () => {
    const raw = makeRaw({ PRIORITIES: 'P1 - Crítica', PRIORITY: 'Alta' });
    const mapped = mapGestarCase(raw);
    expect(mapped.priority).toBe('P1 - Crítica');
    expect(mapped.priorityLevel).toBe('Alta');
  });

  it('descarta DATATYPE: no aparece en la salida', () => {
    const raw = makeRaw({ DATATYPE: 'usuario:secreto123' });
    const mapped = mapGestarCase(raw);
    expect(Object.keys(mapped)).not.toContain('DATATYPE');
    expect(JSON.stringify(mapped)).not.toContain('secreto123');
  });

  it('trunca (no redondea) los IDs numéricos vía toInt', () => {
    const raw = makeRaw({ SLAID: 5.9, SERVICEID: -3.9 });
    const mapped = mapGestarCase(raw);
    expect(mapped.slaId).toBe(5);
    expect(mapped.serviceId).toBe(-3);
  });
});

describe('mapGestarCase — campos derivados (resolutionHours, isClosed)', () => {
  it('caso cerrado: isClosed=true y resolutionHours calculado en horas (exacto)', () => {
    const raw = makeRaw({
      STATE: 'Cerrado',
      CREATEDDATE: '2024-01-01T00:00:00.000Z',
      SOLUTIONDATE: '2024-01-02T12:00:00.000Z', // 36 horas exactas
    });
    const mapped = mapGestarCase(raw);
    expect(mapped.isClosed).toBe(true);
    expect(mapped.resolutionHours).toBe(36);
  });

  it('caso cerrado con duración fraccionaria: redondea a 1 decimal', () => {
    const raw = makeRaw({
      STATE: 'Cerrado',
      CREATEDDATE: '2024-03-10T08:00:00.000Z',
      SOLUTIONDATE: '2024-03-10T10:15:00.000Z', // 2h15m = 2.25h
    });
    const mapped = mapGestarCase(raw);
    expect(mapped.resolutionHours).toBe(2.3);
  });

  it('caso abierto sin SOLUTIONDATE: isClosed=false y resolutionHours=null', () => {
    const raw = makeRaw({ STATE: 'Abierto', SOLUTIONDATE: null });
    const mapped = mapGestarCase(raw);
    expect(mapped.isClosed).toBe(false);
    expect(mapped.resolutionHours).toBeNull();
  });

  it('isClosed se calcula con trim + lowercase, tolerante a mayúsculas y espacios', () => {
    const raw = makeRaw({ STATE: '  CERRADO  ' });
    const mapped = mapGestarCase(raw);
    expect(mapped.isClosed).toBe(true);
    expect(mapped.status).toBe('  CERRADO  '); // status conserva el valor crudo, sin trim
  });
});

describe('mapGestarCases', () => {
  it('mapea un array completo preservando el orden', () => {
    const raws = [
      makeRaw({ ID: 1, DOC_ID: 1001 }),
      makeRaw({ ID: 2, DOC_ID: 1002 }),
    ];
    const mapped = mapGestarCases(raws);
    expect(mapped.map((c) => c.id)).toEqual([1, 2]);
  });
});
