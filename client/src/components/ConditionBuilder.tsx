import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, Plus } from 'lucide-react';
import {
  Condition,
  FieldType,
  OperatorType,
  AVAILABLE_FIELDS,
  SEVERITY_OPTIONS,
  ENVIRONMENT_OPTIONS,
  OPERATOR_LABELS,
} from '@/lib/alertRulesTypes';

interface ConditionBuilderProps {
  condition: Condition;
  onUpdate: (condition: Condition) => void;
  onRemove: () => void;
  onAddCondition?: () => void;
}

export function ConditionBuilder({
  condition,
  onUpdate,
  onRemove,
  onAddCondition,
}: ConditionBuilderProps) {
  const field = AVAILABLE_FIELDS[condition.field];
  const isNumericField = field?.type === 'number';
  const isSelectField = field?.type === 'select';

  const getOperatorOptions = () => {
    if (isNumericField) {
      return ['equals', 'not_equals', 'greater_than', 'less_than', 'in', 'not_in'] as OperatorType[];
    }
    return ['equals', 'not_equals', 'contains', 'not_contains', 'in', 'not_in'] as OperatorType[];
  };

  const getValueOptions = () => {
    if (condition.field === 'severity') return SEVERITY_OPTIONS;
    if (condition.field === 'environment') return ENVIRONMENT_OPTIONS;
    return [];
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg">
      {/* Field Select */}
      <Select
        value={condition.field}
        onValueChange={(value) =>
          onUpdate({
            ...condition,
            field: value as FieldType,
            value: '',
          })
        }
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Select field" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(AVAILABLE_FIELDS).map(([key, field]) => (
            <SelectItem key={key} value={key}>
              {field.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Operator Select */}
      <Select
        value={condition.operator}
        onValueChange={(value) =>
          onUpdate({
            ...condition,
            operator: value as OperatorType,
          })
        }
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Select operator" />
        </SelectTrigger>
        <SelectContent>
          {getOperatorOptions().map((op) => (
            <SelectItem key={op} value={op}>
              {OPERATOR_LABELS[op]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Value Input */}
      {isSelectField ? (
        <Select
          value={String(condition.value)}
          onValueChange={(value) =>
            onUpdate({
              ...condition,
              value,
            })
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select value" />
          </SelectTrigger>
          <SelectContent>
            {getValueOptions().map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          type={isNumericField ? 'number' : 'text'}
          value={condition.value}
          onChange={(e) =>
            onUpdate({
              ...condition,
              value: isNumericField ? Number(e.target.value) : e.target.value,
            })
          }
          placeholder="Enter value"
          className="w-40"
        />
      )}

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="text-destructive hover:text-destructive"
      >
        <X className="w-4 h-4" />
      </Button>

      {/* Add Condition Button */}
      {onAddCondition && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onAddCondition}
          className="text-accent hover:text-accent"
        >
          <Plus className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
