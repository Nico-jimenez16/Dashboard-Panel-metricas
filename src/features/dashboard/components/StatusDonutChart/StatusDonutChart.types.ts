import type { StatusCount } from '@/types/domain';

export interface StatusDonutChartProps {
  data: StatusCount[];
  total: number;
}
