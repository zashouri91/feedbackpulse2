import React from 'react';
import { Trash } from 'lucide-react';
import { Button } from './Button';

interface BatchActionsProps {
  selectedCount: number;
  onDelete: () => void;
  isDeleting?: boolean;
}

export function BatchActions({ selectedCount, onDelete, isDeleting }: BatchActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
      <span className="text-sm text-gray-600">
        {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={onDelete}
        disabled={isDeleting}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <Trash className="h-4 w-4 mr-2" />
        {isDeleting ? 'Deleting...' : 'Delete Selected'}
      </Button>
    </div>
  );
}