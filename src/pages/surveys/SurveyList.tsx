import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';
import { BatchActions } from '../../components/ui/BatchActions';
import { useSurveys } from '../../hooks/useSurveys';
import { useBatchSelection } from '../../hooks/useBatchSelection';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';

export default function SurveyList() {
  const { surveys, isLoading, deleteSurveys } = useSurveys();
  const {
    selectedIds,
    toggleSelection,
    toggleAll,
    clearSelection,
    isSelected,
    selectedCount,
    isAllSelected,
  } = useBatchSelection(surveys);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleBatchDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteSurveys(Array.from(selectedIds));
      clearSelection();
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Surveys</h1>
          <p className="mt-2 text-sm text-gray-700">
            Create and manage feedback surveys for your organization.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Survey
          </Button>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                      <Checkbox
                        checked={isAllSelected}
                        onChange={toggleAll}
                        className="absolute left-4 top-1/2 -mt-2"
                      />
                    </th>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                      Title
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Responses
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Created
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="py-10">
                        <div className="flex justify-center">
                          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
                        </div>
                      </td>
                    </tr>
                  ) : surveys.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-sm text-gray-500">
                        No surveys found. Create your first survey to get started.
                      </td>
                    </tr>
                  ) : (
                    surveys.map(survey => (
                      <tr key={survey.id}>
                        <td className="relative px-7 sm:w-12 sm:px-6">
                          <Checkbox
                            checked={isSelected(survey.id)}
                            onChange={() => toggleSelection(survey.id)}
                            className="absolute left-4 top-1/2 -mt-2"
                          />
                        </td>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                          {survey.title}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              survey.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {survey.isActive ? 'Active' : 'Draft'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {/* Add response count here */}0
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(survey.createdAt).toLocaleDateString()}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          {/* Add actions dropdown here */}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <BatchActions
        selectedCount={selectedCount}
        onDelete={() => setIsDeleteOpen(true)}
        isDeleting={isDeleting}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleBatchDelete}
        title="Delete Surveys"
        message={`Are you sure you want to delete ${selectedCount} selected survey${selectedCount !== 1 ? 's' : ''}? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
}
