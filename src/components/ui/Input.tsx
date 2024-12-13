import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { FormField } from './FormField';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  required,
  multiline,
  rows = 3,
  className,
  ...props
}, ref) => {
  const inputClassName = cn(
    "block w-full rounded-md shadow-sm transition-colors",
    "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
    error && "border-red-300 focus:border-red-500 focus:ring-red-500",
    className
  );

  return (
    <FormField label={label} error={error} required={required}>
      {multiline ? (
        <textarea
          {...props as any}
          className={inputClassName}
          rows={rows}
        />
      ) : (
        <input
          ref={ref}
          {...props}
          className={inputClassName}
        />
      )}
    </FormField>
  );
});