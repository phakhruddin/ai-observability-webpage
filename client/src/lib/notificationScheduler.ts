/**
 * Notification Scheduler
 * Handles scheduling and sending trial expiration reminders
 */

import {
  TrialNotification,
  NotificationTemplate,
  getNotificationTemplate,
} from './trialNotificationTypes';

export interface EmailContent {
  to: string;
  subject: string;
  html: string;
  text: string;
}

/**
 * Generate HTML email template for trial notifications
 */
export function generateEmailHTML(
  template: NotificationTemplate,
  userName: string,
  companyName?: string
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f9fafb;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            padding: 40px 20px;
            text-align: center;
            color: white;
          }
          .header h1 {
            margin: 0 0 10px 0;
            font-size: 28px;
            font-weight: 700;
          }
          .header p {
            margin: 0;
            font-size: 14px;
            opacity: 0.9;
          }
          .content {
            padding: 40px 30px;
          }
          .content h2 {
            color: #0f172a;
            font-size: 24px;
            margin: 0 0 15px 0;
          }
          .content p {
            margin: 0 0 15px 0;
            font-size: 16px;
            line-height: 1.6;
            color: #555;
          }
          .features {
            background-color: #f3f4f6;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
          }
          .features h3 {
            margin: 0 0 15px 0;
            font-size: 16px;
            color: #0f172a;
          }
          .features ul {
            margin: 0;
            padding-left: 20px;
            list-style: none;
          }
          .features li {
            margin: 8px 0;
            padding-left: 25px;
            position: relative;
            color: #555;
          }
          .features li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #10b981;
            font-weight: bold;
          }
          .cta-button {
            display: inline-block;
            background-color: #14b8a6;
            color: white;
            padding: 14px 32px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 16px;
            margin: 25px 0;
            transition: background-color 0.3s;
          }
          .cta-button:hover {
            background-color: #0d9488;
          }
          .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #999;
          }
          .footer a {
            color: #14b8a6;
            text-decoration: none;
          }
          .footer p {
            margin: 5px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>OAAS</h1>
            <p>AI Observability Platform</p>
          </div>
          
          <div class="content">
            <h2>${template.headline}</h2>
            <p>Hi ${userName},</p>
            <p>${template.body}</p>
            
            <div class="features">
              <h3>Highlighted Features:</h3>
              <ul>
                ${template.features.map((feature) => `<li>${feature}</li>`).join('')}
              </ul>
            </div>
            
            <center>
              <a href="${template.cta.url}" class="cta-button">${template.cta.text}</a>
            </center>
            
            <p style="font-size: 14px; color: #999; margin-top: 30px;">
              Questions? Contact our support team at support@oaas.com or reply to this email.
            </p>
          </div>
          
          <div class="footer">
            <p>&copy; 2026 OAAS. All rights reserved.</p>
            <p>
              <a href="#">Unsubscribe</a> | 
              <a href="#">Preferences</a> | 
              <a href="#">Help</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Generate plain text email template
 */
export function generateEmailText(
  template: NotificationTemplate,
  userName: string
): string {
  return `
OAAS - AI Observability Platform

${template.headline}

Hi ${userName},

${template.body}

Highlighted Features:
${template.features.map((f) => `- ${f}`).join('\n')}

${template.cta.text}
${template.cta.url}

Questions? Contact our support team at support@oaas.com

© 2026 OAAS. All rights reserved.
  `.trim();
}

/**
 * Create email content from notification
 */
export function createEmailContent(
  notification: TrialNotification,
  userName: string,
  companyName?: string
): EmailContent {
  const template = getNotificationTemplate(notification.type);

  return {
    to: notification.email,
    subject: template.subject,
    html: generateEmailHTML(template, userName, companyName),
    text: generateEmailText(template, userName),
  };
}

/**
 * Simulate sending email (in production, use actual email service)
 */
export async function sendNotificationEmail(
  emailContent: EmailContent
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Simulate API call to email service
    console.log('Sending email to:', emailContent.to);
    console.log('Subject:', emailContent.subject);

    // In production, this would call a backend API or email service like SendGrid, AWS SES, etc.
    // For now, we'll simulate success
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Store in localStorage for demo purposes
    const sentEmails = JSON.parse(localStorage.getItem('sentEmails') || '[]');
    sentEmails.push({
      messageId,
      to: emailContent.to,
      subject: emailContent.subject,
      sentAt: new Date().toISOString(),
    });
    localStorage.setItem('sentEmails', JSON.stringify(sentEmails));

    return { success: true, messageId };
  } catch (error) {
    console.error('Failed to send email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Schedule notification reminders for a trial user
 */
export async function scheduleTrialNotifications(
  email: string,
  trialStartDate: Date,
  userName: string,
  companyName?: string
): Promise<TrialNotification[]> {
  const notifications: TrialNotification[] = [];
  const reminderDays = [3, 7, 13];

  for (const day of reminderDays) {
    const scheduledDate = new Date(trialStartDate);
    scheduledDate.setDate(scheduledDate.getDate() + day);

    const type =
      day === 3
        ? 'day_3_reminder'
        : day === 7
          ? 'day_7_reminder'
          : 'day_13_reminder';

    const notification: TrialNotification = {
      id: `notif_${day}_${Date.now()}`,
      userId: '',
      type: type as TrialNotification['type'],
      email,
      trialStartDate,
      scheduledDate,
      status: 'pending',
      retryCount: 0,
      message: `Day ${day} trial reminder`,
    };

    notifications.push(notification);
  }

  return notifications;
}

/**
 * Process scheduled notifications (should be called by backend cron job)
 */
export async function processScheduledNotifications(
  notifications: TrialNotification[],
  userName: string,
  companyName?: string
): Promise<void> {
  const now = new Date();

  for (const notification of notifications) {
    // Check if it's time to send
    if (
      notification.status === 'pending' &&
      notification.scheduledDate <= now &&
      notification.retryCount < 3
    ) {
      try {
        const emailContent = createEmailContent(notification, userName, companyName);
        const result = await sendNotificationEmail(emailContent);

        if (result.success) {
          notification.status = 'sent';
          notification.sentDate = now;
        } else {
          notification.retryCount++;
        }
      } catch (error) {
        notification.retryCount++;
        console.error('Error processing notification:', error);
      }
    }
  }
}

/**
 * Get notification history from localStorage
 */
export function getNotificationHistory(): Array<{
  messageId: string;
  to: string;
  subject: string;
  sentAt: string;
}> {
  try {
    return JSON.parse(localStorage.getItem('sentEmails') || '[]');
  } catch {
    return [];
  }
}
