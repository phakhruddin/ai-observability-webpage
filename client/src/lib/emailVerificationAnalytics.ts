import { trackEvent } from "@/lib/analytics";

/**
 * Email Verification Analytics
 * 
 * Tracks email verification related events
 */

export function trackVerificationEmailSent(email: string): void {
  trackEvent({
    category: "feature_interaction",
    action: "Verification Email Sent",
    label: email.split("@")[1], // Track domain only for privacy
  });
}

export function trackVerificationCodeEntered(success: boolean): void {
  trackEvent({
    category: "feature_interaction",
    action: success ? "Verification Code Verified" : "Verification Code Failed",
    value: success ? "success" : "failed",
  });
}

export function trackVerificationResendRequested(): void {
  trackEvent({
    category: "feature_interaction",
    action: "Verification Resend Requested",
  });
}

export function trackVerificationExpired(): void {
  trackEvent({
    category: "feature_interaction",
    action: "Verification Expired",
  });
}

export function trackVerificationSuccess(email: string): void {
  trackEvent({
    category: "feature_interaction",
    action: "Email Verification Success",
    label: email.split("@")[1], // Track domain only for privacy
  });
}

export function trackVerificationFailed(reason: string): void {
  trackEvent({
    category: "feature_interaction",
    action: "Email Verification Failed",
    label: reason,
  });
}

export function trackVerificationPageView(page: "pending" | "confirm"): void {
  trackEvent({
    category: "page_view",
    action: `Verification ${page === "pending" ? "Pending" : "Confirm"} Page View`,
  });
}

export function trackVerificationCodeCopied(): void {
  trackEvent({
    category: "feature_interaction",
    action: "Verification Code Copied",
  });
}

export function trackVerificationCodeShown(): void {
  trackEvent({
    category: "feature_interaction",
    action: "Verification Code Shown",
  });
}
