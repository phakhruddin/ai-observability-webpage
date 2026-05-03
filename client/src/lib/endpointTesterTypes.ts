/**
 * Webhook Endpoint Tester Types and Utilities
 * 
 * Manages test requests, responses, and payload generation
 */

export type TestPayloadType = 
  | "alert"
  | "metric"
  | "log"
  | "event"
  | "custom";

export type TestStatus = 
  | "idle"
  | "loading"
  | "success"
  | "error"
  | "timeout";

export interface TestPayload {
  id: string;
  type: TestPayloadType;
  title: string;
  description: string;
  payload: Record<string, any>;
}

export interface TestRequest {
  id: string;
  timestamp: string;
  endpoint: string;
  method: "POST" | "PUT";
  headers: Record<string, string>;
  payload: Record<string, any>;
  signature?: string;
  signatureHeader?: string;
}

export interface TestResponse {
  id: string;
  requestId: string;
  timestamp: string;
  statusCode: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  responseTime: number; // milliseconds
  success: boolean;
}

export interface TestResult {
  request: TestRequest;
  response?: TestResponse;
  status: TestStatus;
  error?: string;
}

/**
 * Generate sample alert payload
 */
export function generateAlertPayload(): Record<string, any> {
  return {
    id: `alert-${Date.now()}`,
    type: "alert",
    severity: "critical",
    title: "High CPU Usage Detected",
    description: "CPU usage exceeded 90% threshold for 5 minutes",
    service: "api-server",
    timestamp: new Date().toISOString(),
    metrics: {
      cpu_usage: 92.5,
      memory_usage: 78.3,
      disk_usage: 45.2,
    },
    tags: {
      environment: "production",
      region: "us-west-2",
      team: "platform",
    },
  };
}

/**
 * Generate sample metric payload
 */
export function generateMetricPayload(): Record<string, any> {
  return {
    id: `metric-${Date.now()}`,
    type: "metric",
    name: "request_latency",
    value: 245.5,
    unit: "ms",
    timestamp: new Date().toISOString(),
    labels: {
      service: "api",
      endpoint: "/api/users",
      method: "GET",
      status: "200",
    },
    tags: {
      environment: "production",
      region: "us-west-2",
    },
  };
}

/**
 * Generate sample log payload
 */
export function generateLogPayload(): Record<string, any> {
  return {
    id: `log-${Date.now()}`,
    type: "log",
    level: "ERROR",
    message: "Database connection timeout",
    service: "api-server",
    timestamp: new Date().toISOString(),
    context: {
      userId: "user-12345",
      requestId: "req-67890",
      duration: 5000,
    },
    stackTrace: "Error: Connection timeout\n  at Database.connect (db.js:45)\n  at async main (app.js:12)",
    tags: {
      environment: "production",
      region: "us-west-2",
    },
  };
}

/**
 * Generate sample event payload
 */
export function generateEventPayload(): Record<string, any> {
  return {
    id: `event-${Date.now()}`,
    type: "event",
    name: "deployment_completed",
    timestamp: new Date().toISOString(),
    actor: "ci-pipeline",
    details: {
      service: "api-server",
      version: "2.5.1",
      environment: "production",
      duration: 1250,
      status: "success",
    },
    tags: {
      team: "platform",
      region: "us-west-2",
    },
  };
}

/**
 * Get sample payload by type
 */
export function getSamplePayload(type: TestPayloadType): Record<string, any> {
  switch (type) {
    case "alert":
      return generateAlertPayload();
    case "metric":
      return generateMetricPayload();
    case "log":
      return generateLogPayload();
    case "event":
      return generateEventPayload();
    case "custom":
      return {};
    default:
      return generateAlertPayload();
  }
}

/**
 * Get payload type description
 */
export function getPayloadTypeDescription(type: TestPayloadType): string {
  const descriptions: Record<TestPayloadType, string> = {
    alert: "Alert Notification",
    metric: "Metric Data",
    log: "Log Entry",
    event: "System Event",
    custom: "Custom Payload",
  };
  return descriptions[type];
}

/**
 * Get test status color
 */
export function getTestStatusColor(status: TestStatus): string {
  const colors: Record<TestStatus, string> = {
    idle: "bg-gray-500/10 border-gray-500/30 text-gray-400",
    loading: "bg-blue-500/10 border-blue-500/30 text-blue-400",
    success: "bg-green-500/10 border-green-500/30 text-green-400",
    error: "bg-red-500/10 border-red-500/30 text-red-400",
    timeout: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
  };
  return colors[status];
}

/**
 * Get status code color
 */
export function getStatusCodeColor(statusCode: number): string {
  if (statusCode >= 200 && statusCode < 300) return "text-green-400";
  if (statusCode >= 300 && statusCode < 400) return "text-blue-400";
  if (statusCode >= 400 && statusCode < 500) return "text-yellow-400";
  if (statusCode >= 500) return "text-red-400";
  return "text-gray-400";
}

/**
 * Validate endpoint URL
 */
export function validateEndpointUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Format response time
 */
export function formatResponseTime(ms: number): string {
  if (ms < 1000) {
    return `${Math.round(ms)}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Format JSON for display
 */
export function formatJson(obj: Record<string, any>): string {
  return JSON.stringify(obj, null, 2);
}

/**
 * Parse JSON safely
 */
export function parseJsonSafely(json: string): Record<string, any> | null {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}
