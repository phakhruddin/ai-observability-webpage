/**
 * Failed Delivery Types and Utilities
 * 
 * Manages failed webhook delivery tracking and retry logic
 */

export type FailureReason = 
  | "timeout"
  | "connection_refused"
  | "invalid_response"
  | "server_error"
  | "authentication_failed"
  | "rate_limited"
  | "unknown";

export type RetryStatus = "pending" | "retrying" | "succeeded" | "failed" | "abandoned";

export interface FailedDelivery {
  id: string;
  webhookId: string;
  webhookUrl: string;
  alertId: string;
  alertTitle: string;
  severity: "critical" | "warning" | "info";
  timestamp: string;
  failureReason: FailureReason;
  statusCode?: number;
  errorMessage: string;
  retryCount: number;
  maxRetries: number;
  nextRetryTime?: string;
  retryStatus: RetryStatus;
  payload: Record<string, any>;
  lastAttemptTime: string;
}

export interface RetrySchedule {
  deliveryId: string;
  retryAttempt: number;
  scheduledTime: string;
  status: "pending" | "in_progress" | "completed" | "failed";
}

export interface FailedDeliveryFilter {
  status?: RetryStatus;
  severity?: "critical" | "warning" | "info" | "all";
  reason?: FailureReason | "all";
  searchQuery?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

/**
 * Generate mock failed delivery data
 */
export function generateMockFailedDeliveries(count: number): FailedDelivery[] {
  const reasons: FailureReason[] = [
    "timeout",
    "connection_refused",
    "invalid_response",
    "server_error",
    "authentication_failed",
    "rate_limited",
  ];

  const severities: Array<"critical" | "warning" | "info"> = ["critical", "warning", "info"];
  const statuses: RetryStatus[] = ["pending", "retrying", "succeeded", "failed", "abandoned"];

  const deliveries: FailedDelivery[] = [];

  for (let i = 0; i < count; i++) {
    const now = new Date();
    const failureTime = new Date(now.getTime() - Math.random() * 86400000); // Last 24 hours

    deliveries.push({
      id: `failed-${i + 1}`,
      webhookId: `webhook-${Math.floor(Math.random() * 3) + 1}`,
      webhookUrl: `https://api.example.com/webhooks/alerts-${Math.floor(Math.random() * 3) + 1}`,
      alertId: `alert-${Math.floor(Math.random() * 1000)}`,
      alertTitle: [
        "High CPU Usage Detected",
        "Memory Threshold Exceeded",
        "Database Connection Failed",
        "API Response Time Degraded",
        "Disk Space Low",
        "Service Unavailable",
        "Authentication Timeout",
      ][Math.floor(Math.random() * 7)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      timestamp: failureTime.toISOString(),
      failureReason: reasons[Math.floor(Math.random() * reasons.length)],
      statusCode: Math.random() > 0.5 ? Math.floor(Math.random() * 500) + 400 : undefined,
      errorMessage: [
        "Connection timeout after 30 seconds",
        "Connection refused: endpoint unreachable",
        "Invalid JSON response from server",
        "500 Internal Server Error",
        "401 Unauthorized: invalid credentials",
        "429 Too Many Requests: rate limit exceeded",
        "Unknown error occurred",
      ][Math.floor(Math.random() * 7)],
      retryCount: Math.floor(Math.random() * 3),
      maxRetries: 5,
      nextRetryTime: new Date(now.getTime() + Math.random() * 3600000).toISOString(),
      retryStatus: statuses[Math.floor(Math.random() * statuses.length)],
      payload: {
        id: `alert-${Math.floor(Math.random() * 1000)}`,
        severity: severities[Math.floor(Math.random() * severities.length)],
        timestamp: failureTime.toISOString(),
      },
      lastAttemptTime: failureTime.toISOString(),
    });
  }

  return deliveries;
}

/**
 * Get failure reason description
 */
export function getFailureReasonDescription(reason: FailureReason): string {
  const descriptions: Record<FailureReason, string> = {
    timeout: "Request timed out",
    connection_refused: "Connection refused",
    invalid_response: "Invalid response format",
    server_error: "Server error (5xx)",
    authentication_failed: "Authentication failed",
    rate_limited: "Rate limited (429)",
    unknown: "Unknown error",
  };
  return descriptions[reason];
}

/**
 * Get failure reason color
 */
export function getFailureReasonColor(reason: FailureReason): string {
  const colors: Record<FailureReason, string> = {
    timeout: "text-yellow-400",
    connection_refused: "text-red-400",
    invalid_response: "text-orange-400",
    server_error: "text-red-400",
    authentication_failed: "text-purple-400",
    rate_limited: "text-blue-400",
    unknown: "text-gray-400",
  };
  return colors[reason];
}

/**
 * Get retry status description
 */
export function getRetryStatusDescription(status: RetryStatus): string {
  const descriptions: Record<RetryStatus, string> = {
    pending: "Waiting for retry",
    retrying: "Retrying now",
    succeeded: "Successfully delivered",
    failed: "Failed permanently",
    abandoned: "Retry abandoned",
  };
  return descriptions[status];
}

/**
 * Calculate next retry time based on exponential backoff
 */
export function calculateNextRetryTime(retryCount: number, baseDelayMs: number = 5000): Date {
  const delayMs = baseDelayMs * Math.pow(2, retryCount);
  const maxDelayMs = 3600000; // 1 hour max
  const actualDelayMs = Math.min(delayMs, maxDelayMs);
  return new Date(Date.now() + actualDelayMs);
}

/**
 * Format retry schedule display
 */
export function formatRetrySchedule(retryCount: number, maxRetries: number): string {
  return `${retryCount}/${maxRetries}`;
}

/**
 * Filter failed deliveries
 */
export function filterFailedDeliveries(
  deliveries: FailedDelivery[],
  filter: FailedDeliveryFilter
): FailedDelivery[] {
  return deliveries.filter((delivery) => {
    // Status filter
    if (filter.status && delivery.retryStatus !== filter.status) {
      return false;
    }

    // Severity filter
    if (filter.severity && filter.severity !== "all" && delivery.severity !== filter.severity) {
      return false;
    }

    // Reason filter
    if (filter.reason && filter.reason !== "all" && delivery.failureReason !== filter.reason) {
      return false;
    }

    // Search filter
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      const searchableText = `${delivery.alertTitle} ${delivery.webhookUrl} ${delivery.errorMessage}`.toLowerCase();
      if (!searchableText.includes(query)) {
        return false;
      }
    }

    // Date range filter
    if (filter.dateRange) {
      const deliveryTime = new Date(delivery.timestamp).getTime();
      const startTime = new Date(filter.dateRange.start).getTime();
      const endTime = new Date(filter.dateRange.end).getTime();
      if (deliveryTime < startTime || deliveryTime > endTime) {
        return false;
      }
    }

    return true;
  });
}
