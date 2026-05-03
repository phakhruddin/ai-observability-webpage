/**
 * Alert Rules Engine Types
 * Defines data structures for conditional alert routing
 */

export type OperatorType = 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'in' | 'not_in';
export type FieldType = 'severity' | 'service' | 'environment' | 'tag' | 'message' | 'error_rate' | 'response_time' | 'custom';
export type ActionType = 'webhook' | 'slack' | 'email' | 'pagerduty' | 'custom';
export type LogicalOperator = 'AND' | 'OR';

export interface Condition {
  id: string;
  field: FieldType;
  operator: OperatorType;
  value: string | number | string[];
  customField?: string;
}

export interface ConditionGroup {
  id: string;
  operator: LogicalOperator;
  conditions: (Condition | ConditionGroup)[];
}

export interface Action {
  id: string;
  type: ActionType;
  target: string; // webhook URL, slack channel, email, etc.
  priority?: 'low' | 'medium' | 'high' | 'critical';
  throttle?: number; // seconds between alerts
  customAction?: string;
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  conditions: ConditionGroup;
  actions: Action[];
  createdAt: Date;
  updatedAt: Date;
  testResults?: RuleTestResult[];
}

export interface RuleTestResult {
  id: string;
  ruleId: string;
  testPayload: Record<string, any>;
  matched: boolean;
  matchedConditions: string[];
  triggeredActions: Action[];
  timestamp: Date;
}

export interface AlertPayload {
  severity: 'info' | 'warning' | 'error' | 'critical';
  service: string;
  environment: 'dev' | 'staging' | 'production';
  message: string;
  tags: string[];
  errorRate?: number;
  responseTime?: number;
  timestamp: Date;
  [key: string]: any;
}

/**
 * Predefined fields for rule building
 */
export const AVAILABLE_FIELDS: Record<FieldType, { label: string; type: 'string' | 'number' | 'select' }> = {
  severity: { label: 'Severity', type: 'select' },
  service: { label: 'Service', type: 'string' },
  environment: { label: 'Environment', type: 'select' },
  tag: { label: 'Tag', type: 'string' },
  message: { label: 'Message', type: 'string' },
  error_rate: { label: 'Error Rate (%)', type: 'number' },
  response_time: { label: 'Response Time (ms)', type: 'number' },
  custom: { label: 'Custom Field', type: 'string' },
};

export const SEVERITY_OPTIONS = ['info', 'warning', 'error', 'critical'];
export const ENVIRONMENT_OPTIONS = ['dev', 'staging', 'production'];
export const OPERATOR_LABELS: Record<OperatorType, string> = {
  equals: 'equals',
  not_equals: 'does not equal',
  contains: 'contains',
  not_contains: 'does not contain',
  greater_than: 'is greater than',
  less_than: 'is less than',
  in: 'is in',
  not_in: 'is not in',
};

/**
 * Evaluate if an alert payload matches a condition
 */
export function evaluateCondition(condition: Condition, payload: AlertPayload): boolean {
  const fieldValue = payload[condition.field];
  const conditionValue = condition.value;

  switch (condition.operator) {
    case 'equals':
      return fieldValue === conditionValue;
    case 'not_equals':
      return fieldValue !== conditionValue;
    case 'contains':
      return String(fieldValue).includes(String(conditionValue));
    case 'not_contains':
      return !String(fieldValue).includes(String(conditionValue));
    case 'greater_than':
      return Number(fieldValue) > Number(conditionValue);
    case 'less_than':
      return Number(fieldValue) < Number(conditionValue);
    case 'in':
      return Array.isArray(conditionValue) && conditionValue.includes(fieldValue);
    case 'not_in':
      return Array.isArray(conditionValue) && !conditionValue.includes(fieldValue);
    default:
      return false;
  }
}

/**
 * Evaluate if an alert payload matches a condition group
 */
export function evaluateConditionGroup(group: ConditionGroup, payload: AlertPayload): boolean {
  const results = group.conditions.map((cond) => {
    if ('conditions' in cond) {
      return evaluateConditionGroup(cond as ConditionGroup, payload);
    }
    return evaluateCondition(cond as Condition, payload);
  });

  if (group.operator === 'AND') {
    return results.every((r) => r);
  } else {
    return results.some((r) => r);
  }
}

/**
 * Check if a rule matches an alert payload
 */
export function evaluateRule(rule: AlertRule, payload: AlertPayload): boolean {
  return rule.enabled && evaluateConditionGroup(rule.conditions, payload);
}

/**
 * Generate human-readable rule description
 */
export function generateRuleDescription(rule: AlertRule): string {
  const conditionDescriptions = describeConditionGroup(rule.conditions);
  const actionDescriptions = rule.actions.map((a) => `send to ${a.target}`).join(', ');
  return `If ${conditionDescriptions}, then ${actionDescriptions}`;
}

/**
 * Generate human-readable condition group description
 */
export function describeConditionGroup(group: ConditionGroup): string {
  const descriptions = group.conditions.map((cond) => {
    if ('conditions' in cond) {
      return `(${describeConditionGroup(cond as ConditionGroup)})`;
    }
    const c = cond as Condition;
    const field = AVAILABLE_FIELDS[c.field]?.label || c.customField || c.field;
    const operator = OPERATOR_LABELS[c.operator] || c.operator;
    return `${field} ${operator} ${c.value}`;
  });

  return descriptions.join(` ${group.operator} `);
}

/**
 * Create a new empty rule
 */
export function createEmptyRule(): AlertRule {
  return {
    id: `rule_${Date.now()}`,
    name: 'New Rule',
    description: '',
    enabled: true,
    conditions: {
      id: `group_${Date.now()}`,
      operator: 'AND',
      conditions: [
        {
          id: `cond_${Date.now()}`,
          field: 'severity',
          operator: 'equals',
          value: 'critical',
        },
      ],
    },
    actions: [
      {
        id: `action_${Date.now()}`,
        type: 'webhook',
        target: '',
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
