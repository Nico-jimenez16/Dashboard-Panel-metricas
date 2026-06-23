'use client';

import { Header } from '@/components/layout';
import { KPICards, MonthlyTrendChart, StatusDonutChart, CasesByServiceChart, CasesByBranchOfficeTable } from '@/features/dashboard/components';
import { useDashboardMetrics } from '@/features/dashboard/hooks/useDashboardMetrics';
import { CreateCasePopup } from '@/features/cases/components/CreateCasePopup';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboardMetrics();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0F4C3A]" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-red-500">Error al cargar las métricas.</p>
      </div>
    );
  }

  return (
    <>
      <Header
        title="Dashboard"
        subtitle="Resumen de incidentes IT — Banco de Córdoba"
        onCreateCase={() => setIsCreateOpen(true)}
      />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <KPICards metrics={data} />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <MonthlyTrendChart data={data.tendenciaMensual} />
          </div>
            <StatusDonutChart data={data.porEstado} total={data.totalCasos} />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <CasesByServiceChart data={data.porServicio} />
          <CasesByBranchOfficeTable data={data.porSucursal} />
        </div>
      </main>
      <CreateCasePopup
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </>
  );
}
