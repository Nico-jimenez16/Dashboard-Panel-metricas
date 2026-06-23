import { z } from 'zod';

export const createCaseSchema = z.object({
  titulo: z.string().min(3, 'Mínimo 3 caracteres').max(200, 'Máximo 200 caracteres'),
  usuario: z.string().min(1, 'Requerido').max(50),
  sucursal_cid: z
    .object({ cid: z.number(), descripcion: z.string() })
    .nullable()
    .refine((v) => v !== null, 'Seleccionar una sucursal'),
  gerencia: z.string().min(1, 'Requerido'),
  servicio: z
    .object({ code: z.number(), label: z.string() })
    .nullable()
    .refine((v) => v !== null, 'Seleccionar un servicio'),
  causa_raiz: z
    .object({ id: z.number(), label: z.string(), path: z.array(z.string()) })
    .nullable()
    .refine((v) => v !== null, 'Seleccionar una causa raíz'),
  nro_puesto: z.string().min(1, 'Requerido'),
  descripcion: z.string().min(10, 'Mínimo 10 caracteres').max(2000, 'Máximo 2000 caracteres'),
});

export type CreateCasePayload = z.infer<typeof createCaseSchema>;
