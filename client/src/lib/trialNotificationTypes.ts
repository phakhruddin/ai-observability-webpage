/**
 * Trial Notification Types and Utilities
 * Manages trial expiration reminders and notification scheduling
 */

export interface TrialNotification {
  id: string;
  userId: string;
  type: 'day_3_reminder' | 'day_7_reminder' | 'day_13_reminder' | 'expiration_warning';
  email: string;
  trialStartDate: Date;
  scheduledDate: Date;
  sentDate?: Date;
  status: 'pending' | 'sent' | 'failed';
  retryCount: number;
  message: string;
}

export interface TrialStatus {
  email: string;
  startDate: Date;
  endDate: Date;
  daysRemaining: number;
  isExpired: boolean;
  notificationsSent: TrialNotification[];
}

export interface NotificationTemplate {
  subject: string;
  title: string;
  headline: string;
  body: string;
  cta: {
    text: string;
    url: string;
  };
  features: string[];
}

/**
 * Calculate days remaining in trial
 */
export function calculateDaysRemaining(startDate: Date, trialDays: number = 14): number {
  const now = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + trialDays);
  
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
}

/**
 * Determine which reminder should be sent based on trial progress
 */
export function getScheduledReminders(startDate: Date, trialDays: number = 14): TrialNotification[] {
  const reminders: TrialNotification[] = [];
  const daysRemaining = calculateDaysRemaining(startDate, trialDays);
  
  // Day 3 reminder
  if (daysRemaining <= 11 && daysRemaining > 10) {
    reminders.push({
      id: `day_3_${Date.now()}`,
      userId: '',
      type: 'day_3_reminder',
      email: '',
      trialStartDate: startDate,
      scheduledDate: new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000),
      status: 'pending',
      retryCount: 0,
      message: 'Your trial is 3 days in. Explore more features!',
    });
  }
  
  // Day 7 reminder
  if (daysRemaining <= 7 && daysRemaining > 6) {
    reminders.push({
      id: `day_7_${Date.now()}`,
      userId: '',
      type: 'day_7_reminder',
      email: '',
      trialStartDate: startDate,
      scheduledDate: new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000),
      status: 'pending',
      retryCount: 0,
      message: 'Halfway through your trial! See how much you can save.',
    });
  }
  
  // Day 13 reminder (1 day before expiration)
  if (daysRemaining <= 1 && daysRemaining > 0) {
    reminders.push({
      id: `day_13_${Date.now()}`,
      userId: '',
      type: 'day_13_reminder',
      email: '',
      trialStartDate: startDate,
      scheduledDate: new Date(startDate.getTime() + 13 * 24 * 60 * 60 * 1000),
      status: 'pending',
      retryCount: 0,
      message: 'Your trial expires tomorrow! Upgrade now to keep using OAAS.',
    });
  }
  
  return reminders;
}

/**
 * Get notification template based on reminder type
 */
export function getNotificationTemplate(type: TrialNotification['type']): NotificationTemplate {
  const templates: Record<TrialNotification['type'], NotificationTemplate> = {
    day_3_reminder: {
      subject: 'Your OAAS Trial is Underway - Explore More Features',
      title: 'Day 3 of Your Trial',
      headline: 'You\'re off to a great start!',
      body: 'You\'ve been using OAAS for 3 days. Discover advanced features like custom alert rules, webhook integrations, and real-time monitoring to maximize your trial experience.',
      cta: {
        text: 'Explore Advanced Features',
        url: '/dashboard',
      },
      features: ['Custom Alert Rules', 'Webhook Integrations', 'Real-time Monitoring', 'Team Collaboration'],
    },
    day_7_reminder: {
      subject: 'Halfway Through Your OAAS Trial - See Your ROI',
      title: 'Day 7 of Your Trial',
      headline: 'You\'re halfway through!',
      body: 'Check your trial dashboard to see how much you\'ve already saved with OAAS. View your usage metrics, cost savings, and integration status to understand the full value.',
      cta: {
        text: 'View Your Savings',
        url: '/dashboard',
      },
      features: ['Cost Savings Calculator', 'Usage Analytics', 'Integration Status', 'Performance Metrics'],
    },
    day_13_reminder: {
      subject: 'Last Chance: Your OAAS Trial Expires Tomorrow',
      title: 'Day 13 of Your Trial',
      headline: 'Your trial ends tomorrow!',
      body: 'Don\'t lose access to OAAS. Upgrade your account now to continue monitoring your AI systems with advanced observability features. Lock in your pricing today.',
      cta: {
        text: 'Upgrade Now',
        url: '/pricing',
      },
      features: ['Unlimited Alerts', 'Priority Support', 'Advanced Analytics', 'Custom Integrations'],
    },
    expiration_warning: {
      subject: 'Your OAAS Trial Has Expired',
      title: 'Trial Expired',
      headline: 'Your trial has ended',
      body: 'Your OAAS trial has expired. Upgrade to a paid plan to continue using OAAS and maintain your observability infrastructure.',
      cta: {
        text: 'Upgrade to Paid Plan',
        url: '/pricing',
      },
      features: ['Continuous Monitoring', 'Full Feature Access', 'Dedicated Support', 'SLA Guarantee'],
    },
  };
  
  return templates[type];
}

/**
 * Generate notification history for display
 */
export function generateNotificationHistory(startDate: Date): TrialNotification[] {
  const history: TrialNotification[] = [];
  const daysRemaining = calculateDaysRemaining(startDate);
  
  // Simulate sent notifications based on trial progress
  if (daysRemaining < 11) {
    history.push({
      id: 'notif_1',
      userId: 'user_1',
      type: 'day_3_reminder',
      email: 'user@example.com',
      trialStartDate: startDate,
      scheduledDate: new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000),
      sentDate: new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000),
      status: 'sent',
      retryCount: 0,
      message: 'Your trial is 3 days in. Explore more features!',
    });
  }
  
  if (daysRemaining < 7) {
    history.push({
      id: 'notif_2',
      userId: 'user_1',
      type: 'day_7_reminder',
      email: 'user@example.com',
      trialStartDate: startDate,
      scheduledDate: new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000),
      sentDate: new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000),
      status: 'sent',
      retryCount: 0,
      message: 'Halfway through your trial! See how much you can save.',
    });
  }
  
  return history;
}
