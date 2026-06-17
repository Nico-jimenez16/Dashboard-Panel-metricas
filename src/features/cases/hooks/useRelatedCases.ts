import { useQuery } from '@tanstack/react-query';
import type { Case } from '@/types/domain';

async function fetchRelatedCases(id: string): Promise<Case[]> {
  const res = await fetch(`/api/casos/${id}/relacionados`);
  if (!res.ok) throw new Error('Error al cargar casos relacionados');
  return res.json();
}

export function useRelatedCases(id: string) {
  return useQuery({
    queryKey: ['related-cases', id],
    queryFn: () => fetchRelatedCases(id),
    staleTime: 60_000,
  });
}
