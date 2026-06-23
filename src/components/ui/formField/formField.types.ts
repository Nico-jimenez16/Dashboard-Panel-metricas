import type { ReactNode } from 'react';

export interface FormFieldProps {
  htmlFor?: string;
  label?: ReactNode;
  required?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
}
