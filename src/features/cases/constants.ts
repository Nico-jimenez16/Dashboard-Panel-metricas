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

// Hex equivalentes de STATUS_VARIANT (mismos tokens que usa Badge en globals.css),
// para usos que necesitan un color plano en vez de una clase Tailwind (ej. gráficos).
export const STATUS_COLOR: Record<string, string> = {
  Atendido:               '#2563A6', // azul-kpi (variant info)
  Cerrado:                '#6B8E5A', // verde-claro-kpi (variant success)
  Derivado:               '#9CA3AF', // gris (variant secondary)
  'Derivado a proveedor': '#9CA3AF', // gris (variant secondary)
  'Devuelto al usuario':  '#D97706', // amarillo-curso (variant warning)
  Suspendido:             '#9CA3AF', // gris (variant secondary)
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
