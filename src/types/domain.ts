export type CaseStatus = 'atendido' | 'cerrado' | 'derivado' | 'derivado a proveedor' | 'devuelto al usuario' | 'suspendido';
export type CasePriority = 'baja' | 'media' | 'alta' | 'critica';
export type CaseType = 'incidente' | 'solicitud' | 'problema' | 'cambio';

export interface Case {
  id: string;
  numero: string;
  titulo: string;
  descripcion: string;
  estado: CaseStatus;
  prioridad: CasePriority;
  tipo: CaseType;
  area: string;
  categoria: string;
  asignadoA: string;
  creadoEn: string;
  actualizadoEn: string;
  cerradoEn?: string;
  slaFecha: string;
  slaVencido: boolean;
  notas: string[];
}

export interface MonthlyData {
  mes: string;
  recibidos: number;
  cerrados: number;
}

export interface StatusCount {
  estado: CaseStatus;
  cantidad: number;
}

export interface TypeCount {
  tipo: CaseType;
  cantidad: number;
}

export interface AreaStats {
  area: string;
  total: number;
  cerrados: number;
  tasaCierre: number;
}

export interface DashboardMetrics {
  totalCasos: number;
  casosAtendidos: number;
  casosCerrados: number;
  casosDerivados: number;
  casosDerivadosAProveedores: number;
  casosDevueltosAlUsuario: number;
  casosSuspendidos: number;
  slaVencidos: number;
  tendenciaMensual: MonthlyData[];
  porEstado: StatusCount[];
  porTipo: TypeCount[];
  porArea: AreaStats[];
}

export interface CasesListResponse {
  casos: Case[];
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
}

export interface CasesFilters {
  estado?: CaseStatus;
  prioridad?: CasePriority;
  tipo?: CaseType;
  area?: string;
  busqueda?: string;
  pagina?: number;
  porPagina?: number;
}
