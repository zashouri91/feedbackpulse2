import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
  duration?: number;
}

export function Toast({ type, message, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={cn('fixed bottom-4 right-4 max-w-sm animate-slide-up rounded-lg p-4 shadow-lg', {
        'border border-green-200 bg-green-50 text-green-800': type === 'success',
        'border border-red-200 bg-red-50 text-red-800': type === 'error',
        'border border-blue-200 bg-blue-50 text-blue-800': type === 'info',
        'border border-yellow-200 bg-yellow-50 text-yellow-800': type === 'warning',
      })}
    >
      <div className="flex items-start">
        <div className="flex-1">{message}</div>
        <button onClick={onClose} className="ml-4 text-gray-400 hover:text-gray-500">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
