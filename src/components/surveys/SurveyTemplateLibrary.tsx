import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy } from 'lucide-react';
import { Button } from '../ui/Button';
import type { SurveyTemplate } from '../../types/survey';

const templates: SurveyTemplate[] = [
  {
    id: 'customer-satisfaction',
    title: 'Customer Satisfaction Survey',
    description: 'Measure customer satisfaction with your products or services',
    category: 'Customer Feedback',
    questions: [
      {
        id: '1',
        type: 'rating',
        text: 'How satisfied are you with our service?',
        required: true
      },
      {
        id: '2',
        type: 'text',
        text: 'What could we improve?',
        required: false
      }
    ],
    branding: {
      primaryColor: '#2563eb',
      secondaryColor: '#1e40af'
    }
  },
  {
    id: 'nps',
    title: 'Net Promoter Score (NPS)',
    description: 'Measure customer loyalty and satisfaction',
    category: 'Customer Feedback',
    questions: [
      {
        id: '1',
        type: 'rating',
        text: 'How likely are you to recommend us to a friend or colleague?',
        required: true
      },
      {
        id: '2',
        type: 'text',
        text: 'What is the primary reason for your score?',
        required: true
      }
    ],
    branding: {
      primaryColor: '#2563eb',
      secondaryColor: '#1e40af'
    }
  }
];

export function SurveyTemplateLibrary() {
  const navigate = useNavigate();

  const handleUseTemplate = (template: SurveyTemplate) => {
    navigate('/surveys/new', { state: { template } });
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => (
        <div
          key={template.id}
          className="flex flex-col justify-between p-6 bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div>
            <h3 className="text-lg font-medium text-gray-900">{template.title}</h3>
            <p className="mt-1 text-sm text-gray-500">{template.description}</p>
            <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {template.category}
            </div>
          </div>
          
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => handleUseTemplate(template)}
            >
              <Copy className="h-4 w-4 mr-2" />
              Use Template
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}