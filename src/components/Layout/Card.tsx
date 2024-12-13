import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn(
      "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden",
      className
    )}>
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ 
  children, 
  className 
}: CardProps) {
  return (
    <div className={cn(
      "px-6 py-4 border-b border-gray-200",
      className
    )}>
      {children}
    </div>
  );
};

Card.Body = function CardBody({ 
  children, 
  className 
}: CardProps) {
  return (
    <div className={cn("p-6", className)}>
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({ 
  children, 
  className 
}: CardProps) {
  return (
    <div className={cn(
      "px-6 py-4 border-t border-gray-200 bg-gray-50",
      className
    )}>
      {children}
    </div>
  );
};