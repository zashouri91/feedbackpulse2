import React, { useCallback, useRef } from 'react';
import { MoreVertical, Pencil, Trash } from 'lucide-react';
import { Button } from './Button';
import { useUIStore } from '../../store/uiStore';

interface ActionsDropdownProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function ActionsDropdown({ onEdit, onDelete }: ActionsDropdownProps) {
  const isOpen = useUIStore(state => state.dropdownOpen);
  const setDropdownOpen = useUIStore(state => state.setDropdownOpen);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    },
    [setDropdownOpen]
  );

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, handleClickOutside]);

  const handleAction = useCallback(
    (action: () => void) => {
      action();
      setDropdownOpen(false);
    },
    [setDropdownOpen]
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <Button variant="outline" size="sm" onClick={() => setDropdownOpen(!isOpen)} className="p-1">
        <MoreVertical className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 z-20 mt-2 w-48 scale-100 transform rounded-md bg-white py-1 opacity-100 shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200">
          <button
            onClick={() => handleAction(onEdit)}
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
          >
            <Pencil className="mr-3 h-4 w-4" />
            Edit
          </button>
          <button
            onClick={() => handleAction(onDelete)}
            className="flex w-full items-center px-4 py-2 text-sm text-red-700 transition-colors hover:bg-red-50"
          >
            <Trash className="mr-3 h-4 w-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
