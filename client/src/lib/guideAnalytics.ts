/**
 * Guide Analytics Module
 * 
 * Tracks user interactions with integration guides:
 * - Guide page views
 * - Code block copies
 * - Tab switches
 * - CTA clicks
 */

import { trackEvent } from "./analytics";

export function trackGuideView(guideName: string) {
  trackEvent({
    category: "page_view",
    action: "guide_viewed",
    label: guideName,
  });
}

export function trackCodeBlockCopy(guideName: string, language: string) {
  trackEvent({
    category: "feature_interaction",
    action: "code_block_copied",
    label: `${guideName} - ${language}`,
  });
}

export function trackTabSwitch(guideName: string, tabName: string) {
  trackEvent({
    category: "feature_interaction",
    action: "guide_tab_switched",
    label: `${guideName} - ${tabName}`,
  });
}

export function trackGuideCtaClick(guideName: string, ctaText: string) {
  trackEvent({
    category: "cta_click",
    action: "guide_cta_clicked",
    label: `${guideName} - ${ctaText}`,
  });
}

export function trackSlackGuideStart() {
  trackEvent({
    category: "cta_click",
    action: "slack_guide_started",
    label: "Slack Integration Guide",
  });
}

export function trackSlackBotSetup() {
  trackEvent({
    category: "feature_interaction",
    action: "slack_bot_setup_initiated",
    label: "Slack Integration",
  });
}

export function trackSlackChannelConfig() {
  trackEvent({
    category: "feature_interaction",
    action: "slack_channel_config_viewed",
    label: "Slack Integration",
  });
}

export function trackSlackNotificationTest() {
  trackEvent({
    category: "feature_interaction",
    action: "slack_notification_test_sent",
    label: "Slack Integration",
  });
}
