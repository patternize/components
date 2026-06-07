import * as React from 'react';
import { cn } from '@/lib/utils';

export const Badge = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'inline-flex items-center rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground',
      className
    )}
    {...props}
  />
);
