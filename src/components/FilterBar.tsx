
import { useState } from 'react';
import { X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Status, Priority, AssignedTo, Category, TicketFilter } from '@/types';
import { statuses, priorities, assignees, categories } from '@/lib/data';

type FilterBarProps = {
  onFilter: (filters: TicketFilter) => void;
};

const FilterBar = ({ onFilter }: FilterBarProps) => {
  const [filters, setFilters] = useState<TicketFilter>({});
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleFilterChange = (key: keyof TicketFilter, value: string | undefined) => {
    const newFilters = { ...filters };
    
    if (value) {
      newFilters[key] = value as any;
    } else {
      delete newFilters[key];
    }
    
    setFilters(newFilters);
    onFilter(newFilters);
  };
  
  const clearAllFilters = () => {
    setFilters({});
    onFilter({});
  };
  
  const removeFilter = (key: keyof TicketFilter) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
    onFilter(newFilters);
  };
  
  return (
    <div className="bg-secondary/50 backdrop-blur-sm rounded-lg p-4 mb-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-medium flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {Object.keys(filters).length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {Object.keys(filters).length}
            </Badge>
          )}
        </h2>
        
        <div className="flex gap-2">
          {Object.keys(filters).length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs h-8">
              Clear All
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>
      </div>
      
      {Object.keys(filters).length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(filters).map(([key, value]) => (
            <Badge key={key} variant="outline" className="py-1.5">
              <span className="text-sm">
                {key}: <strong>{value}</strong>
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => removeFilter(key as keyof TicketFilter)} 
                className="ml-1 h-4 w-4 p-0"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {key} filter</span>
              </Button>
            </Badge>
          ))}
        </div>
      )}
      
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
          <div>
            <Select 
              value={filters.status} 
              onValueChange={(value) => handleFilterChange('status', value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Status</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select 
              value={filters.priority} 
              onValueChange={(value) => handleFilterChange('priority', value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Priority</SelectItem>
                {priorities.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select 
              value={filters.assignedTo} 
              onValueChange={(value) => handleFilterChange('assignedTo', value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Assignee</SelectItem>
                {assignees.map((assignee) => (
                  <SelectItem key={assignee} value={assignee}>
                    {assignee}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select 
              value={filters.category} 
              onValueChange={(value) => handleFilterChange('category', value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Category</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
