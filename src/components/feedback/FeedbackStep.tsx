import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';

interface FeedbackStepProps {
  steps: string[];
  currentStep: number;
}

export function FeedbackStep({ steps, currentStep }: FeedbackStepProps) {
  return (
    <nav aria-label="Progress">
      <ol className="flex items-center">
        {steps.map((step, index) => (
          <li
            key={step}
            className={cn(
              "relative",
              index !== steps.length - 1 ? "pr-8 sm:pr-20" : "",
              index !== 0 ? "pl-8 sm:pl-20" : ""
            )}
          >
            {index !== 0 && (
              <div
                className="absolute top-4 left-0 -ml-px w-full h-0.5 transition-colors"
                aria-hidden="true"
                style={{ backgroundColor: index < currentStep ? '#3b82f6' : '#e5e7eb' }}
              />
            )}
            <div className="relative flex flex-col items-center group">
              <span
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center transition-colors",
                  index < currentStep
                    ? "bg-blue-600 text-white"
                    : index === currentStep
                    ? "border-2 border-blue-600 bg-white"
                    : "border-2 border-gray-300 bg-white"
                )}
              >
                {index < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </span>
              <span className="mt-2 text-sm font-medium text-gray-900">
                {step}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}