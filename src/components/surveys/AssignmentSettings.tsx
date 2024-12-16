import React from 'react';
import { Control } from 'react-hook-form';
import { Select } from '../ui/Select';
import { useGroups } from '../../hooks/useGroups';
import { useLocations } from '../../hooks/useLocations';
import { useUsers } from '../../hooks/useUsers';

interface AssignmentSettingsProps {
  control: Control<any>;
}

export function AssignmentSettings({ control }: AssignmentSettingsProps) {
  const { groups } = useGroups();
  const { locations } = useLocations();
  const { users } = useUsers();

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-lg font-medium text-gray-900">Survey Assignment</h2>

      <div className="space-y-6">
        <Select label="Assign to Groups" multiple {...control.register('assignedTo.groups')}>
          {groups?.map(group => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </Select>

        <Select label="Assign to Locations" multiple {...control.register('assignedTo.locations')}>
          {locations?.map(location => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </Select>

        <Select label="Assign to Specific Users" multiple {...control.register('assignedTo.users')}>
          {users?.map(user => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
