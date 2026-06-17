import type { BadgeProps } from '@/components/ui';

export const STATUS_VARIANT: Record<string, BadgeProps['variant']> = {
  Atendido:               'info',
  Cerrado:                'success',
  Derivado:               'secondary',
  'Derivado a proveedor': 'secondary',
  'Devuelto al usuario':  'warning',
  Suspendido:             'secondary',
};

export const STATUS_LABEL: Record<string, string> = {
  Atendido:               'Atendido',
  Cerrado:                'Cerrado',
  Derivado:               'Derivado',
  'Derivado a proveedor': 'Derivado a Proveedor',
  'Devuelto al usuario':  'Devuelto al Usuario',
  Suspendido:             'Suspendido',
};

export const PRIORITY_VARIANT: Record<string, BadgeProps['variant']> = {
  '1': 'destructive',
  '2': 'warning',
  '3': 'secondary',
  '4': 'outline',
};

export const PRIORITY_LABEL: Record<string, string> = {
  '1': 'Crítica',
  '2': 'Alta',
  '3': 'Normal',
  '4': 'Baja',
};
