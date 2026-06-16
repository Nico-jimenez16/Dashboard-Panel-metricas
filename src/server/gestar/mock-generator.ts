import type { Case, CaseStatus, CasePriority, CaseType } from '@/types/domain';

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const AREAS = [
  'Contabilidad', 'Créditos', 'Sistemas', 'Recursos Humanos',
  'Compliance', 'Tesorería', 'Atención al Cliente', 'Operaciones',
  'Legales', 'Auditoría',
];

const CATEGORIAS = [
  'Hardware', 'Software', 'Red', 'Accesos', 'Correo',
  'Impresoras', 'Telefonía', 'Backup', 'Seguridad', 'Base de Datos',
];

const TECNICOS = [
  'Jimenez, N.', 'Díaz, A.', 'Artura, G.', 'Pabon, Y.',
  'Ojeda, P.', 'Vega, M.', 'Pérez, E.', 'Lizio, C.', 'Acrich, J.',
];

const TITULOS_BY_TYPE: Record<CaseType, string[]> = {
  incidente: [
    'Equipo no enciende', 'Pantalla sin señal', 'Error al iniciar sesión',
    'Sistema lento', 'Impresora no responde', 'Sin acceso a Internet',
    'Aplicación no abre', 'Error de red', 'PC bloqueado', 'Virus detectado',
  ],
  solicitud: [
    'Instalación de software', 'Alta de nuevo usuario', 'Reseteo de contraseña',
    'Cambio de equipo', 'Acceso a carpeta compartida', 'Configuración de correo',
    'Instalación de impresora', 'Acceso VPN corporativa', 'Backup adicional', 'Nueva licencia',
  ],
  problema: [
    'Falla recurrente en red', 'Degradación del servidor', 'Pérdida de datos frecuente',
    'Error sistémico en módulo', 'Lentitud generalizada', 'Caídas del sistema central',
  ],
  cambio: [
    'Actualización de servidor', 'Migración de base de datos', 'Deploy de nueva versión',
    'Cambio de configuración de red', 'Reemplazo de hardware', 'Actualización de parches de seguridad',
  ],
};

const STATUSES: CaseStatus[] = ['atendido', 'cerrado', 'derivado', 'derivado a proveedor' , 'devuelto al usuario', 'suspendido'];
const PRIORITIES: CasePriority[] = ['baja', 'media', 'alta', 'critica'];
const TYPES: CaseType[] = ['incidente', 'solicitud', 'problema', 'cambio'];

const STATUS_WEIGHTS  = [0.20, 0.25, 0.25, 0.15, 0.10, 0.05];
const TYPE_WEIGHTS    = [0.50, 0.30, 0.12, 0.08];
const PRIORITY_WEIGHTS = [0.30, 0.40, 0.22, 0.08];

function weightedPick<T>(items: T[], weights: number[], rand: () => number): T {
  const r = rand();
  let cumulative = 0;
  for (let i = 0; i < items.length; i++) {
    cumulative += weights[i];
    if (r < cumulative) return items[i];
  }
  return items[items.length - 1];
}

function pick<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

const PREFIX: Record<CaseType, string> = {
  incidente: 'INC',
  solicitud: 'SOL',
  problema:  'PRB',
  cambio:    'CAM',
};

const SLA_DAYS: Record<CasePriority, number> = {
  critica: 1,
  alta:    4,
  media:   8,
  baja:    16,
};

let cachedCases: Case[] | null = null;

export function generateMockCases(): Case[] {
  if (cachedCases) return cachedCases;

  const rand = mulberry32(42);
  const cases: Case[] = [];
  const baseDate = new Date('2025-01-01T00:00:00.000Z');
  const now = new Date('2025-12-31T00:00:00.000Z');

  for (let i = 0; i < 500; i++) {
    const tipo     = weightedPick(TYPES, TYPE_WEIGHTS, rand);
    const estado   = weightedPick(STATUSES, STATUS_WEIGHTS, rand);
    const prioridad = weightedPick(PRIORITIES, PRIORITY_WEIGHTS, rand);
    const area     = pick(AREAS, rand);
    const categoria = pick(CATEGORIAS, rand);
    const asignadoA = pick(TECNICOS, rand);
    const titulo   = pick(TITULOS_BY_TYPE[tipo], rand);

    const daysOffset = Math.floor(rand() * 330);
    const creadoEn  = addDays(baseDate, daysOffset);
    const slaDays   = SLA_DAYS[prioridad];
    const slaFecha  = addDays(creadoEn, slaDays);
    const actualizadoEn = addDays(creadoEn, Math.floor(rand() * 7));

    const cerradoEn = estado === 'cerrado'
      ? addDays(creadoEn, Math.floor(rand() * slaDays * 2) + 1)
      : undefined;

    const slaVencido = estado !== 'cerrado' && slaFecha < now;

    cases.push({
      id: String(i + 1),
      numero: `${PREFIX[tipo]}-2025-${String(i + 1).padStart(4, '0')}`,
      titulo,
      descripcion: `${titulo} reportado por el área de ${area}. Categoría: ${categoria}.`,
      estado,
      prioridad,
      tipo,
      area,
      categoria,
      asignadoA,
      creadoEn:     creadoEn.toISOString(),
      actualizadoEn: actualizadoEn.toISOString(),
      cerradoEn:    cerradoEn?.toISOString(),
      slaFecha:     slaFecha.toISOString(),
      slaVencido,
      notas: [],
    });
  }

  cachedCases = cases;
  return cases;
}
