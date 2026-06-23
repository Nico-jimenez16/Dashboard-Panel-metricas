import { env } from '@/server/env';
import { generateMockRawCases } from './mock-generator';
import { gestarRawCaseSchema } from './schemas';
import { mapGestarCases } from './mappers';
import { AppError } from '@/server/errors';
import type { Case } from '@/types/domain';


async function fetchFromGestar(): Promise<Case[]> {
  if (!env.GESTAR_API_CASES || !env.GESTAR_API_TOKEN) {
    throw new AppError(
      'GESTAR_API_CASES and GESTAR_API_TOKEN are required when USE_MOCK=false',
      'CONFIG_ERROR',
      500,
    );
  }

  const res = await fetch(env.GESTAR_API_CASES, {
    headers: { Authorization: `Bearer ${env.GESTAR_API_TOKEN}` },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new AppError(`Gestar API error: ${res.status} ${res.statusText}`, 'GESTAR_ERROR', 502);
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

export async function createCaseInGestar(payload: unknown): Promise<{ id: number }> {
  if (env.USE_MOCK) {
    return { id: Math.floor(Math.random() * 100_000) };
  }
  if (!env.GESTAR_API_CASES || !env.GESTAR_API_TOKEN) {
    throw new AppError(
      'GESTAR_API_CASES and GESTAR_API_TOKEN are required when USE_MOCK=false',
      'CONFIG_ERROR',
      500,
    );
  }
  const res = await fetch(env.GESTAR_API_CASES, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.GESTAR_API_TOKEN}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new AppError(`Gestar API error: ${res.status} ${res.statusText}`, 'GESTAR_ERROR', 502);
  }
  return res.json();
}
