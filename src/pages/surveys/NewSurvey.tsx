import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SurveyBuilder from './SurveyBuilder';
import { useSurveys } from '../../hooks/useSurveys';
import type { Survey } from '../../types/survey';

export default function NewSurvey() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addSurvey, isLoading } = useSurveys();
  const template = location.state?.template;

  const handleSubmit = async (data: Partial<Survey>) => {
    try {
      await addSurvey(data);
      navigate('/surveys');
    } catch (error) {
      console.error('Error creating survey:', error);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Create New Survey</h1>
        <p className="mt-2 text-sm text-gray-700">
          Design your survey using the builder below.
        </p>
      </div>

      <SurveyBuilder
        initialData={template}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}