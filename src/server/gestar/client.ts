import { env } from '@/server/env';
import { generateMockRawCases } from './mock-generator';
import { gestarRawCaseSchema } from './schemas';
import { mapGestarCases } from './mappers';
import type { Case } from '@/types/domain';


async function fetchFromGestar(): Promise<Case[]> {
  if (!env.GESTAR_API_URL || !env.GESTAR_API_KEY) {
    throw new Error('GESTAR_API_URL and GESTAR_API_KEY are required when USE_MOCK=false');
  }

  const res = await fetch(`${env.GESTAR_API_URL}/casos`, {
    headers: { Authorization: `Bearer ${env.GESTAR_API_KEY}` },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Gestar API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const raws = (data.casos ?? data) as unknown[];
  const parsed = raws.map((r) => gestarRawCaseSchema.parse(r));
  return mapGestarCases(parsed);
}

export async function getAllCases(): Promise<Case[]> {
  if (env.USE_MOCK) {
    const rawMocks = generateMockRawCases();
    const parsed = rawMocks.map((r) => gestarRawCaseSchema.parse(r));
    return mapGestarCases(parsed);
  }
  return fetchFromGestar();
}
