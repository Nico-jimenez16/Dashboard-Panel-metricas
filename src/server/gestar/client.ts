import { env } from '@/server/env';
import { generateMockCases } from './mock-generator';
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
  return mapGestarCases(data.casos ?? data);
}

export async function getAllCases(): Promise<Case[]> {
  if (env.USE_MOCK) {
    return generateMockCases();
  }
  return fetchFromGestar();
}
