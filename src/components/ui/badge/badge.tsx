import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default:     'bg-verde-principal text-white',
        secondary:   'bg-gray-100 text-gray-700',
        outline:     'border border-gray-300 text-gray-700',
        destructive: 'bg-rojo-sla text-white',
        warning:     'bg-amarillo-curso text-white',
        success:     'bg-verde-claro-kpi text-white',
        info:        'bg-azul-kpi text-white',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
