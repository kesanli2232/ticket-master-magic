
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { assignees, priorities, statuses } from '@/lib/data';
import { TicketFilter, Status, Priority, AssignedTo } from '@/types';
import { X } from 'lucide-react';

type FilterBarProps = {
  onFilter: (filters: TicketFilter) => void;
};

const FilterBar = ({ onFilter }: FilterBarProps) => {
  const [filters, setFilters] = useState<TicketFilter>({});
  
  const handleFilterChange = (key: keyof TicketFilter, value: string | null) => {
    const newFilters = { ...filters };
    
    if (value) {
      // Tip belirtimi sorununu çözmek için doğru şekilde dönüştürme yapıyoruz
      if (key === 'status') {
        newFilters[key] = value as Status;
      } else if (key === 'priority') {
        newFilters[key] = value as Priority;
      } else if (key === 'assignedTo') {
        newFilters[key] = value as AssignedTo;
      }
    } else {
      delete newFilters[key];
    }
    
    setFilters(newFilters);
    onFilter(newFilters);
  };
  
  const clearFilters = () => {
    setFilters({});
    onFilter({});
  };

  return (
    <div className="bg-secondary rounded-md p-4 flex items-center gap-4">
      {/* Status Filter */}
      <Select onValueChange={(value) => handleFilterChange('status', value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Durum Seçin" defaultValue={filters.status || undefined} />
        </SelectTrigger>
        <SelectContent>
          {statuses.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* Priority Filter */}
      <Select onValueChange={(value) => handleFilterChange('priority', value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Öncelik Seçin" defaultValue={filters.priority || undefined} />
        </SelectTrigger>
        <SelectContent>
          {priorities.map((priority) => (
            <SelectItem key={priority} value={priority}>
              {priority}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* Assigned To Filter */}
      <Select onValueChange={(value) => handleFilterChange('assignedTo', value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Atanan Kişi Seçin" defaultValue={filters.assignedTo || undefined} />
        </SelectTrigger>
        <SelectContent>
          {assignees.map((assignee) => (
            <SelectItem key={assignee} value={assignee}>
              {assignee}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* Clear Filters Button */}
      {Object.keys(filters).length > 0 && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="h-4 w-4 mr-2" />
          Filtreleri Temizle
        </Button>
      )}
    </div>
  );
};

export default FilterBar;
