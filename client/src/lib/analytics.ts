/**
 * Analytics Tracking Module
 * 
 * Tracks user interactions and conversion funnel events:
 * - Page views
 * - CTA button clicks
 * - Form submissions
 * - Demo bookings
 * - Feature interactions
 * 
 * Uses Umami Analytics (already configured in HTML)
 */

export type EventCategory = 
  | 'page_view'
  | 'cta_click'
  | 'form_submission'
  | 'demo_booking'
  | 'feature_interaction'
  | 'modal_open'
  | 'download'
  | 'navigation';

export interface AnalyticsEvent {
  category: EventCategory;
  action: string;
  label?: string;
  value?: number | string;
}

/**
 * Track a custom event
 */
export function trackEvent(event: AnalyticsEvent) {
  try {
    // Use Umami Analytics API if available
    if (window.umami) {
      window.umami.track(event.action, {
        category: event.category,
        label: event.label,
        value: event.value,
      });
    }

    // Fallback: Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', event);
    }
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
}

/**
 * Track page view
 */
export function trackPageView(pageName: string, pageUrl?: string) {
  trackEvent({
    category: 'page_view',
    action: 'page_viewed',
    label: pageName,
    value: pageUrl,
  });
}

/**
 * Track CTA button clicks
 */
export function trackCTAClick(buttonName: string, destination?: string) {
  trackEvent({
    category: 'cta_click',
    action: 'cta_clicked',
    label: buttonName,
    value: destination,
  });
}

/**
 * Track form submissions
 */
export function trackFormSubmission(formName: string, success: boolean = true) {
  trackEvent({
    category: 'form_submission',
    action: 'form_submitted',
    label: formName,
    value: success ? 'success' : 'error',
  });
}

/**
 * Track demo booking
 */
export function trackDemoBooking(source: string) {
  trackEvent({
    category: 'demo_booking',
    action: 'demo_booked',
    label: source,
  });
}

/**
 * Track feature interactions
 */
export function trackFeatureInteraction(featureName: string, action: string) {
  trackEvent({
    category: 'feature_interaction',
    action: `${featureName}_${action}`,
    label: featureName,
  });
}

/**
 * Track modal opens
 */
export function trackModalOpen(modalName: string) {
  trackEvent({
    category: 'modal_open',
    action: 'modal_opened',
    label: modalName,
  });
}

/**
 * Track downloads
 */
export function trackDownload(fileName: string, fileType: string) {
  trackEvent({
    category: 'download',
    action: 'file_downloaded',
    label: fileName,
    value: fileType,
  });
}

/**
 * Track navigation
 */
export function trackNavigation(fromPage: string, toPage: string) {
  trackEvent({
    category: 'navigation',
    action: 'page_navigation',
    label: `${fromPage} -> ${toPage}`,
  });
}

/**
 * Track conversion funnel step
 */
export function trackConversionStep(step: string, stepNumber: number) {
  trackEvent({
    category: 'cta_click',
    action: 'conversion_funnel_step',
    label: step,
    value: stepNumber,
  });
}

// Extend window interface for Umami
declare global {
  interface Window {
    umami?: {
      track: (name: string, data?: Record<string, any>) => void;
    };
  }
}
