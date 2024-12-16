import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { FormField } from './FormField';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, required, className, children, ...props }, ref) => {
    return (
      <FormField label={label} error={error} required={required}>
        <select
          ref={ref}
          className={cn(
            'block w-full rounded-md shadow-sm transition-colors',
            'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
            error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        >
          {children}
        </select>
      </FormField>
    );
  }
);
