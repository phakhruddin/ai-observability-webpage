import { trackEvent } from "@/lib/analytics";

/**
 * Webhook Analytics Module
 * 
 * Tracks webhook configuration and testing interactions
 */

export function trackWebhookConfigured(authType: string): void {
  trackEvent({
    category: "feature_interaction",
    action: "webhook_configured",
    label: `auth_type_${authType}`,
  });
}

export function trackWebhookTested(success: boolean, authType: string): void {
  trackEvent({
    category: "feature_interaction",
    action: "webhook_tested",
    label: `${success ? "success" : "failed"}_${authType}`,
  });
}

export function trackWebhookEnabled(enabled: boolean): void {
  trackEvent({
    category: "feature_interaction",
    action: "webhook_toggled",
    label: enabled ? "enabled" : "disabled",
  });
}

export function trackWebhookDeleted(): void {
  trackEvent({
    category: "feature_interaction",
    action: "webhook_deleted",
    label: "webhook_removed",
  });
}

export function trackWebhookGuideViewed(): void {
  trackEvent({
    category: "page_view",
    action: "guide_viewed",
    label: "webhook_guide",
  });
}

export function trackPayloadCopied(): void {
  trackEvent({
    category: "feature_interaction",
    action: "payload_copied",
    label: "sample_payload",
  });
}

export function trackAuthMethodChanged(fromAuth: string, toAuth: string): void {
  trackEvent({
    category: "feature_interaction",
    action: "auth_method_changed",
    label: `${fromAuth}_to_${toAuth}`,
  });
}
