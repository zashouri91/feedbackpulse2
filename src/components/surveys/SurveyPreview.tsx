import React from 'react';
import { Star, SmilePlus, Hash } from 'lucide-react';
import type { Survey, Question } from '../../types/survey';

interface SurveyPreviewProps {
  survey: Survey;
  ratingStyle?: 'stars' | 'smileys' | 'numbers';
}

export function SurveyPreview({ survey, ratingStyle = 'smileys' }: SurveyPreviewProps) {
  const renderRatingQuestion = (question: Question) => {
    const ratings = [1, 2, 3, 4, 5];
    
    switch (ratingStyle) {
      case 'stars':
        return (
          <div className="flex gap-2">
            {ratings.map((rating) => (
              <button
                key={rating}
                className="text-gray-400 hover:text-yellow-400 transition-colors"
                aria-label={`Rate ${rating} stars`}
              >
                <Star className="w-8 h-8" />
              </button>
            ))}
          </div>
        );
      
      case 'numbers':
        return (
          <div className="flex gap-2">
            {ratings.map((rating) => (
              <button
                key={rating}
                className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 flex items-center justify-center text-gray-700 hover:text-blue-600 transition-colors"
                aria-label={`Rate ${rating}`}
              >
                {rating}
              </button>
            ))}
          </div>
        );
      
      case 'smileys':
        return (
          <div className="flex gap-2">
            {ratings.map((rating) => (
              <button
                key={rating}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: rating <= 2 ? '#fee2e2' : rating === 3 ? '#fef3c7' : '#dcfce7',
                  color: rating <= 2 ? '#ef4444' : rating === 3 ? '#d97706' : '#22c55e'
                }}
                aria-label={`Rate ${rating}`}
              >
                <SmilePlus className="w-6 h-6" />
              </button>
            ))}
          </div>
        );
    }
  };

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'rating':
        return renderRatingQuestion(question);
      
      case 'text':
        return (
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={3}
            placeholder="Type your answer here..."
          />
        );
      
      case 'multipleChoice':
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center gap-2">
                <input type="radio" name={question.id} className="text-blue-600" />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );
    }
  };

  return (
    <div 
      className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
      style={{
        '--primary-color': survey.branding.primaryColor,
        '--secondary-color': survey.branding.secondaryColor
      } as React.CSSProperties}
    >
      {/* Header */}
      <div 
        className="p-6"
        style={{ backgroundColor: survey.branding.primaryColor }}
      >
        {survey.branding.logo && (
          <img 
            src={survey.branding.logo} 
            alt="Company Logo" 
            className="h-12 mb-4"
          />
        )}
        <h2 className="text-2xl font-bold text-white">{survey.title}</h2>
        <p className="mt-2 text-white/80">{survey.description}</p>
      </div>

      {/* Questions */}
      <div className="p-6 space-y-8">
        {survey.questions.map((question, index) => (
          <div key={question.id} className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-medium text-gray-500">
                {index + 1}.
              </span>
              <h3 className="text-lg font-medium text-gray-900">
                {question.text}
                {question.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </h3>
            </div>
            {renderQuestion(question)}
          </div>
        ))}
      </div>
    </div>
  );
}