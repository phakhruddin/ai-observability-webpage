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
import { Action, ActionType } from '@/lib/alertRulesTypes';

interface ActionBuilderProps {
  action: Action;
  onUpdate: (action: Action) => void;
  onRemove: () => void;
  onAddAction?: () => void;
}

const ACTION_TYPES: { value: ActionType; label: string }[] = [
  { value: 'webhook', label: 'Webhook' },
  { value: 'slack', label: 'Slack' },
  { value: 'email', label: 'Email' },
  { value: 'pagerduty', label: 'PagerDuty' },
  { value: 'custom', label: 'Custom' },
];

const PRIORITY_OPTIONS = ['low', 'medium', 'high', 'critical'] as const;

export function ActionBuilder({
  action,
  onUpdate,
  onRemove,
  onAddAction,
}: ActionBuilderProps) {
  const getPlaceholder = () => {
    switch (action.type) {
      case 'webhook':
        return 'https://example.com/webhook';
      case 'slack':
        return '#channel or @user';
      case 'email':
        return 'email@example.com';
      case 'pagerduty':
        return 'integration-key';
      default:
        return 'Enter target';
    }
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg">
      {/* Action Type Select */}
      <Select
        value={action.type}
        onValueChange={(value) =>
          onUpdate({
            ...action,
            type: value as ActionType,
          })
        }
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Select action" />
        </SelectTrigger>
        <SelectContent>
          {ACTION_TYPES.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Target Input */}
      <Input
        value={action.target}
        onChange={(e) =>
          onUpdate({
            ...action,
            target: e.target.value,
          })
        }
        placeholder={getPlaceholder()}
        className="flex-1"
      />

      {/* Priority Select */}
      <Select
        value={action.priority || 'high'}
        onValueChange={(value) =>
          onUpdate({
            ...action,
            priority: value as any,
          })
        }
      >
        <SelectTrigger className="w-28">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          {PRIORITY_OPTIONS.map((priority) => (
            <SelectItem key={priority} value={priority}>
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Throttle Input */}
      <Input
        type="number"
        value={action.throttle || ''}
        onChange={(e) =>
          onUpdate({
            ...action,
            throttle: e.target.value ? Number(e.target.value) : undefined,
          })
        }
        placeholder="Throttle (s)"
        className="w-24"
      />

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="text-destructive hover:text-destructive"
      >
        <X className="w-4 h-4" />
      </Button>

      {/* Add Action Button */}
      {onAddAction && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onAddAction}
          className="text-accent hover:text-accent"
        >
          <Plus className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
