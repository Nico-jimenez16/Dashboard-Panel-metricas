import { z } from 'zod';

export const caseStatusSchema = z.enum(['atendido','cerrado', 'derivado', 'derivado a proveedor', 'devuelto al usuario', 'suspendido']);
export const casePrioritySchema = z.enum(['baja', 'media', 'alta', 'critica']);
export const caseTypeSchema = z.enum(['incidente', 'solicitud', 'problema', 'cambio']);

export const caseSchema = z.object({
  id: z.string(),
  numero: z.string(),
  titulo: z.string(),
  descripcion: z.string(),
  estado: caseStatusSchema,
  prioridad: casePrioritySchema,
  tipo: caseTypeSchema,
  area: z.string(),
  categoria: z.string(),
  asignadoA: z.string(),
  creadoEn: z.string().datetime(),
  actualizadoEn: z.string().datetime(),
  cerradoEn: z.string().datetime().optional(),
  slaFecha: z.string().datetime(),
  slaVencido: z.boolean(),
  notas: z.array(z.string()),
});

export const casesFiltersSchema = z.object({
  estado: caseStatusSchema.optional(),
  prioridad: casePrioritySchema.optional(),
  tipo: caseTypeSchema.optional(),
  area: z.string().optional(),
  busqueda: z.string().optional(),
  pagina: z.coerce.number().int().positive().default(1),
  porPagina: z.coerce.number().int().min(1).max(100).default(20),
});
