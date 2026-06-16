import type { Case } from '@/types/domain';

// In a real integration this would transform Gestar's raw API response
// to our domain model. With mock data the structure is already normalized.
export function mapGestarCase(raw: Case): Case {
  return raw;
}

export function mapGestarCases(raws: Case[]): Case[] {
  return raws.map(mapGestarCase);
}
