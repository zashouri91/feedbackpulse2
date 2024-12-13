import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, MapPin, BarChart } from 'lucide-react';
import { ActionsDropdown } from '../ui/ActionsDropdown';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import type { Survey } from '../../types/survey';
import { formatDate } from '../../utils/date';

interface SurveyCardProps {
  survey: Survey;
  onDelete: (id: string) => Promise<void>;
}

export function SurveyCard({ survey, onDelete }: SurveyCardProps) {
  const navigate = useNavigate();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    navigate(`/surveys/${survey.id}/edit`);
  };

  const handlePreview = () => {
    navigate(`/surveys/${survey.id}/preview`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(survey.id);
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }
  };

  const getAssignmentSummary = () => {
    const parts = [];
    if (survey.assignedTo.groups?.length) {
      parts.push(`${survey.assignedTo.groups.length} groups`);
    }
    if (survey.assignedTo.locations?.length) {
      parts.push(`${survey.assignedTo.locations.length} locations`);
    }
    if (survey.assignedTo.users?.length) {
      parts.push(`${survey.assignedTo.users.length} users`);
    }
    return parts.join(', ') || 'Not assigned';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:border-gray-300 transition-colors">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{survey.title}</h3>
            <p className="mt-1 text-sm text-gray-500">{survey.description}</p>
          </div>
          <ActionsDropdown
            actions={[
              { label: 'Edit', onClick: handleEdit },
              { label: 'Preview', onClick: handlePreview },
              { label: 'Delete', onClick: () => setIsDeleteOpen(true), variant: 'danger' }
            ]}
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            Created {formatDate(survey.createdAt)}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <BarChart className="h-4 w-4 mr-2" />
            {survey.responseCount || 0} responses
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-2" />
            {getAssignmentSummary()}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-2" />
            {survey.isActive ? 'Active' : 'Draft'}
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Survey"
        message="Are you sure you want to delete this survey? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
}