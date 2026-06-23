import type { GestarRawCase } from './schemas';

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

function weightedPick<T>(items: T[], weights: number[], rand: () => number): T {
  const r = rand();
  let cumulative = 0;
  for (let i = 0; i < items.length; i++) {
    cumulative += weights[i];
    if (r < cumulative) return items[i];
  }
  return items[items.length - 1];
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

const SLA_AREAS = [
  'MICROINFORMATICA',
];

const SERVICES = [
  'CAMBIO DE EQUIPO',
  'INSTALACION DE SOFTWARE',
  'RESETEO DE CONTRASENA',
  'CONFIGURACION DE RED',
  'SOPORTE DE IMPRESORA',
  'ALTA DE USUARIO',
  'DESBLOQUEO DE USUARIOS',
  'SOPORTE DE CORREO',
  'ACCESO VPN',
  'BACKUP Y RECUPERACION',
  'CAMBIO DE CONTRASENA',
  'INSTALACION DE IMPRESORA',
  'CONFIGURACION DE EQUIPO',
  'SOPORTE SISTEMA OPERATIVO',
];

const STATES = [
  'Cerrado',
  'Atendido',
  'Derivado',
  'Derivado a proveedor',
  'Devuelto al usuario',
  'Suspendido',
];
const STATE_WEIGHTS = [0.25, 0.20, 0.25, 0.15, 0.10, 0.05];

const PRIORITIES_VALUES = ['Critica', 'Alta', 'Media', 'Baja'];
const PRIORITY_LEVELS   = ['1', '2', '3', '4'];
const PRIORITY_WEIGHTS  = [0.08, 0.22, 0.40, 0.30];

const SUCURSALES = [
  '001 - MATRIZ CASA CENTRAL',
  '002 - CORDOBA CENTRO',
  '010 - VILLA MARIA',
  '015 - RIO CUARTO',
  '020 - SAN FRANCISCO',
  '025 - BELL VILLE',
  '030 - VILLA DOLORES',
  '035 - ALTA GRACIA',
  '040 - JESUS MARIA',
  '045 - COSQUIN',
  '050 - VILLA CARLOS PAZ',
  '055 - LA FALDA',
  '060 - DEAN FUNES',
  '065 - CRUZ DEL EJE',
  '070 - ARROYITO',
  '075 - VILLA GENERAL BELGRANO',
  '080 - MINA CLAVERO',
  '085 - LA CALERA',
  '090 - RIO TERCERO',
  '095 - RIO SEGUNDO',
  '345 - LABOULAYE',
  '350 - MARCOS JUAREZ',
  '355 - ONCATIVO',
  '360 - LAS VARILLAS',
  '365 - MORTEROS',
];

const RESPONSIBLES = [
  'Jimenez, N.',
  'Díaz, A.',
  'Artura, G.',
  'Pabon, Y.',
  'Ojeda, P.',
  'Vega, M.',
  'Pérez, E.',
  'Lizio, C.',
  'Acrich, J.',
];

const REQUESTERS = [
  'Garcia, M.',
  'Lopez, S.',
  'Martinez, P.',
  'Rodriguez, A.',
  'Sanchez, C.',
  'Fernandez, L.',
  'Gonzalez, J.',
  'Ramirez, D.',
  'Flores, V.',
  'Morales, E.',
];

const TEAMS = [
  'Mesa de Ayuda',
  'Infraestructura',
  'Redes',
  'Seguridad',
  'Desarrollo',
];

const PROVIDERS = [
  'HP ARGENTINA',
  'LENOVO SA',
  'CISCO SYSTEMS',
  'MICROSOFT LATAM',
  null,
  null,
  null,
];

const TITLES_BY_SERVICE: Record<string, string[]> = {
  'CAMBIO DE EQUIPO': ['Cambio de notebook por falla de hardware', 'Reemplazo de PC de escritorio', 'Sustitución de monitor dañado'],
  'INSTALACION DE SOFTWARE': ['Instalación de Microsoft Office', 'Instalación de antivirus corporativo', 'Deploy de aplicación interna'],
  'RESETEO DE CONTRASENA': ['Reseteo de contraseña de usuario de dominio', 'Desbloqueo y reseteo de cuenta'],
  'CONFIGURACION DE RED': ['Configuración de adaptador de red', 'Problema de conectividad en sucursal', 'Alta de puerto en switch'],
  'SOPORTE DE IMPRESORA': ['Impresora no responde a trabajos de impresión', 'Error de papel en impresora de red', 'Instalación de driver de impresora'],
  'ALTA DE USUARIO': ['Alta de usuario nuevo en Active Directory', 'Creación de cuenta de correo corporativo'],
  'DESBLOQUEO DE USUARIOS': ['Desbloqueo de cuenta de usuario bloqueada', 'Usuario sin acceso al sistema'],
  'SOPORTE DE CORREO': ['Error al enviar correos desde Outlook', 'Configuración de cuenta de correo en dispositivo móvil'],
  'ACCESO VPN': ['Solicitud de acceso VPN corporativa', 'Error al conectar cliente VPN'],
  'BACKUP Y RECUPERACION': ['Recuperación de archivos borrados accidentalmente', 'Verificación de backup fallido'],
  'CAMBIO DE CONTRASENA': ['Cambio periódico de contraseña de dominio', 'Cambio de contraseña de sistema'],
  'INSTALACION DE IMPRESORA': ['Instalación y configuración de impresora en red'],
  'CONFIGURACION DE EQUIPO': ['Configuración inicial de equipo nuevo', 'Reconfiguración de perfil de usuario'],
  'SOPORTE SISTEMA OPERATIVO': ['Error de actualización de Windows', 'Pantalla azul al iniciar sesión'],
};

let cachedRawCases: GestarRawCase[] | null = null;

export function generateMockRawCases(): GestarRawCase[] {
  if (cachedRawCases) return cachedRawCases;

  const rand = mulberry32(42);
  const cases: GestarRawCase[] = [];
  const baseDate = new Date('2025-01-01T00:00:00.000Z');

  for (let i = 0; i < 500; i++) {
    const state       = weightedPick(STATES, STATE_WEIGHTS, rand);
    const priorityIdx = weightedPick([0, 1, 2, 3], PRIORITY_WEIGHTS, rand);
    const slaArea     = pick(SLA_AREAS, rand);
    const service     = pick(SERVICES, rand);
    const sucursal    = pick(SUCURSALES, rand);
    const responsible = pick(RESPONSIBLES, rand);
    const requester   = pick(REQUESTERS, rand);
    const team        = pick(TEAMS, rand);
    const provider    = pick(PROVIDERS, rand);

    const titles = TITLES_BY_SERVICE[service] ?? [`Solicitud de ${service.toLowerCase()}`];
    const title  = pick(titles, rand);

    const daysOffset  = Math.floor(rand() * 330);
    const createdDate = addDays(baseDate, daysOffset);

    const isClosed = state === 'Cerrado';
    const solutionDate = isClosed
      ? addDays(createdDate, Math.floor(rand() * 14) + 1).toISOString()
      : null;

    const responsibleId = 1000 + Math.floor(rand() * 50);
    const teamId        = 10 + Math.floor(rand() * TEAMS.length);
    const typeCode      = `BCN${Math.floor(rand() * 900) + 100}`;

    cases.push({
      ID:                 422744 + i + rand() * 0.9,
      DOC_ID:             Math.trunc(422744 + i),
      STATEID:            10 + priorityIdx,
      STATE:              state,
      CREATEDDATE:        createdDate.toISOString(),
      SLA:                slaArea,
      SLAID:              priorityIdx + 1,
      SERVICE:            service,
      SERVICEID:          100 + Math.trunc(rand() * 50),
      TYPE:               typeCode,
      TYPEID:             Math.trunc(rand() * 20) + 1,
      SUCURSAL:           sucursal,
      CID:                sucursal.split(' - ')[0],
      TITLE:              title,
      DESCRIPTION:        `<p>${title} reportado en sucursal ${sucursal}. Servicio: ${service}.</p>`,
      DATATYPE:           null,
      PRIORITY:           PRIORITY_LEVELS[priorityIdx],
      PRIORITIES:         PRIORITIES_VALUES[priorityIdx],
      USER:               requester,
      USERID:             2000 + Math.trunc(rand() * 200),
      USERPHONE:          null,
      USEREMAIL:          `${requester.split(',')[0].toLowerCase().replace(/\s/g, '')}@empresa.com`,
      RESPONSIBLE:        responsible,
      RESPONSIBLEID:      responsibleId,
      TEAMNAME:           team,
      TEAMID:             teamId,
      TEAMLEADER:         pick(RESPONSIBLES, rand),
      TEAMLEADERID:       responsibleId + 1,
      SOLUTIONDATE:       solutionDate,
      PROVIDER:           provider,
      PROVIDERID:         provider ? 500 + Math.trunc(rand() * 10) : null,
      PROVIDERSERVICE:    provider ? service : null,
      DATECLOSEPROVIDER:  isClosed && provider ? solutionDate : null,
      TYPE_FECHASOLUCION: isClosed ? 'Real' : null,
    });
  }

  cachedRawCases = cases;
  return cases;
}
