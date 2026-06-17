import type { GestarRawCase } from './schemas';
import type { Case } from '@/types/domain';

// IMPORTANTE: DATATYPE contiene credenciales en texto plano (usuario + contraseña).
// Este campo SE DESCARTA EXPLÍCITAMENTE y nunca se mapea al dominio ni se expone
// por ningún endpoint del BFF. Incluirlo en el schema Zod es solo para que .parse()
// no falle; el mapper lo ignora intencionalmente.

function stripHtml(html: string | null | undefined): string | null {
  if (!html) return null;
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() || null;
}

function toInt(val: number | null | undefined): number | null {
  if (val == null) return null;
  return Math.trunc(val);
}

export function mapGestarCase(raw: GestarRawCase): Case {
  const createdAt = raw.CREATEDDATE;
  const solvedAt = raw.SOLUTIONDATE ?? null;

  let resolutionHours: number | null = null;
  if (createdAt && solvedAt) {
    const diffMs = new Date(solvedAt).getTime() - new Date(createdAt).getTime();
    resolutionHours = Math.round((diffMs / (1000 * 60 * 60)) * 10) / 10;
  }

  const isClosed = raw.STATE.trim().toLowerCase() === 'cerrado';

  return {
    id: Math.trunc(raw.ID),
    caseNumber: Math.trunc(raw.DOC_ID),
    status: raw.STATE,
    statusId: toInt(raw.STATEID) ?? 0,
    service: raw.SERVICE?.trim() ?? null,
    serviceId: toInt(raw.SERVICEID),
    typeCode: raw.TYPE ?? null,
    typeId: toInt(raw.TYPEID),
    priority: raw.PRIORITIES ?? null,
    priorityLevel: raw.PRIORITY ?? null,
    branchOffice: raw.SUCURSAL ?? null,
    branchCode: raw.CID ?? null,
    slaArea: raw.SLA ?? null,
    slaId: toInt(raw.SLAID),
    subject: raw.TITLE ?? null,
    description: stripHtml(raw.DESCRIPTION),
    requester: raw.USER ?? null,
    requesterId: toInt(raw.USERID),
    requesterEmail: raw.USEREMAIL ?? null,
    requesterPhone: raw.USERPHONE ?? null,
    assignee: raw.RESPONSIBLE ?? null,
    assigneeId: toInt(raw.RESPONSIBLEID),
    team: raw.TEAMNAME ?? null,
    teamId: toInt(raw.TEAMID),
    teamLeader: raw.TEAMLEADER ?? null,
    teamLeaderId: toInt(raw.TEAMLEADERID),
    createdAt,
    solvedAt,
    provider: raw.PROVIDER ?? null,
    providerId: toInt(raw.PROVIDERID),
    providerService: raw.PROVIDERSERVICE ?? null,
    providerClosedAt: raw.DATECLOSEPROVIDER ?? null,
    solutionDateType: raw.TYPE_FECHASOLUCION ?? null,
    resolutionHours,
    isClosed,
    // DATATYPE: no mapeado — ver comentario arriba
  };
}

export function mapGestarCases(raws: GestarRawCase[]): Case[] {
  return raws.map(mapGestarCase);
}
