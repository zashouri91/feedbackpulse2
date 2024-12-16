import React from 'react';
import { Star, SmilePlus } from 'lucide-react';
import { cn } from '../../utils/cn';

interface RatingStepProps {
  style?: 'stars' | 'smileys' | 'numbers';
  value?: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
}

export function RatingStep({ style = 'smileys', value, onChange, disabled }: RatingStepProps) {
  const ratings = [1, 2, 3, 4, 5];

  const renderRating = (rating: number) => {
    switch (style) {
      case 'stars':
        return (
          <button
            key={rating}
            onClick={() => !disabled && onChange(rating)}
            className={cn(
              'transition-colors',
              value && rating <= value ? 'text-yellow-400' : 'text-gray-300',
              disabled ? 'cursor-not-allowed opacity-50' : 'hover:text-yellow-400'
            )}
            disabled={disabled}
            aria-label={`Rate ${rating} stars`}
          >
            <Star className="h-10 w-10" />
          </button>
        );

      case 'numbers':
        return (
          <button
            key={rating}
            onClick={() => !disabled && onChange(rating)}
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-full border-2 text-lg font-medium transition-colors',
              value === rating
                ? 'border-blue-500 bg-blue-50 text-blue-600'
                : 'border-gray-300 text-gray-600',
              disabled ? 'cursor-not-allowed opacity-50' : 'hover:border-blue-400 hover:bg-blue-50'
            )}
            disabled={disabled}
            aria-label={`Rate ${rating}`}
          >
            {rating}
          </button>
        );

      default: // smileys
        return (
          <button
            key={rating}
            onClick={() => !disabled && onChange(rating)}
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-full transition-colors',
              value === rating ? 'bg-opacity-100' : 'bg-opacity-10',
              rating <= 2
                ? 'bg-red-500 text-red-500'
                : rating === 3
                  ? 'bg-yellow-500 text-yellow-500'
                  : 'bg-green-500 text-green-500',
              disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-opacity-20'
            )}
            disabled={disabled}
            aria-label={`Rate ${rating}`}
          >
            <SmilePlus className="h-6 w-6" />
          </button>
        );
    }
  };

  return (
    <div className="text-center">
      <h2 className="mb-8 text-2xl font-semibold text-gray-900">How was your experience?</h2>
      <div className="flex justify-center gap-4">{ratings.map(renderRating)}</div>
    </div>
  );
}
