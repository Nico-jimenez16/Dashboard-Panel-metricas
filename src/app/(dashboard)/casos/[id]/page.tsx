'use client';

import { use } from 'react';
import { useCase } from '@/features/cases/hooks/useCase';
import { CaseHeader } from '@/features/cases/components/CaseHeader';
import CaseBodyLayout from '@/features/cases/components/CaseBodyLayout';
import { Loader2 } from 'lucide-react';

interface CasoPageProps {
  params: Promise<{ id: string }>;
}

export default function CasoPage({ params }: CasoPageProps) {
  const { id } = use(params);
  const { data: caso, isLoading, error } = useCase(id);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0F4C3A]" />
      </div>
    );
  }

  if (error || !caso) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-red-500">
          {error?.message ?? 'Caso no encontrado.'}
        </p>
      </div>
    );
  }

  return (
    <>
      <CaseHeader caso={caso} variant="page" />
      <main className="flex-1 overflow-y-auto p-6">
        <CaseBodyLayout caso={caso} />
      </main>
    </>
  );
}
