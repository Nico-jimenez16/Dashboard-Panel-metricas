'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { TypeCount } from '@/types/domain';

// Paleta cíclica — las claves de tipo son ahora valores de slaArea (dinámicos)
const PALETTE = [
  '#D97548',
  '#2563A6',
  '#C53030',
  '#6B8E5A',
  '#9CA3AF',
  '#374151',
  '#D97706',
  '#7C3AED',
];

interface CasesByTypeChartProps {
  data: TypeCount[];
}

export default function CasesByTypeChart({ data }: CasesByTypeChartProps) {
  const chartData = data.map((d, i) => ({
    tipo: d.tipo,
    cantidad: d.cantidad,
    color: PALETTE[i % PALETTE.length],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Casos por Área SLA</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: '#6B7280' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="tipo"
              tick={{ fontSize: 11, fill: '#374151' }}
              tickLine={false}
              axisLine={false}
              width={140}
            />
            <Tooltip
              contentStyle={{
                border: '1px solid #E5E7EB',
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(value) => [value, 'Casos']}
            />
            <Bar dataKey="cantidad" radius={[0, 4, 4, 0]} maxBarSize={28}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
