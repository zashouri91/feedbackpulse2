import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useGroups } from '../../hooks/useGroups';
import { useLocations } from '../../hooks/useLocations';

interface SurveyFiltersProps {
  filters: {
    search: string;
    status: 'all' | 'active' | 'draft';
    groupId?: string;
    locationId?: string;
    sortBy: 'created' | 'responses' | 'title';
  };
  onChange: (filters: any) => void;
}

export function SurveyFilters({ filters, onChange }: SurveyFiltersProps) {
  const { groups } = useGroups();
  const { locations } = useLocations();

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Input
            placeholder="Search surveys..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>

        <Select
          value={filters.status}
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
        </Select>

        <Select
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

      <div className="mt-4 flex justify-between items-center">
        <Select
          value={filters.sortBy}
          onChange={(e) => onChange({ ...filters, sortBy: e.target.value })}
          className="w-48"
        >
          <option value="created">Sort by Date Created</option>
          <option value="responses">Sort by Responses</option>
          <option value="title">Sort by Title</option>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange({
            search: '',
            status: 'all',
            groupId: '',
            locationId: '',
            sortBy: 'created'
          })}
        >
          <Filter className="h-4 w-4 mr-2" />
          Reset Filters
        </Button>
      </div>
    </div>
  );
}