/**
 * Webhook Integration Types and Utilities
 * 
 * Defines data structures for webhook configuration:
 * - Webhook endpoint configuration
 * - Alert payload format
 * - Authentication methods
 * - Webhook testing and validation
 */

export type WebhookAuthType = "none" | "bearer" | "api_key" | "basic";

export interface WebhookConfig {
  id: string;
  url: string;
  authType: WebhookAuthType;
  authToken?: string;
  apiKeyHeader?: string;
  apiKeyValue?: string;
  basicUsername?: string;
  basicPassword?: string;
  enabled: boolean;
  createdAt: string;
  lastTestedAt?: string;
  testStatus?: "success" | "failed" | "pending";
}

export interface AlertPayload {
  id: string;
  timestamp: string;
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
  source: string;
  tags: Record<string, string>;
  metadata: Record<string, any>;
}

export interface WebhookTestRequest {
  url: string;
  authType: WebhookAuthType;
  authToken?: string;
  apiKeyHeader?: string;
  apiKeyValue?: string;
  basicUsername?: string;
  basicPassword?: string;
  payload: AlertPayload;
}

export interface WebhookTestResult {
  success: boolean;
  statusCode?: number;
  responseTime: number;
  message: string;
  error?: string;
}

/**
 * Generate sample alert payload for webhook testing
 */
export function generateSamplePayload(): AlertPayload {
  return {
    id: `alert-${Date.now()}`,
    timestamp: new Date().toISOString(),
    severity: "warning",
    title: "High CPU Usage Detected",
    description: "CPU usage exceeded 85% threshold on production server",
    source: "prometheus",
    tags: {
      environment: "production",
      service: "api-server",
      region: "us-east-1",
    },
    metadata: {
      cpu_usage: 87.5,
      threshold: 85,
      instance: "prod-api-01",
      duration: "5m",
    },
  };
}

/**
 * Format webhook config for display (hide sensitive data)
 */
export function formatWebhookConfigForDisplay(config: WebhookConfig): Partial<WebhookConfig> {
  const display = { ...config };
  if (display.authToken) display.authToken = "••••••••";
  if (display.apiKeyValue) display.apiKeyValue = "••••••••";
  if (display.basicPassword) display.basicPassword = "••••••••";
  return display;
}

/**
 * Validate webhook URL
 */
export function validateWebhookUrl(url: string): { valid: boolean; error?: string } {
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return { valid: false, error: "URL must use HTTP or HTTPS protocol" };
    }
    return { valid: true };
  } catch {
    return { valid: false, error: "Invalid URL format" };
  }
}

/**
 * Build authorization headers for webhook request
 */
export function buildAuthHeaders(
  authType: WebhookAuthType,
  authToken?: string,
  apiKeyHeader?: string,
  apiKeyValue?: string,
  basicUsername?: string,
  basicPassword?: string
): Record<string, string> {
  const headers: Record<string, string> = {};

  switch (authType) {
    case "bearer":
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }
      break;
    case "api_key":
      if (apiKeyHeader && apiKeyValue) {
        headers[apiKeyHeader] = apiKeyValue;
      }
      break;
    case "basic":
      if (basicUsername && basicPassword) {
        const credentials = btoa(`${basicUsername}:${basicPassword}`);
        headers["Authorization"] = `Basic ${credentials}`;
      }
      break;
    case "none":
    default:
      break;
  }

  return headers;
}

/**
 * Get auth type label for display
 */
export function getAuthTypeLabel(type: WebhookAuthType): string {
  const labels: Record<WebhookAuthType, string> = {
    none: "No Authentication",
    bearer: "Bearer Token",
    api_key: "API Key",
    basic: "Basic Auth",
  };
  return labels[type];
}

/**
 * Get severity color for alert
 */
export function getSeverityColor(severity: AlertPayload["severity"]): string {
  const colors: Record<AlertPayload["severity"], string> = {
    critical: "#ef4444", // red-500
    warning: "#f59e0b", // amber-500
    info: "#3b82f6", // blue-500
  };
  return colors[severity];
}

/**
 * Get severity badge color
 */
export function getSeverityBadgeClass(severity: AlertPayload["severity"]): string {
  const classes: Record<AlertPayload["severity"], string> = {
    critical: "bg-red-500/10 text-red-400 border-red-500/30",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    info: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  };
  return classes[severity];
}
