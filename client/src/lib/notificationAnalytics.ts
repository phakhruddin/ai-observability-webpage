/**
 * Notification Analytics
 * Tracks trial notification interactions and engagement
 */

import { trackEvent } from './analytics';

export function trackNotificationView(notificationType: string): void {
  trackEvent({
    category: 'feature_interaction',
    action: 'notification_viewed',
    label: notificationType,
  });
}

export function trackNotificationExpanded(notificationId: string, type: string): void {
  trackEvent({
    category: 'feature_interaction',
    action: 'notification_expanded',
    label: type,
  });
}

export function trackNotificationCTAClick(
  notificationType: string,
  ctaText: string
): void {
  trackEvent({
    category: 'cta_click',
    action: 'notification_cta_clicked',
    label: `${notificationType} - ${ctaText}`,
  });
}

export function trackNotificationUpgradeClick(notificationType: string): void {
  trackEvent({
    category: 'cta_click',
    action: 'notification_upgrade_clicked',
    label: notificationType,
  });
}

export function trackNotificationSent(
  notificationType: string,
  success: boolean
): void {
  trackEvent({
    category: 'feature_interaction',
    action: 'notification_sent',
    label: `${notificationType} - ${success ? 'success' : 'failed'}`,
  });
}

export function trackNotificationDelivery(
  notificationType: string,
  deliveryStatus: 'delivered' | 'failed' | 'bounced'
): void {
  trackEvent({
    category: 'feature_interaction',
    action: 'notification_delivery',
    label: `${notificationType} - ${deliveryStatus}`,
  });
}

export function trackTrialStatusViewed(daysRemaining: number, isExpired: boolean): void {
  trackEvent({
    category: 'feature_interaction',
    action: 'trial_status_viewed',
    label: `${daysRemaining} days remaining`,
    value: isExpired ? 0 : 1,
  });
}

export function trackNotificationHistoryViewed(notificationCount: number): void {
  trackEvent({
    category: 'feature_interaction',
    action: 'notification_history_viewed',
    value: notificationCount,
  });
}
