'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { CaseStatus } from '@/types/domain';

interface SavedViewsTabsProps {
  value: string;
  onValueChange: (v: string) => void;
}

const VIEWS: { value: string; label: string }[] = [
  { value: 'todos',    label: 'Todos' },
  { value: 'atendido',  label: 'Atendidos' },
  { value: 'cerrado',  label: 'Cerrados' },
  { value: 'derivado',  label: 'Derivados' },
  { value: 'derivado a proveedor',  label: 'Derivados a Proveedor' },
  { value: 'devuelto al usuario',  label: 'Devueltos al Usuario' },
  { value: 'suspendido',  label: 'Suspendidos' },
];

export default function SavedViewsTabs({ value, onValueChange }: SavedViewsTabsProps) {
  return (
    <Tabs value={value} onValueChange={onValueChange}>
      <TabsList>
        {VIEWS.map((v) => (
          <TabsTrigger key={v.value} value={v.value}>
            {v.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
