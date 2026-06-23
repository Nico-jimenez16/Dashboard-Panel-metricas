'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { CreateCasePayload } from '@/components/ui/forms/CreateCaseForm/CreateCaseForm.schema';

export function useCreateCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCasePayload) => apiClient.createCase(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['casos'] });
    },
  });
}
