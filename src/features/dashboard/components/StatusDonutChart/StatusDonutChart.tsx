'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { StatusCount } from '@/types/domain';

const STATUS_COLORS: Record<string, string> = {
  Atendido:              '#D97548',
  Cerrado:               '#D97706',
  Derivado:              '#6B8E5A',
  'Derivado a proveedor': '#9CA3AF',
  'Devuelto al usuario': '#4B5563',
  Suspendido:            '#374151',
};

const STATUS_LABELS: Record<string, string> = {
  Atendido:              'Atendido',
  Cerrado:               'Cerrado',
  Derivado:              'Derivado',
  'Derivado a proveedor': 'Derivado a Proveedor',
  'Devuelto al usuario': 'Devuelto al Usuario',
  Suspendido:            'Suspendido',
};

const FALLBACK_COLORS = [
  '#6B8E5A', '#D97548', '#2563A6', '#C53030', '#9CA3AF', '#374151',
];

interface StatusDonutChartProps {
  data: StatusCount[];
  total: number;
}

export default function StatusDonutChart({ data, total }: StatusDonutChartProps) {
  const chartData = data.map((d, i) => ({
    name: STATUS_LABELS[d.estado] ?? d.estado,
    value: d.cantidad,
    color: STATUS_COLORS[d.estado] ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución por Estado</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative">
          <ResponsiveContainer width={220} height={220}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  border: '1px solid #E5E7EB',
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-gray-900">{total}</span>
            <span className="text-xs text-gray-400">casos</span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          {chartData.map((d) => (
            <div key={d.name} className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full shrink-0"
                style={{ background: d.color }}
              />
              <span className="text-gray-600">{d.name}</span>
              <span className="ml-auto font-medium text-gray-900">{d.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
