import { z } from 'zod';

export const gestarRawCaseSchema = z.object({
  ID:                   z.number(),
  DOC_ID:               z.number(),
  STATEID:              z.number().nullable(),
  STATE:                z.string(),
  CREATEDDATE:          z.string(),
  SLA:                  z.string().nullable(),
  SLAID:                z.number().nullable(),
  SERVICE:              z.string().nullable(),
  SERVICEID:            z.number().nullable(),
  TYPE:                 z.string().nullable(),
  TYPEID:               z.number().nullable(),
  SUCURSAL:             z.string().nullable(),
  CID:                  z.string().nullable(),
  TITLE:                z.string().nullable(),
  DESCRIPTION:          z.string().nullable(),
  // DATATYPE contiene credenciales en texto plano — se incluye para que .parse() no falle
  // pero se descarta explícitamente en el mapper y nunca se expone
  DATATYPE:             z.string().nullable(),
  PRIORITY:             z.string().nullable(),
  PRIORITIES:           z.string().nullable(),
  USER:                 z.string().nullable(),
  USERID:               z.number().nullable(),
  USERPHONE:            z.string().nullable(),
  USEREMAIL:            z.string().nullable(),
  RESPONSIBLE:          z.string().nullable(),
  RESPONSIBLEID:        z.number().nullable(),
  TEAMNAME:             z.string().nullable(),
  TEAMID:               z.number().nullable(),
  TEAMLEADER:           z.string().nullable(),
  TEAMLEADERID:         z.number().nullable(),
  SOLUTIONDATE:         z.string().nullable(),
  PROVIDER:             z.string().nullable(),
  PROVIDERID:           z.number().nullable(),
  PROVIDERSERVICE:      z.string().nullable(),
  DATECLOSEPROVIDER:    z.string().nullable(),
  TYPE_FECHASOLUCION:   z.string().nullable(),
});

export type GestarRawCase = z.infer<typeof gestarRawCaseSchema>;

export const casesFiltersSchema = z.object({
  status:    z.string().optional(),
  priority:  z.string().optional(),
  slaArea:   z.string().optional(),
  busqueda:  z.string().optional(),
  pagina:    z.coerce.number().int().positive().default(1),
  porPagina: z.coerce.number().int().min(1).max(100).default(20),
});
