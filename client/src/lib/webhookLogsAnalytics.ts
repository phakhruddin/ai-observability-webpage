import { trackEvent } from "@/lib/analytics";

/**
 * Webhook Logs Analytics Module
 * 
 * Tracks webhook logs page interactions and viewing patterns
 */

export function trackWebhookLogsViewed(): void {
  trackEvent({
    category: "page_view",
    action: "webhook_logs_viewed",
    label: "webhook_logs_page",
  });
}

export function trackLogExpanded(status: string): void {
  trackEvent({
    category: "feature_interaction",
    action: "log_expanded",
    label: `status_${status}`,
  });
}

export function trackFilterApplied(filterType: string, filterValue: string): void {
  trackEvent({
    category: "feature_interaction",
    action: "filter_applied",
    label: `${filterType}_${filterValue}`,
  });
}

export function trackSearchPerformed(query: string): void {
  trackEvent({
    category: "feature_interaction",
    action: "search_performed",
    label: `query_length_${query.length}`,
  });
}

export function trackLogsExported(count: number): void {
  trackEvent({
    category: "feature_interaction",
    action: "logs_exported",
    label: `exported_${count}_logs`,
  });
}

export function trackPayloadCopied(payloadType: "request" | "response"): void {
  trackEvent({
    category: "feature_interaction",
    action: "payload_copied",
    label: `${payloadType}_payload`,
  });
}

export function trackLogDetailViewed(status: string, severity: string): void {
  trackEvent({
    category: "feature_interaction",
    action: "log_detail_viewed",
    label: `${status}_${severity}`,
  });
}
