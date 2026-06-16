'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['metricas', 'dashboard'],
    queryFn: () => apiClient.getDashboardMetrics(),
    staleTime: 60 * 1000,
  });
}
