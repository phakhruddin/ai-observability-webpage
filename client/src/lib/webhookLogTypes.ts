/**
 * Webhook Delivery Log Types and Utilities
 * 
 * Defines data structures for webhook delivery tracking:
 * - Delivery log entries
 * - Status codes and response times
 * - Retry attempts
 * - Request/response payloads
 */

export type DeliveryStatus = "success" | "failed" | "pending" | "retrying";

export interface WebhookDeliveryLog {
  id: string;
  webhookId: string;
  webhookUrl: string;
  alertId: string;
  alertTitle: string;
  severity: "critical" | "warning" | "info";
  timestamp: string;
  status: DeliveryStatus;
  statusCode?: number;
  responseTime: number; // milliseconds
  retryCount: number;
  maxRetries: number;
  requestPayload: Record<string, any>;
  responsePayload?: Record<string, any>;
  errorMessage?: string;
  nextRetryAt?: string;
}

export interface WebhookLogFilter {
  webhookId?: string;
  status?: DeliveryStatus;
  severity?: "critical" | "warning" | "info";
  dateRange?: {
    start: string;
    end: string;
  };
  searchQuery?: string;
}

/**
 * Generate mock webhook delivery logs for demonstration
 */
export function generateMockDeliveryLogs(count: number = 20): WebhookDeliveryLog[] {
  const statuses: DeliveryStatus[] = ["success", "failed", "pending", "retrying"];
  const severities: Array<"critical" | "warning" | "info"> = ["critical", "warning", "info"];
  const alerts = [
    "High CPU Usage Detected",
    "Memory Threshold Exceeded",
    "Database Connection Failed",
    "API Response Time Degraded",
    "Disk Space Low",
    "Network Latency Spike",
    "Authentication Service Down",
    "Cache Miss Rate High",
  ];

  const logs: WebhookDeliveryLog[] = [];

  for (let i = 0; i < count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const responseTime = Math.floor(Math.random() * 5000) + 100;
    const retryCount = status === "retrying" ? Math.floor(Math.random() * 3) : status === "failed" ? Math.floor(Math.random() * 5) : 0;

    const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString();

    logs.push({
      id: `delivery-${Date.now()}-${i}`,
      webhookId: `webhook-${Math.floor(Math.random() * 3) + 1}`,
      webhookUrl: `https://api.example.com/webhooks/alerts-${Math.floor(Math.random() * 3) + 1}`,
      alertId: `alert-${Date.now()}-${i}`,
      alertTitle: alerts[Math.floor(Math.random() * alerts.length)],
      severity,
      timestamp,
      status,
      statusCode: status === "success" ? 200 : status === "failed" ? [400, 401, 403, 500, 503][Math.floor(Math.random() * 5)] : undefined,
      responseTime,
      retryCount,
      maxRetries: 5,
      requestPayload: {
        id: `alert-${Date.now()}-${i}`,
        severity,
        title: alerts[Math.floor(Math.random() * alerts.length)],
        timestamp,
      },
      responsePayload: status === "success" ? { status: "received" } : undefined,
      errorMessage: status === "failed" ? "Connection timeout" : status === "retrying" ? "Service temporarily unavailable" : undefined,
      nextRetryAt: status === "retrying" ? new Date(Date.now() + 5 * 60 * 1000).toISOString() : undefined,
    });
  }

  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

/**
 * Get status color for delivery status
 */
export function getStatusColor(status: DeliveryStatus): string {
  const colors: Record<DeliveryStatus, string> = {
    success: "#10b981", // green-500
    failed: "#ef4444", // red-500
    pending: "#f59e0b", // amber-500
    retrying: "#3b82f6", // blue-500
  };
  return colors[status];
}

/**
 * Get status badge class
 */
export function getStatusBadgeClass(status: DeliveryStatus): string {
  const classes: Record<DeliveryStatus, string> = {
    success: "bg-green-500/10 text-green-400 border-green-500/30",
    failed: "bg-red-500/10 text-red-400 border-red-500/30",
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    retrying: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  };
  return classes[status];
}

/**
 * Get status label
 */
export function getStatusLabel(status: DeliveryStatus): string {
  const labels: Record<DeliveryStatus, string> = {
    success: "Delivered",
    failed: "Failed",
    pending: "Pending",
    retrying: "Retrying",
  };
  return labels[status];
}

/**
 * Get severity color
 */
export function getSeverityColor(severity: string): string {
  const colors: Record<string, string> = {
    critical: "#ef4444", // red-500
    warning: "#f59e0b", // amber-500
    info: "#3b82f6", // blue-500
  };
  return colors[severity] || "#6b7280";
}

/**
 * Format response time for display
 */
export function formatResponseTime(ms: number): string {
  if (ms < 1000) {
    return `${Math.round(ms)}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Filter delivery logs
 */
export function filterDeliveryLogs(logs: WebhookDeliveryLog[], filter: WebhookLogFilter): WebhookDeliveryLog[] {
  return logs.filter((log) => {
    if (filter.webhookId && log.webhookId !== filter.webhookId) return false;
    if (filter.status && log.status !== filter.status) return false;
    if (filter.severity && log.severity !== filter.severity) return false;
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      if (!log.alertTitle.toLowerCase().includes(query) && !log.webhookUrl.toLowerCase().includes(query)) {
        return false;
      }
    }
    if (filter.dateRange) {
      const logDate = new Date(log.timestamp);
      const startDate = new Date(filter.dateRange.start);
      const endDate = new Date(filter.dateRange.end);
      if (logDate < startDate || logDate > endDate) return false;
    }
    return true;
  });
}
