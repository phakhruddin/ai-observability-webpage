import { trackEvent } from "@/lib/analytics";

/**
 * Failed Deliveries Analytics Module
 * 
 * Tracks failed delivery monitoring and retry operations
 */

export function trackFailedDeliveriesDashboardViewed(): void {
  trackEvent({
    category: "page_view",
    action: "failed_deliveries_dashboard_viewed",
    label: "webhook_monitoring",
  });
}

export function trackManualRetryInitiated(deliveryCount: number): void {
  trackEvent({
    category: "feature_interaction",
    action: "manual_retry_initiated",
    label: `count_${deliveryCount}`,
  });
}

export function trackRetryAllInitiated(deliveryCount: number): void {
  trackEvent({
    category: "feature_interaction",
    action: "retry_all_initiated",
    label: `count_${deliveryCount}`,
  });
}

export function trackDeliveryDeleted(): void {
  trackEvent({
    category: "feature_interaction",
    action: "delivery_deleted",
    label: "webhook_monitoring",
  });
}

export function trackAutoRetryToggled(enabled: boolean): void {
  trackEvent({
    category: "feature_interaction",
    action: "auto_retry_toggled",
    label: enabled ? "enabled" : "disabled",
  });
}

export function trackDashboardFiltered(filterType: string): void {
  trackEvent({
    category: "feature_interaction",
    action: "dashboard_filtered",
    label: filterType,
  });
}

export function trackDashboardSearched(query: string): void {
  trackEvent({
    category: "feature_interaction",
    action: "dashboard_searched",
    label: `query_length_${query.length}`,
  });
}

export function trackDeliveryDetailsExpanded(): void {
  trackEvent({
    category: "feature_interaction",
    action: "delivery_details_expanded",
    label: "webhook_monitoring",
  });
}

export function trackDashboardRefreshed(): void {
  trackEvent({
    category: "feature_interaction",
    action: "dashboard_refreshed",
    label: "webhook_monitoring",
  });
}
