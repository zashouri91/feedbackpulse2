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
    <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
      <span className="text-sm text-gray-600">
        {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={onDelete}
        disabled={isDeleting}
        className="text-red-600 hover:bg-red-50 hover:text-red-700"
      >
        <Trash className="mr-2 h-4 w-4" />
        {isDeleting ? 'Deleting...' : 'Delete Selected'}
      </Button>
    </div>
  );
}
