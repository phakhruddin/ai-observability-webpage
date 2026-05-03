import { trackEvent } from "@/lib/analytics";

/**
 * Retry Timeline Analytics Module
 * 
 * Tracks retry timeline interactions and event viewing
 */

export function trackTimelineViewed(): void {
  trackEvent({
    category: "feature_interaction",
    action: "timeline_viewed",
    label: "retry_timeline",
  });
}

export function trackTimelineExpanded(): void {
  trackEvent({
    category: "feature_interaction",
    action: "timeline_expanded",
    label: "retry_timeline",
  });
}

export function trackTimelineCollapsed(): void {
  trackEvent({
    category: "feature_interaction",
    action: "timeline_collapsed",
    label: "retry_timeline",
  });
}

export function trackEventExpanded(eventType: string): void {
  trackEvent({
    category: "feature_interaction",
    action: "timeline_event_expanded",
    label: eventType,
  });
}

export function trackEventCollapsed(eventType: string): void {
  trackEvent({
    category: "feature_interaction",
    action: "timeline_event_collapsed",
    label: eventType,
  });
}

export function trackEventClicked(eventType: string): void {
  trackEvent({
    category: "feature_interaction",
    action: "timeline_event_clicked",
    label: eventType,
  });
}

export function trackTimelineScrolled(): void {
  trackEvent({
    category: "feature_interaction",
    action: "timeline_scrolled",
    label: "retry_timeline",
  });
}
