import { Ticket, AlertCircle, Clock, ShieldAlert } from 'lucide-react';
import { Card, CardContent } from '@/components/ui';
import { formatNumber } from '@/lib/formatters';
import type { DashboardMetrics } from '@/types/domain';

interface KPICardsProps {
  metrics: DashboardMetrics;
}

export default function KPICards({ metrics }: KPICardsProps) {
  const cards = [
    {
      label: 'Total Casos',
      value: metrics.totalCasos,
      icon: Ticket,
      color: '#2563A6',
      border: 'border-l-[#2563A6]',
      bg: 'bg-blue-50',
      iconColor: 'text-[#2563A6]',
    },
    {
      label: 'Atendidos',
      value: metrics.casosAtendidos,
      icon: AlertCircle,
      color: '#D97548',
      border: 'border-l-[#D97548]',
      bg: 'bg-orange-50',
      iconColor: 'text-[#D97548]',
    },
    {
      label: 'Cerrados',
      value: metrics.casosCerrados,
      icon: AlertCircle,
      color: '#D97545',
      border: 'border-l-[#D97545]',
      bg: 'bg-orange-50',
      iconColor: 'text-[#D97545]',
    },
    {
      label: 'Derivados',
      value: metrics.casosDerivados,
      icon: Clock,
      color: '#6B8E5A',
      border: 'border-l-[#6B8E5A]',
      bg: 'bg-green-50',
      iconColor: 'text-[#6B8E5A]',
    },
    {
      label: 'Derivados a Proveedores',
      value: metrics.casosDerivadosAProveedores,
      icon: Clock,
      color: '#6B8E5A',
      border: 'border-l-[#6B8E5A]',
      bg: 'bg-green-50',
      iconColor: 'text-[#6B8E5A]',
    },
    {
      label: 'Devueltos al Usuario',
      value: metrics.casosDevueltosAlUsuario,
      icon: ShieldAlert,
      color: '#C53030',
      border: 'border-l-[#C53030]',
      bg: 'bg-red-50',
      iconColor: 'text-[#C53030]',
    },
    {
      label: 'Suspendidos',
      value: metrics.casosSuspendidos,
      icon: Clock,
      color: '#6B8E5A',
      border: 'border-l-[#6B8E5A]',
      bg: 'bg-green-50',
      iconColor: 'text-[#6B8E5A]',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} className={`border-l-4 ${card.border}`}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {formatNumber(card.value)}
                </p>
              </div>
              <div className={`rounded-full p-3 ${card.bg}`}>
                <card.icon className={`h-6 w-6 ${card.iconColor}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
