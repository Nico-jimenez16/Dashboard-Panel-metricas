import * as React from 'react';
import { cn } from '@/lib/utils';
import type { LabelProps } from './label.types';

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn('text-sm font-medium text-gray-700', className)}
      {...props}
    >
      {children}
      {required && (
        <span aria-hidden="true" className="ml-0.5 text-red-500">
          *
        </span>
      )}
    </label>
  ),
);
Label.displayName = 'Label';

export { Label };
