import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm',
        className
      )}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ children, className }: CardProps) {
  return <div className={cn('border-b border-gray-200 px-6 py-4', className)}>{children}</div>;
};

Card.Body = function CardBody({ children, className }: CardProps) {
  return <div className={cn('p-6', className)}>{children}</div>;
};

Card.Footer = function CardFooter({ children, className }: CardProps) {
  return (
    <div className={cn('border-t border-gray-200 bg-gray-50 px-6 py-4', className)}>{children}</div>
  );
};
