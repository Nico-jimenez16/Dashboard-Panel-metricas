import type { Case } from '@/types/domain';

export interface CasesTableProps {
  data: Case[];
  isLoading: boolean;
  error: string | null;
}
