import { trackEvent } from "@/lib/analytics";

/**
 * Signature Security Analytics Module
 * 
 * Tracks webhook signature security operations
 */

export function trackSecretKeyGenerated(): void {
  trackEvent({
    category: "feature_interaction",
    action: "secret_key_generated",
    label: "webhook_security",
  });
}

export function trackSecretKeyRotated(): void {
  trackEvent({
    category: "feature_interaction",
    action: "secret_key_rotated",
    label: "webhook_security",
  });
}

export function trackSecretKeyCopied(): void {
  trackEvent({
    category: "feature_interaction",
    action: "secret_key_copied",
    label: "webhook_security",
  });
}

export function trackSignatureVerificationEnabled(): void {
  trackEvent({
    category: "feature_interaction",
    action: "signature_verification_enabled",
    label: "webhook_security",
  });
}

export function trackSignatureVerificationDisabled(): void {
  trackEvent({
    category: "feature_interaction",
    action: "signature_verification_disabled",
    label: "webhook_security",
  });
}

export function trackTestSignatureGenerated(): void {
  trackEvent({
    category: "feature_interaction",
    action: "test_signature_generated",
    label: "webhook_security",
  });
}

export function trackSignatureVerified(result: "valid" | "invalid"): void {
  trackEvent({
    category: "feature_interaction",
    action: "signature_verified",
    label: `result_${result}`,
  });
}

export function trackConfigurationCopied(configType: "secret" | "header" | "signature"): void {
  trackEvent({
    category: "feature_interaction",
    action: "configuration_copied",
    label: `type_${configType}`,
  });
}

export function trackSecuritySettingsViewed(): void {
  trackEvent({
    category: "page_view",
    action: "security_settings_viewed",
    label: "webhook_security",
  });
}

export function trackTestTabViewed(): void {
  trackEvent({
    category: "page_view",
    action: "test_tab_viewed",
    label: "webhook_security",
  });
}
