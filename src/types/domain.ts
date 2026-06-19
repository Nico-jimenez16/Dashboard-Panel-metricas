export interface Case {
  id: number;
  caseNumber: number;
  status: string;
  statusId: number;
  service: string | null;
  serviceId: number | null;
  typeCode: string | null;
  typeId: number | null;
  priority: string | null;
  priorityLevel: string | null;
  branchOffice: string | null;
  branchCode: string | null;
  slaArea: string | null;
  slaId: number | null;
  subject: string | null;
  description: string | null;
  requester: string | null;
  requesterId: number | null;
  requesterEmail: string | null;
  requesterPhone: string | null;
  assignee: string | null;
  assigneeId: number | null;
  team: string | null;
  teamId: number | null;
  teamLeader: string | null;
  teamLeaderId: number | null;
  createdAt: string;
  solvedAt: string | null;
  provider: string | null;
  providerId: number | null;
  providerService: string | null;
  providerClosedAt: string | null;
  solutionDateType: string | null;
  // Derived fields
  resolutionHours: number | null;
  isClosed: boolean;
}

export interface MonthlyData {
  mes: string;
  recibidos: number;
  cerrados: number;
}

export interface StatusCount {
  estado: string;
  cantidad: number;
}

export interface TypeCount {
  tipo: string;
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
  porServicio: TypeCount[];
  porSucursal: AreaStats[];
}

export interface CasesListResponse {
  casos: Case[];
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
}

export interface CasesFilters {
  status?: string;
  priority?: string;
  slaArea?: string;
  busqueda?: string;
  pagina?: number;
  porPagina?: number;
}
