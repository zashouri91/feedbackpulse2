import React, { useState } from 'react';
import { Plus, FolderTree } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { AddGroupDialog } from '../../components/groups/AddGroupDialog';
import { useGroups } from '../../hooks/useGroups';

export default function GroupList() {
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const { groups, isLoading } = useGroups();

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Groups</h1>
          <p className="mt-2 text-sm text-gray-700">
            Organize users into groups for better management and survey distribution.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button onClick={() => setIsAddGroupOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Group
          </Button>
        </div>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : groups.length === 0 ? (
          <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12">
            <div className="text-center">
              <FolderTree className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No groups</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new group.</p>
              <div className="mt-6">
                <Button size="sm" onClick={() => setIsAddGroupOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Group
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {groups.map((group) => (
              <div
                key={group.id}
                className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900">{group.name}</h3>
                  {group.description && (
                    <p className="text-sm text-gray-500">{group.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddGroupDialog
        isOpen={isAddGroupOpen}
        onClose={() => setIsAddGroupOpen(false)}
      />
    </div>
  );
}