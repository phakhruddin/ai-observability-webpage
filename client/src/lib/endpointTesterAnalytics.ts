import { trackEvent } from "@/lib/analytics";

/**
 * Endpoint Tester Analytics Module
 * 
 * Tracks webhook endpoint tester interactions
 */

export function trackTesterOpened(): void {
  trackEvent({
    category: "feature_interaction",
    action: "endpoint_tester_opened",
    label: "webhook_endpoint_tester",
  });
}

export function trackTestSent(payloadType: string, includeSignature: boolean): void {
  trackEvent({
    category: "feature_interaction",
    action: "test_sent",
    label: `${payloadType}_${includeSignature ? "signed" : "unsigned"}`,
  });
}

export function trackTestSuccess(responseTime: number, statusCode: number): void {
  trackEvent({
    category: "feature_interaction",
    action: "test_success",
    label: `${statusCode}_${responseTime}ms`,
  });
}

export function trackTestError(errorType: string): void {
  trackEvent({
    category: "feature_interaction",
    action: "test_error",
    label: errorType,
  });
}

export function trackPayloadTypeChanged(payloadType: string): void {
  trackEvent({
    category: "feature_interaction",
    action: "payload_type_changed",
    label: payloadType,
  });
}

export function trackSignatureToggled(enabled: boolean): void {
  trackEvent({
    category: "feature_interaction",
    action: "signature_toggled",
    label: enabled ? "enabled" : "disabled",
  });
}

export function trackResponseCopied(section: string): void {
  trackEvent({
    category: "feature_interaction",
    action: "response_copied",
    label: section,
  });
}

export function trackTestHistoryViewed(): void {
  trackEvent({
    category: "feature_interaction",
    action: "test_history_viewed",
    label: "endpoint_tester",
  });
}
