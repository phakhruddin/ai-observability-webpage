import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RetryEventItem } from "@/components/RetryEventItem";
import {
  type RetryTimeline,
  calculateTotalDuration,
  formatDuration,
} from "@/lib/retryTimelineTypes";

/**
 * RetryTimeline Component
 * 
 * Displays a visual timeline of retry events:
 * - Chronological event list
 * - Event details and status
 * - Total duration tracking
 * - Expandable/collapsible view
 * 
 * Design: Professional timeline with vertical line and event dots
 */

interface RetryTimelineProps {
  timeline: RetryTimeline;
  onEventClick?: (eventId: string) => void;
}

export function RetryTimeline({ timeline, onEventClick }: RetryTimelineProps) {
  const [expanded, setExpanded] = useState(false);
  const totalDuration = calculateTotalDuration(timeline.events);
  const displayEvents = expanded ? timeline.events : timeline.events.slice(0, 3);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-foreground">Retry Timeline</h4>
          <p className="text-xs text-muted-foreground">
            {timeline.events.length} events • Total duration: {formatDuration(totalDuration)}
          </p>
        </div>
        {timeline.events.length > 3 && (
          <Button
            onClick={() => setExpanded(!expanded)}
            variant="ghost"
            size="sm"
            className="flex items-center gap-1"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Collapse
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Expand
              </>
            )}
          </Button>
        )}
      </div>

      {/* Timeline */}
      <div className="relative pl-8">
        {/* Vertical line */}
        <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent/50 to-accent/10" />

        {/* Events */}
        <div className="space-y-6">
          {displayEvents.map((event, index) => (
            <RetryEventItem
              key={event.id}
              event={event}
              isFirst={index === 0}
              isLast={index === displayEvents.length - 1}
              onClick={() => onEventClick?.(event.id)}
            />
          ))}
        </div>

        {/* Collapsed indicator */}
        {!expanded && timeline.events.length > 3 && (
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              +{timeline.events.length - 3} more events
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
