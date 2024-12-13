import React from 'react';
import { Calendar, Filter } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useGroups } from '../../hooks/useGroups';
import { useLocations } from '../../hooks/useLocations';

interface AnalyticsFiltersProps {
  filters: {
    startDate?: Date;
    endDate?: Date;
    groupId?: string;
    locationId?: string;
  };
  onChange: (filters: any) => void;
}

export function AnalyticsFilters({ filters, onChange }: AnalyticsFiltersProps) {
  const { groups } = useGroups();
  const { locations } = useLocations();

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Input
          type="date"
          label="Start Date"
          value={filters.startDate?.toISOString().split('T')[0]}
          onChange={(e) => onChange({
            ...filters,
            startDate: e.target.value ? new Date(e.target.value) : undefined
          })}
        />

        <Input
          type="date"
          label="End Date"
          value={filters.endDate?.toISOString().split('T')[0]}
          onChange={(e) => onChange({
            ...filters,
            endDate: e.target.value ? new Date(e.target.value) : undefined
          })}
        />

        <Select
          label="Group"
          value={filters.groupId || ''}
          onChange={(e) => onChange({ ...filters, groupId: e.target.value })}
        >
          <option value="">All Groups</option>
          {groups?.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </Select>

        <Select
          label="Location"
          value={filters.locationId || ''}
          onChange={(e) => onChange({ ...filters, locationId: e.target.value })}
        >
          <option value="">All Locations</option>
          {locations?.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => onChange({
            startDate: undefined,
            endDate: undefined,
            groupId: undefined,
            locationId: undefined
          })}
        >
          <Filter className="h-4 w-4 mr-2" />
          Reset Filters
        </Button>
      </div>
    </div>
  );
}