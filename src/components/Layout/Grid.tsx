import React from 'react';
import { cn } from '../../utils/cn';

interface GridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Grid({ children, cols = 1, gap = 'md', className }: GridProps) {
  return (
    <div
      className={cn(
        'grid',
        {
          'sm:grid-cols-2 lg:grid-cols-3': cols === 3,
          'sm:grid-cols-2 lg:grid-cols-4': cols === 4,
          'sm:grid-cols-2': cols === 2,
          'gap-4': gap === 'sm',
          'gap-6': gap === 'md',
          'gap-8': gap === 'lg',
        },
        className
      )}
    >
      {children}
    </div>
  );
}
