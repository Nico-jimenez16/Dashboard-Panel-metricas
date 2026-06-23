'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

interface LoginCredentials {
  loginName: string;
  password: string;
}

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ loginName, password }: LoginCredentials) =>
      apiClient.login(loginName, password),
    onSuccess: ({ token }) => {
      sessionStorage.setItem('gestar_token', token);
      router.push('/dashboard');
    },
  });
}
