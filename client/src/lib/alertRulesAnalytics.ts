/**
 * Alert Rules Analytics
 * Tracks alert rule creation, testing, and execution
 */

import { trackEvent } from './analytics';

export function trackRuleCreated(ruleName: string, conditionCount: number, actionCount: number): void {
  trackEvent({
    category: 'feature_interaction',
    action: 'alert_rule_created',
    label: ruleName,
    value: conditionCount + actionCount,
  });
}

export function trackRuleUpdated(ruleName: string, changeType: string): void {
  trackEvent({
    category: 'feature_interaction',
    action: 'alert_rule_updated',
    label: `${ruleName} - ${changeType}`,
  });
}

export function trackRuleDeleted(ruleName: string): void {
  trackEvent({
    category: 'feature_interaction',
    action: 'alert_rule_deleted',
    label: ruleName,
  });
}

export function trackRuleToggled(ruleName: string, enabled: boolean): void {
  trackEvent({
    category: 'feature_interaction',
    action: 'alert_rule_toggled',
    label: `${ruleName} - ${enabled ? 'enabled' : 'disabled'}`,
  });
}

export function trackRuleTested(ruleName: string, matched: boolean): void {
  trackEvent({
    category: 'feature_interaction',
    action: 'alert_rule_tested',
    label: `${ruleName} - ${matched ? 'matched' : 'no_match'}`,
  });
}

export function trackConditionAdded(fieldType: string, operator: string): void {
  trackEvent({
    category: 'feature_interaction',
    action: 'condition_added',
    label: `${fieldType} ${operator}`,
  });
}

export function trackActionAdded(actionType: string): void {
  trackEvent({
    category: 'feature_interaction',
    action: 'action_added',
    label: actionType,
  });
}

export function trackRuleExecuted(ruleName: string, actionCount: number, success: boolean): void {
  trackEvent({
    category: 'feature_interaction',
    action: 'alert_rule_executed',
    label: `${ruleName} - ${success ? 'success' : 'failed'}`,
    value: actionCount,
  });
}
