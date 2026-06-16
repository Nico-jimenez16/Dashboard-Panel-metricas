import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default:     'bg-[#0F4C3A] text-white',
        secondary:   'bg-gray-100 text-gray-700',
        outline:     'border border-gray-300 text-gray-700',
        destructive: 'bg-[#C53030] text-white',
        warning:     'bg-[#D97706] text-white',
        success:     'bg-[#6B8E5A] text-white',
        info:        'bg-[#2563A6] text-white',
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
