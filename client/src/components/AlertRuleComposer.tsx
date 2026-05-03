import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Save, X } from 'lucide-react';
import { ConditionBuilder } from './ConditionBuilder';
import { ActionBuilder } from './ActionBuilder';
import { RulePreview } from './RulePreview';
import { AlertRule, Condition, Action, createEmptyRule } from '@/lib/alertRulesTypes';

interface AlertRuleComposerProps {
  rule?: AlertRule;
  onSave: (rule: AlertRule) => void;
  onCancel: () => void;
}

export function AlertRuleComposer({ rule: initialRule, onSave, onCancel }: AlertRuleComposerProps) {
  const [rule, setRule] = useState<AlertRule>(initialRule || createEmptyRule());

  const handleAddCondition = () => {
    const newCondition: Condition = {
      id: `cond_${Date.now()}`,
      field: 'severity',
      operator: 'equals',
      value: 'critical',
    };

    setRule({
      ...rule,
      conditions: {
        ...rule.conditions,
        conditions: [...rule.conditions.conditions, newCondition],
      },
    });
  };

  const handleUpdateCondition = (index: number, updatedCondition: Condition) => {
    const conditions = [...rule.conditions.conditions];
    conditions[index] = updatedCondition;
    setRule({
      ...rule,
      conditions: {
        ...rule.conditions,
        conditions,
      },
    });
  };

  const handleRemoveCondition = (index: number) => {
    const conditions = rule.conditions.conditions.filter((_, i) => i !== index);
    setRule({
      ...rule,
      conditions: {
        ...rule.conditions,
        conditions: conditions.length > 0 ? conditions : rule.conditions.conditions,
      },
    });
  };

  const handleAddAction = () => {
    const newAction: Action = {
      id: `action_${Date.now()}`,
      type: 'webhook',
      target: '',
      priority: 'high',
    };

    setRule({
      ...rule,
      actions: [...rule.actions, newAction],
    });
  };

  const handleUpdateAction = (index: number, updatedAction: Action) => {
    const actions = [...rule.actions];
    actions[index] = updatedAction;
    setRule({
      ...rule,
      actions,
    });
  };

  const handleRemoveAction = (index: number) => {
    const actions = rule.actions.filter((_, i) => i !== index);
    setRule({
      ...rule,
      actions: actions.length > 0 ? actions : rule.actions,
    });
  };

  const isValid = rule.name.trim() && rule.conditions.conditions.length > 0 && rule.actions.length > 0;

  return (
    <div className="space-y-6">
      {/* Rule Name and Description */}
      <Card className="bg-card border border-border">
        <CardHeader>
          <CardTitle>Rule Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Rule Name</label>
            <Input
              value={rule.name}
              onChange={(e) =>
                setRule({
                  ...rule,
                  name: e.target.value,
                })
              }
              placeholder="e.g., Critical API Errors"
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Description</label>
            <Input
              value={rule.description}
              onChange={(e) =>
                setRule({
                  ...rule,
                  description: e.target.value,
                })
              }
              placeholder="Optional description"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Conditions, Actions, and Preview */}
      <Tabs defaultValue="conditions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="conditions">Conditions</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        {/* Conditions Tab */}
        <TabsContent value="conditions">
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle>Alert Conditions</CardTitle>
              <CardDescription>Define when this rule should trigger</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Logical Operator */}
              <div>
                <label className="text-sm font-medium text-foreground">Match</label>
                <select
                  value={rule.conditions.operator}
                  onChange={(e) =>
                    setRule({
                      ...rule,
                      conditions: {
                        ...rule.conditions,
                        operator: e.target.value as 'AND' | 'OR',
                      },
                    })
                  }
                  className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md text-sm"
                >
                  <option value="AND">ALL conditions (AND)</option>
                  <option value="OR">ANY condition (OR)</option>
                </select>
              </div>

              {/* Conditions List */}
              <div className="space-y-3">
                {rule.conditions.conditions.map((cond, index) => (
                  <ConditionBuilder
                    key={cond.id}
                    condition={cond as Condition}
                    onUpdate={(updated) => handleUpdateCondition(index, updated)}
                    onRemove={() => handleRemoveCondition(index)}
                    onAddCondition={index === rule.conditions.conditions.length - 1 ? handleAddCondition : undefined}
                  />
                ))}
              </div>

              {rule.conditions.conditions.length === 0 && (
                <Button onClick={handleAddCondition} variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Condition
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Actions Tab */}
        <TabsContent value="actions">
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle>Alert Actions</CardTitle>
              <CardDescription>Where to send alerts when conditions match</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Actions List */}
              <div className="space-y-3">
                {rule.actions.map((action, index) => (
                  <ActionBuilder
                    key={action.id}
                    action={action}
                    onUpdate={(updated) => handleUpdateAction(index, updated)}
                    onRemove={() => handleRemoveAction(index)}
                    onAddAction={index === rule.actions.length - 1 ? handleAddAction : undefined}
                  />
                ))}
              </div>

              {rule.actions.length === 0 && (
                <Button onClick={handleAddAction} variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Action
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview">
          <RulePreview rule={rule} />
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button
          onClick={() => onSave(rule)}
          disabled={!isValid}
          className="bg-accent hover:bg-accent/90"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Rule
        </Button>
      </div>
    </div>
  );
}
