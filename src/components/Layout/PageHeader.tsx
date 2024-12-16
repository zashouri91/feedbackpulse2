import React from 'react';
import { cn } from '../../utils/cn';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <div className={cn('mb-8 sm:flex sm:items-center sm:justify-between', className)}>
      <div className="sm:flex-auto">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        {description && <p className="mt-2 text-sm text-gray-700">{description}</p>}
      </div>
      {children && <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">{children}</div>}
    </div>
  );
}
