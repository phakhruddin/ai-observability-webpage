import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle2, Clock, AlertCircle, Mail } from 'lucide-react';
import {
  TrialNotification,
  TrialStatus,
  calculateDaysRemaining,
  getScheduledReminders,
  getNotificationTemplate,
  generateNotificationHistory,
} from '@/lib/trialNotificationTypes';
import {
  trackNotificationView,
  trackNotificationExpanded,
  trackTrialStatusViewed,
  trackNotificationHistoryViewed,
  trackNotificationUpgradeClick,
} from '@/lib/notificationAnalytics';

interface TrialNotificationManagerProps {
  email: string;
  trialStartDate: Date;
  trialDays?: number;
}

export function TrialNotificationManager({
  email,
  trialStartDate,
  trialDays = 14,
}: TrialNotificationManagerProps) {
  const [trialStatus, setTrialStatus] = useState<TrialStatus | null>(null);
  const [scheduledReminders, setScheduledReminders] = useState<TrialNotification[]>([]);
  const [notificationHistory, setNotificationHistory] = useState<TrialNotification[]>([]);
  const [expandedNotification, setExpandedNotification] = useState<string | null>(null);

  useEffect(() => {
    // Calculate trial status
    const daysRemaining = calculateDaysRemaining(trialStartDate, trialDays);
    const endDate = new Date(trialStartDate);
    endDate.setDate(endDate.getDate() + trialDays);

    setTrialStatus({
      email,
      startDate: trialStartDate,
      endDate,
      daysRemaining,
      isExpired: daysRemaining <= 0,
      notificationsSent: [],
    });

    // Get scheduled reminders
    const reminders = getScheduledReminders(trialStartDate, trialDays);
    setScheduledReminders(reminders);

    // Generate notification history
    const history = generateNotificationHistory(trialStartDate);
    setNotificationHistory(history);

    // Track analytics
    trackNotificationView('trial_notification_manager');
    trackTrialStatusViewed(daysRemaining, daysRemaining <= 0);
    if (history.length > 0) {
      trackNotificationHistoryViewed(history.length);
    }
  }, [email, trialStartDate, trialDays]);

  if (!trialStatus) return null;

  const getStatusColor = (daysRemaining: number) => {
    if (daysRemaining <= 0) return 'bg-red-500/10 border-red-500/20';
    if (daysRemaining <= 1) return 'bg-red-500/10 border-red-500/20';
    if (daysRemaining <= 3) return 'bg-yellow-500/10 border-yellow-500/20';
    return 'bg-green-500/10 border-green-500/20';
  };

  const getStatusText = (daysRemaining: number) => {
    if (daysRemaining <= 0) return 'Expired';
    if (daysRemaining === 1) return '1 day left';
    return `${daysRemaining} days left`;
  };

  const getStatusIcon = (daysRemaining: number) => {
    if (daysRemaining <= 0) return <AlertCircle className="w-4 h-4 text-red-500" />;
    if (daysRemaining <= 3) return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    return <CheckCircle2 className="w-4 h-4 text-green-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Trial Status Overview */}
      <Card className={`border ${getStatusColor(trialStatus.daysRemaining)}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon(trialStatus.daysRemaining)}
              <div>
                <CardTitle>Trial Status</CardTitle>
                <CardDescription>{trialStatus.email}</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-lg px-3 py-1">
              {getStatusText(trialStatus.daysRemaining)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Start Date</p>
              <p className="font-semibold">
                {trialStatus.startDate.toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">End Date</p>
              <p className="font-semibold">
                {trialStatus.endDate.toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Days Used</p>
              <p className="font-semibold">
                {trialDays - trialStatus.daysRemaining} / {trialDays}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Reminders */}
      {scheduledReminders.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              <div>
                <CardTitle>Upcoming Reminders</CardTitle>
                <CardDescription>
                  Automated emails to help you get the most from your trial
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scheduledReminders.map((reminder) => {
                const template = getNotificationTemplate(reminder.type);
                const isExpanded = expandedNotification === reminder.id;

                return (
                  <div
                    key={reminder.id}
                    className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div
                      className="flex items-start justify-between cursor-pointer"
                      onClick={() =>
                        setExpandedNotification(isExpanded ? null : reminder.id)
                      }
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <Mail className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-semibold">{template.subject}</p>
                          <p className="text-sm text-muted-foreground">
                            {reminder.scheduledDate.toLocaleDateString()} at{' '}
                            {reminder.scheduledDate.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">Pending</Badge>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-border space-y-3">
                        <div>
                          <p className="font-semibold text-sm mb-2">Preview:</p>
                          <div className="bg-muted/50 rounded p-3 space-y-2">
                            <p className="font-semibold text-sm">{template.headline}</p>
                            <p className="text-sm text-muted-foreground">
                              {template.body}
                            </p>
                            <div className="pt-2">
                              <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                                {template.cta.text}
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-sm mb-2">Highlights:</p>
                          <div className="grid grid-cols-2 gap-2">
                            {template.features.map((feature) => (
                              <div key={feature} className="text-sm flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notification History */}
      {notificationHistory.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <div>
                <CardTitle>Notification History</CardTitle>
                <CardDescription>
                  Emails you've already received during your trial
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notificationHistory.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-semibold text-sm">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">
                        Sent on{' '}
                        {notification.sentDate?.toLocaleDateString() || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-500/10">
                    Delivered
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trial Expiration Warning */}
      {trialStatus.daysRemaining <= 1 && !trialStatus.isExpired && (
        <Card className="border-red-500/30 bg-red-500/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <div>
                <CardTitle className="text-red-600">Trial Expiring Soon</CardTitle>
                <CardDescription>
                  Your trial will expire in {trialStatus.daysRemaining} day
                  {trialStatus.daysRemaining !== 1 ? 's' : ''}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              Upgrade to a paid plan now to continue using OAAS and maintain your
              observability infrastructure without interruption.
            </p>
            <Button className="bg-teal-600 hover:bg-teal-700">
              Upgrade to Paid Plan
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Trial Expired */}
      {trialStatus.isExpired && (
        <Card className="border-red-500/30 bg-red-500/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <div>
                <CardTitle className="text-red-600">Trial Expired</CardTitle>
                <CardDescription>
                  Your trial ended on {trialStatus.endDate.toLocaleDateString()}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              Your OAAS trial has expired. Upgrade to a paid plan to regain access
              and continue monitoring your AI systems.
            </p>
            <Button className="bg-teal-600 hover:bg-teal-700">
              Upgrade Now
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
