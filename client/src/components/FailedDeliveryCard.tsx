import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, RotateCcw, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { RetryTimeline } from "@/components/RetryTimeline";
import { generateMockRetryTimeline } from "@/lib/retryTimelineTypes";
import {
  type FailedDelivery,
  getFailureReasonDescription,
  getFailureReasonColor,
  getRetryStatusDescription,
  formatRetrySchedule,
} from "@/lib/failedDeliveryTypes";

/**
 * FailedDeliveryCard Component
 * 
 * Displays a single failed delivery with retry controls
 * - Shows alert info, failure reason, retry status
 * - Expandable details view
 * - Manual retry button
 * - Delete option
 * 
 * Design: Professional card with status indicators
 */

interface FailedDeliveryCardProps {
  delivery: FailedDelivery;
  onRetry?: (deliveryId: string) => void;
  onDelete?: (deliveryId: string) => void;
}

export function FailedDeliveryCard({
  delivery,
  onRetry,
  onDelete,
}: FailedDeliveryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const retryTimeline = generateMockRetryTimeline(delivery.id, delivery.retryCount);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/10 border-red-500/30 text-red-400";
      case "warning":
        return "bg-yellow-500/10 border-yellow-500/30 text-yellow-400";
      case "info":
        return "bg-blue-500/10 border-blue-500/30 text-blue-400";
      default:
        return "bg-gray-500/10 border-gray-500/30 text-gray-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 border-yellow-500/30 text-yellow-400";
      case "retrying":
        return "bg-blue-500/10 border-blue-500/30 text-blue-400";
      case "succeeded":
        return "bg-green-500/10 border-green-500/30 text-green-400";
      case "failed":
        return "bg-red-500/10 border-red-500/30 text-red-400";
      case "abandoned":
        return "bg-gray-500/10 border-gray-500/30 text-gray-400";
      default:
        return "bg-gray-500/10 border-gray-500/30 text-gray-400";
    }
  };

  const failureTime = new Date(delivery.timestamp);
  const lastAttemptTime = new Date(delivery.lastAttemptTime);
  const nextRetryTime = delivery.nextRetryTime ? new Date(delivery.nextRetryTime) : null;

  return (
    <Card className="bg-card border-border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Alert Title */}
            <h3 className="font-semibold text-foreground mb-2 truncate">
              {delivery.alertTitle}
            </h3>

            {/* Webhook URL */}
            <p className="text-xs text-muted-foreground truncate mb-3">
              {delivery.webhookUrl}
            </p>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-2">
              {/* Severity */}
              <span
                className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(
                  delivery.severity
                )}`}
              >
                {delivery.severity.charAt(0).toUpperCase() + delivery.severity.slice(1)}
              </span>

              {/* Retry Status */}
              <span
                className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getStatusColor(
                  delivery.retryStatus
                )}`}
              >
                {getRetryStatusDescription(delivery.retryStatus)}
              </span>

              {/* Failure Reason */}
              <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border border-current/30 ${getFailureReasonColor(delivery.failureReason)}`}>
                {getFailureReasonDescription(delivery.failureReason)}
              </span>
            </div>
          </div>

          {/* Expand Button */}
          <Button
            onClick={() => setExpanded(!expanded)}
            variant="ghost"
            size="sm"
            className="flex-shrink-0"
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Summary Row */}
      <div className="px-4 py-3 bg-background/50 border-b border-border flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-muted-foreground">Failed:</span>{" "}
            <span className="text-foreground font-medium">
              {failureTime.toLocaleTimeString()}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Retries:</span>{" "}
            <span className="text-foreground font-medium">
              {formatRetrySchedule(delivery.retryCount, delivery.maxRetries)}
            </span>
          </div>
          {nextRetryTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="text-muted-foreground">Next:</span>{" "}
              <span className="text-foreground font-medium">
                {nextRetryTime.toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="p-4 space-y-4 border-t border-border">
          {/* Error Message */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase">
              Error Message
            </h4>
            <div className="p-3 rounded-lg bg-background border border-border">
              <p className="text-xs text-foreground break-words">{delivery.errorMessage}</p>
            </div>
          </div>

          {/* Status Code */}
          {delivery.statusCode && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase">
                HTTP Status
              </h4>
              <div className="p-3 rounded-lg bg-background border border-border">
                <p className="text-xs font-mono text-foreground">{delivery.statusCode}</p>
              </div>
            </div>
          )}

          {/* Payload Preview */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase">
              Payload
            </h4>
            <div className="p-3 rounded-lg bg-background border border-border max-h-32 overflow-y-auto">
              <pre className="text-xs font-mono text-muted-foreground">
                {JSON.stringify(delivery.payload, null, 2)}
              </pre>
            </div>
          </div>

          {/* Retry Timeline */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-3 uppercase">
              Retry Timeline
            </h4>
            <div className="bg-background/50 rounded-lg p-4 border border-border">
              <RetryTimeline timeline={retryTimeline} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t border-border">
            {delivery.retryStatus !== "succeeded" && (
              <Button
                onClick={() => onRetry?.(delivery.id)}
                className="flex-1 flex items-center justify-center gap-2 bg-accent text-accent-foreground hover:opacity-90"
                size="sm"
              >
                <RotateCcw className="w-4 h-4" />
                Retry Now
              </Button>
            )}
            <Button
              onClick={() => onDelete?.(delivery.id)}
              variant="outline"
              className="flex items-center justify-center gap-2 text-red-400 hover:text-red-300"
              size="sm"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
