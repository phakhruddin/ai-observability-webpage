import { useState } from "react";
import { trackEventExpanded, trackEventCollapsed, trackEventClicked } from "@/lib/retryTimelineAnalytics";
import { ChevronDown, ChevronUp, AlertCircle, Clock, RotateCcw, CheckCircle, XCircle, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type RetryEvent,
  getEventTypeDescription,
  getEventTypeDotColor,
  getEventTypeColor,
  formatResponseTime,
  getStatusCodeColor,
} from "@/lib/retryTimelineTypes";

/**
 * RetryEventItem Component
 * 
 * Displays a single event in the retry timeline:
 * - Event type with icon
 * - Timestamp
 * - Status code and response time
 * - Error message
 * - Expandable details
 * 
 * Design: Compact timeline event with hover effects
 */

interface RetryEventItemProps {
  event: RetryEvent;
  isFirst?: boolean;
  isLast?: boolean;
  onClick?: () => void;
}

export function RetryEventItem({
  event,
  isFirst = false,
  isLast = false,
  onClick,
}: RetryEventItemProps) {
  const [expanded, setExpanded] = useState(false);

  const getIcon = () => {
    switch (event.type) {
      case "initial_failure":
        return <AlertCircle className="w-4 h-4" />;
      case "retry_scheduled":
        return <Clock className="w-4 h-4" />;
      case "retry_started":
        return <RotateCcw className="w-4 h-4" />;
      case "retry_succeeded":
        return <CheckCircle className="w-4 h-4" />;
      case "retry_failed":
        return <XCircle className="w-4 h-4" />;
      case "retry_abandoned":
        return <Ban className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const eventTime = new Date(event.timestamp);
  const timeString = eventTime.toLocaleTimeString();
  const dateString = eventTime.toLocaleDateString();

  return (
    <div className="relative group">
      {/* Timeline dot */}
      <div
        className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 border-background ${getEventTypeDotColor(
          event.type
        )} transition-all group-hover:scale-125`}
      />

      {/* Event card */}
      <div
        className={`p-3 rounded-lg border transition-all cursor-pointer hover:border-accent/50 ${getEventTypeColor(
          event.type
        )}`}
        onClick={() => {
          setExpanded(!expanded);
          if (!expanded) {
            trackEventExpanded(event.type);
          } else {
            trackEventCollapsed(event.type);
          }
          trackEventClicked(event.type);
          onClick?.();
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {getIcon()}
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate">
                {getEventTypeDescription(event.type)}
              </p>
              <p className="text-xs text-current/70">
                {timeString} • {dateString}
              </p>
            </div>
          </div>

          {/* Expand button */}
          {(event.statusCode || event.errorMessage || event.responseTime) && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
                if (!expanded) {
                  trackEventExpanded(event.type);
                } else {
                  trackEventCollapsed(event.type);
                }
              }}
              variant="ghost"
              size="sm"
              className="flex-shrink-0 h-6 w-6 p-0"
            >
              {expanded ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </Button>
          )}
        </div>

        {/* Summary line */}
        {event.statusCode && (
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className={`font-mono font-semibold ${getStatusCodeColor(event.statusCode)}`}>
              {event.statusCode}
            </span>
            {event.responseTime && (
              <>
                <span className="text-current/50">•</span>
                <span className="text-current/70">{formatResponseTime(event.responseTime)}</span>
              </>
            )}
          </div>
        )}

        {/* Error message summary */}
        {event.errorMessage && !expanded && (
          <p className="mt-2 text-xs text-current/70 truncate">{event.errorMessage}</p>
        )}

        {/* Expanded details */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-current/20 space-y-2">
            {/* Error message */}
            {event.errorMessage && (
              <div>
                <p className="text-xs font-semibold text-current/80 mb-1">Error Message</p>
                <p className="text-xs text-current/70 break-words">{event.errorMessage}</p>
              </div>
            )}

            {/* Status code details */}
            {event.statusCode && (
              <div>
                <p className="text-xs font-semibold text-current/80 mb-1">HTTP Status</p>
                <p className={`text-xs font-mono ${getStatusCodeColor(event.statusCode)}`}>
                  {event.statusCode}
                </p>
              </div>
            )}

            {/* Response time */}
            {event.responseTime && (
              <div>
                <p className="text-xs font-semibold text-current/80 mb-1">Response Time</p>
                <p className="text-xs text-current/70">{formatResponseTime(event.responseTime)}</p>
              </div>
            )}

            {/* Retry attempt */}
            <div>
              <p className="text-xs font-semibold text-current/80 mb-1">Retry Attempt</p>
              <p className="text-xs text-current/70">#{event.retryAttempt}</p>
            </div>

            {/* Metadata */}
            {event.metadata && Object.keys(event.metadata).length > 0 && (
              <div>
                <p className="text-xs font-semibold text-current/80 mb-1">Details</p>
                <div className="space-y-1">
                  {Object.entries(event.metadata).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-xs text-current/70">
                      <span className="capitalize">{key}:</span>
                      <span className="font-mono">
                        {typeof value === "object" ? JSON.stringify(value) : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timestamp */}
            <div className="pt-2 border-t border-current/20">
              <p className="text-xs text-current/50">
                {eventTime.toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
