import * as React from 'react';
import { cn } from '@/lib/utils';
import { SPACING } from '../spacingTokens';

const PADDING_CLASS: Record<SPACING, string> = {
  [SPACING.NONE]: 'p-0',
  [SPACING.XS]: 'p-1',
  [SPACING.SM]: 'p-2',
  [SPACING.MD]: 'p-4',
  [SPACING.LG]: 'p-6',
  [SPACING.XL]: 'p-8',
};

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-xl border border-gray-200 bg-white shadow-sm', className)}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: SPACING;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, padding = SPACING.LG, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5', PADDING_CLASS[padding], className)}
      {...props}
    />
  ),
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
  ),
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-gray-500', className)} {...props} />
  ),
);
CardDescription.displayName = 'CardDescription';

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: SPACING;
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, padding = SPACING.LG, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(PADDING_CLASS[padding], 'pt-0', className)}
      {...props}
    />
  ),
);
CardContent.displayName = 'CardContent';

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: SPACING;
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, padding = SPACING.LG, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center', PADDING_CLASS[padding], 'pt-0', className)}
      {...props}
    />
  ),
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
