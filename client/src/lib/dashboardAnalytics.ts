/**
 * Dashboard Analytics Module
 * 
 * Tracks user interactions and feature usage within the trial dashboard:
 * - Dashboard views
 * - Integration connections
 * - Metric interactions
 * - Recommendation clicks
 * - Upgrade CTAs
 */

import { trackEvent } from "./analytics";

export function trackDashboardView(userId?: string) {
  trackEvent({
    category: "page_view",
    action: "dashboard_viewed",
    label: "Trial Dashboard",
    value: userId,
  });
}

export function trackIntegrationConnect(integrationName: string) {
  trackEvent({
    category: "feature_interaction",
    action: "integration_connect_clicked",
    label: integrationName,
  });
}

export function trackMetricInteraction(metricName: string, action: string) {
  trackEvent({
    category: "feature_interaction",
    action: `metric_${action}`,
    label: metricName,
  });
}

export function trackRecommendationClick(recommendationTitle: string) {
  trackEvent({
    category: "cta_click",
    action: "recommendation_clicked",
    label: recommendationTitle,
  });
}

export function trackUpgradeClick(source: string) {
  trackEvent({
    category: "cta_click",
    action: "upgrade_clicked",
    label: source,
    value: "trial_dashboard",
  });
}

export function trackDashboardExport(exportType: string) {
  trackEvent({
    category: "download",
    action: "dashboard_exported",
    label: exportType,
  });
}

export function trackTrialExtensionRequest() {
  trackEvent({
    category: "cta_click",
    action: "trial_extension_requested",
    label: "Trial Dashboard",
  });
}
