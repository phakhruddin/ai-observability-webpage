import { trackEvent } from "@/lib/analytics";

/**
 * Streaming Analytics Module
 * 
 * Tracks real-time log streaming interactions
 */

export function trackStreamingConnected(): void {
  trackEvent({
    category: "feature_interaction",
    action: "streaming_connected",
    label: "webhook_logs_stream",
  });
}

export function trackStreamingDisconnected(): void {
  trackEvent({
    category: "feature_interaction",
    action: "streaming_disconnected",
    label: "webhook_logs_stream",
  });
}

export function trackStreamingPaused(): void {
  trackEvent({
    category: "feature_interaction",
    action: "streaming_paused",
    label: "user_paused",
  });
}

export function trackStreamingResumed(): void {
  trackEvent({
    category: "feature_interaction",
    action: "streaming_resumed",
    label: "user_resumed",
  });
}

export function trackStreamingError(errorType: string): void {
  trackEvent({
    category: "feature_interaction",
    action: "streaming_error",
    label: errorType,
  });
}

export function trackNewLogsReceived(count: number): void {
  trackEvent({
    category: "feature_interaction",
    action: "new_logs_received",
    label: `count_${count}`,
  });
}

export function trackStreamingCleared(count: number): void {
  trackEvent({
    category: "feature_interaction",
    action: "streaming_cleared",
    label: `cleared_${count}_logs`,
  });
}

export function trackStreamingReconnect(attemptNumber: number): void {
  trackEvent({
    category: "feature_interaction",
    action: "streaming_reconnect",
    label: `attempt_${attemptNumber}`,
  });
}
