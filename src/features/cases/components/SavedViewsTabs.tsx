'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SavedViewsTabsProps {
  value: string;
  onValueChange: (v: string) => void;
}

const VIEWS: { value: string; label: string }[] = [
  { value: 'todos',                  label: 'Todos' },
  { value: 'Atendido',               label: 'Atendidos' },
  { value: 'Cerrado',                label: 'Cerrados' },
  { value: 'Derivado',               label: 'Derivados' },
  { value: 'Derivado a proveedor',   label: 'Derivados a Proveedor' },
  { value: 'Devuelto al usuario',    label: 'Devueltos al Usuario' },
  { value: 'Suspendido',             label: 'Suspendidos' },
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
