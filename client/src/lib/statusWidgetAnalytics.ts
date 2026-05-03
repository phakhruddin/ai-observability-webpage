/**
 * Status Widget Analytics Module
 * 
 * Tracks user interactions with status widget:
 * - Widget views
 * - Status refreshes
 * - Diagnostic checks
 * - Quick action clicks
 * - Troubleshooting access
 */

import { trackEvent } from "./analytics";

export function trackStatusWidgetView(location: "slack-integration" | "dashboard") {
  trackEvent({
    category: "feature_interaction",
    action: "status_widget_viewed",
    label: `Status Widget - ${location}`,
  });
}

export function trackStatusRefresh(overallHealth: string) {
  trackEvent({
    category: "feature_interaction",
    action: "status_refreshed",
    label: `Health: ${overallHealth}`,
  });
}

export function trackDiagnosticCheck(checkName: string, status: string) {
  trackEvent({
    category: "feature_interaction",
    action: "diagnostic_check_viewed",
    label: `${checkName} - ${status}`,
  });
}

export function trackQuickAction(actionName: string) {
  trackEvent({
    category: "feature_interaction",
    action: "quick_action_clicked",
    label: actionName,
  });
}

export function trackTestMessageSent() {
  trackEvent({
    category: "feature_interaction",
    action: "test_message_sent",
    label: "Slack Status Widget",
  });
}

export function trackPermissionsReview() {
  trackEvent({
    category: "feature_interaction",
    action: "permissions_reviewed",
    label: "Slack Status Widget",
  });
}

export function trackSlackAppSettings() {
  trackEvent({
    category: "cta_click",
    action: "slack_app_settings_opened",
    label: "Status Widget",
  });
}

export function trackReconnect() {
  trackEvent({
    category: "feature_interaction",
    action: "slack_reconnect_attempted",
    label: "Status Widget",
  });
}

export function trackTroubleshootingTip(tipIndex: number) {
  trackEvent({
    category: "feature_interaction",
    action: "troubleshooting_tip_viewed",
    label: `Tip ${tipIndex + 1}`,
  });
}
