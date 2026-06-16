'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { CasesFilters } from '@/types/domain';

export function useCases(filters: CasesFilters = {}) {
  return useQuery({
    queryKey: ['casos', filters],
    queryFn: () => apiClient.getCases(filters),
    staleTime: 30 * 1000,
  });
}
