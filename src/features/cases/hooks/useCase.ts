'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useCase(id: string) {
  return useQuery({
    queryKey: ['casos', id],
    queryFn: () => apiClient.getCase(id),
    staleTime: 30 * 1000,
    enabled: Boolean(id),
  });
}
