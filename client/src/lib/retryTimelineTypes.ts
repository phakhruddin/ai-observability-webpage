/**
 * Retry Timeline Types and Utilities
 * 
 * Manages retry event history and timeline visualization
 */

export type RetryEventType = 
  | "initial_failure"
  | "retry_scheduled"
  | "retry_started"
  | "retry_succeeded"
  | "retry_failed"
  | "retry_abandoned";

export interface RetryEvent {
  id: string;
  type: RetryEventType;
  timestamp: string;
  retryAttempt: number;
  statusCode?: number;
  errorMessage?: string;
  responseTime?: number; // milliseconds
  metadata?: Record<string, any>;
}

export interface RetryTimeline {
  deliveryId: string;
  events: RetryEvent[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Generate mock retry timeline
 */
export function generateMockRetryTimeline(deliveryId: string, retryCount: number): RetryTimeline {
  const events: RetryEvent[] = [];
  const now = new Date();

  // Initial failure
  events.push({
    id: `event-0`,
    type: "initial_failure",
    timestamp: new Date(now.getTime() - retryCount * 300000).toISOString(),
    retryAttempt: 0,
    statusCode: 500,
    errorMessage: "Internal Server Error",
    responseTime: 5000,
  });

  // Retry events
  for (let i = 1; i <= retryCount; i++) {
    const retryTime = new Date(now.getTime() - (retryCount - i) * 300000);

    // Retry scheduled
    events.push({
      id: `event-${i}-scheduled`,
      type: "retry_scheduled",
      timestamp: new Date(retryTime.getTime() - 60000).toISOString(),
      retryAttempt: i,
      metadata: {
        delayMs: 5000 * Math.pow(2, i - 1),
      },
    });

    // Retry started
    events.push({
      id: `event-${i}-started`,
      type: "retry_started",
      timestamp: retryTime.toISOString(),
      retryAttempt: i,
    });

    // Retry result (50% success rate for demo)
    const isSuccess = Math.random() > 0.5;
    if (isSuccess) {
      events.push({
        id: `event-${i}-success`,
        type: "retry_succeeded",
        timestamp: new Date(retryTime.getTime() + 2000).toISOString(),
        retryAttempt: i,
        statusCode: 200,
        responseTime: 2000,
      });
      break;
    } else {
      const statusCode = [408, 500, 502, 503][Math.floor(Math.random() * 4)];
      const errorMessages: Record<number, string> = {
        408: "Request Timeout",
        500: "Internal Server Error",
        502: "Bad Gateway",
        503: "Service Unavailable",
      };

      events.push({
        id: `event-${i}-failed`,
        type: "retry_failed",
        timestamp: new Date(retryTime.getTime() + 3000).toISOString(),
        retryAttempt: i,
        statusCode,
        errorMessage: errorMessages[statusCode],
        responseTime: 3000,
      });
    }
  }

  return {
    deliveryId,
    events,
    createdAt: events[0].timestamp,
    updatedAt: events[events.length - 1].timestamp,
  };
}

/**
 * Get event type description
 */
export function getEventTypeDescription(type: RetryEventType): string {
  const descriptions: Record<RetryEventType, string> = {
    initial_failure: "Initial Failure",
    retry_scheduled: "Retry Scheduled",
    retry_started: "Retry Started",
    retry_succeeded: "Retry Succeeded",
    retry_failed: "Retry Failed",
    retry_abandoned: "Retry Abandoned",
  };
  return descriptions[type];
}

/**
 * Get event type icon name
 */
export function getEventTypeIcon(type: RetryEventType): string {
  const icons: Record<RetryEventType, string> = {
    initial_failure: "AlertCircle",
    retry_scheduled: "Clock",
    retry_started: "RotateCcw",
    retry_succeeded: "CheckCircle",
    retry_failed: "XCircle",
    retry_abandoned: "Ban",
  };
  return icons[type];
}

/**
 * Get event type color
 */
export function getEventTypeColor(type: RetryEventType): string {
  const colors: Record<RetryEventType, string> = {
    initial_failure: "bg-red-500/10 border-red-500/30 text-red-400",
    retry_scheduled: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
    retry_started: "bg-blue-500/10 border-blue-500/30 text-blue-400",
    retry_succeeded: "bg-green-500/10 border-green-500/30 text-green-400",
    retry_failed: "bg-red-500/10 border-red-500/30 text-red-400",
    retry_abandoned: "bg-gray-500/10 border-gray-500/30 text-gray-400",
  };
  return colors[type];
}

/**
 * Get event type dot color (for timeline)
 */
export function getEventTypeDotColor(type: RetryEventType): string {
  const colors: Record<RetryEventType, string> = {
    initial_failure: "bg-red-400",
    retry_scheduled: "bg-yellow-400",
    retry_started: "bg-blue-400",
    retry_succeeded: "bg-green-400",
    retry_failed: "bg-red-400",
    retry_abandoned: "bg-gray-400",
  };
  return colors[type];
}

/**
 * Format response time for display
 */
export function formatResponseTime(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Get status code color
 */
export function getStatusCodeColor(statusCode?: number): string {
  if (!statusCode) return "text-gray-400";
  if (statusCode >= 200 && statusCode < 300) return "text-green-400";
  if (statusCode >= 400 && statusCode < 500) return "text-yellow-400";
  if (statusCode >= 500) return "text-red-400";
  return "text-gray-400";
}

/**
 * Calculate total retry duration
 */
export function calculateTotalDuration(events: RetryEvent[]): number {
  if (events.length === 0) return 0;
  const firstEvent = new Date(events[0].timestamp).getTime();
  const lastEvent = new Date(events[events.length - 1].timestamp).getTime();
  return lastEvent - firstEvent;
}

/**
 * Format duration for display
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ${seconds % 60}s`;
}
