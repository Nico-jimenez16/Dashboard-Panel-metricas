import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label/label';
import type { FormFieldProps } from './formField.types';

export function FormField({ htmlFor, label, required, error, className, children }: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <Label htmlFor={htmlFor} required={required}>
          {label}
        </Label>
      )}
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
