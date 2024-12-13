import React, { useState } from 'react';
import { MoreVertical, Pencil, Trash } from 'lucide-react';
import { Button } from './Button';

interface ActionsDropdownProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function ActionsDropdown({ onEdit, onDelete }: ActionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="p-1"
      >
        <MoreVertical className="h-4 w-4" />
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
            <button
              onClick={() => {
                onEdit();
                setIsOpen(false);
              }}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Pencil className="mr-3 h-4 w-4" />
              Edit
            </button>
            <button
              onClick={() => {
                onDelete();
                setIsOpen(false);
              }}
              className="flex w-full items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50"
            >
              <Trash className="mr-3 h-4 w-4" />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}