'use client';

import { use } from 'react';
import { useCase } from '@/features/cases/hooks/useCase';
import CaseDetailHeader from '@/features/cases/components/CaseDetailHeader';
import CaseInfoTabs from '@/features/cases/components/CaseInfoTabs';
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
      <CaseDetailHeader caso={caso} />
      <main className="flex-1 overflow-y-auto p-6">
        <CaseInfoTabs caso={caso} />
      </main>
    </>
  );
}
