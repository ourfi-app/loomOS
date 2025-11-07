
'use client';

import { useState } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  type FilterCondition, 
  type FilterGroup, 
  type FilterOperator,
  createFilterGroup 
} from '@/lib/advanced-filters';

const OPERATORS: { value: FilterOperator; label: string }[] = [
  { value: 'equals', label: 'Equals' },
  { value: 'notEquals', label: 'Not Equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'notContains', label: 'Does Not Contain' },
  { value: 'startsWith', label: 'Starts With' },
  { value: 'endsWith', label: 'Ends With' },
  { value: 'greaterThan', label: 'Greater Than' },
  { value: 'lessThan', label: 'Less Than' },
  { value: 'isEmpty', label: 'Is Empty' },
  { value: 'isNotEmpty', label: 'Is Not Empty' },
];

interface AdvancedFilterBuilderProps {
  fields: { value: string; label: string }[];
  onApply: (filter: FilterGroup) => void;
  onClear: () => void;
  initialFilter?: FilterGroup;
}

export function AdvancedFilterBuilder({
  fields,
  onApply,
  onClear,
  initialFilter,
}: AdvancedFilterBuilderProps) {
  const [conditions, setConditions] = useState<Omit<FilterCondition, 'id'>[]>(
    initialFilter?.conditions.map(c => ({ ...c })) || [{ field: '', operator: 'equals' as FilterOperator, value: '' }]
  );
  const [operator, setOperator] = useState<'AND' | 'OR'>(initialFilter?.operator || 'AND');

  const addCondition = () => {
    setConditions([...conditions, { field: '', operator: 'equals', value: '' }]);
  };

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const updateCondition = (index: number, updates: Partial<Omit<FilterCondition, 'id'>>) => {
    const newConditions = [...conditions];
    const existing = newConditions[index];
    if (existing) {
      newConditions[index] = { ...existing, ...updates };
      setConditions(newConditions);
    }
  };

  const handleApply = () => {
    const validConditions = conditions.filter(c => c.field && c.operator);
    if (validConditions.length > 0) {
      const filterGroup = createFilterGroup(validConditions, operator);
      onApply(filterGroup);
    }
  };

  const handleClear = () => {
    setConditions([{ field: '', operator: 'equals', value: '' }]);
    onClear();
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Advanced Filters</h3>
          <div className="flex items-center gap-2">
            <Badge variant={operator === 'AND' ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setOperator('AND')}>
              AND
            </Badge>
            <Badge variant={operator === 'OR' ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setOperator('OR')}>
              OR
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          {conditions.map((condition, index) => (
            <div key={index} className="flex items-center gap-2">
              <Select
                value={condition.field}
                onValueChange={(value) => updateCondition(index, { field: value })}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  {fields.map((field) => (
                    <SelectItem key={field.value} value={field.value}>
                      {field.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={condition.operator}
                onValueChange={(value) => updateCondition(index, { operator: value as FilterOperator })}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OPERATORS.map((op) => (
                    <SelectItem key={op.value} value={op.value}>
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {!['isEmpty', 'isNotEmpty'].includes(condition.operator) && (
                <Input
                  value={condition.value}
                  onChange={(e) => updateCondition(index, { value: e.target.value })}
                  placeholder="Value"
                  className="flex-1"
                />
              )}

              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeCondition(index)}
                disabled={conditions.length === 1}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2">
          <Button variant="outline" size="sm" onClick={addCondition}>
            <Plus className="w-4 h-4 mr-2" />
            Add Condition
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleClear}>
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
            <Button size="sm" onClick={handleApply}>
              <Save className="w-4 h-4 mr-2" />
              Apply
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
