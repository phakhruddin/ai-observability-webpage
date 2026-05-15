import { trackEvent } from './analytics';

/**
 * Analytics for Resource Recommendation Engine
 * 
 * Tracks:
 * - Recommendation impressions (when recommendations are shown)
 * - Recommendation clicks (when users click recommended resources)
 * - Recommendation effectiveness (CTR, engagement metrics)
 */

export function trackRecommendationImpression(
  recommendationType: 'similar-resource' | 'user-behavior' | 'trending',
  resourceIds: string[],
  count: number
) {
  trackEvent({
    category: 'recommendations',
    action: 'recommendation_impression',
    label: recommendationType,
    value: count,
  });
}

export function trackRecommendationClick(
  recommendationType: 'similar-resource' | 'user-behavior' | 'trending',
  resourceId: string,
  resourceType: string
) {
  trackEvent({
    category: 'recommendations',
    action: 'recommendation_clicked',
    label: `${recommendationType}: ${resourceType}`,
    value: 1,
  });
}

export function trackRecommendationEngaged(
  recommendationType: 'similar-resource' | 'user-behavior' | 'trending',
  resourceId: string,
  engagementType: 'view' | 'read' | 'share'
) {
  trackEvent({
    category: 'recommendations',
    action: 'recommendation_engaged',
    label: `${recommendationType}: ${engagementType}`,
  });
}

export function trackRecommendationDismissed(
  recommendationType: 'similar-resource' | 'user-behavior' | 'trending',
  count: number
) {
  trackEvent({
    category: 'recommendations',
    action: 'recommendation_dismissed',
    label: recommendationType,
    value: count,
  });
}

export function trackRecommendationScroll(
  recommendationType: 'similar-resource' | 'user-behavior' | 'trending'
) {
  trackEvent({
    category: 'recommendations',
    action: 'recommendation_scrolled',
    label: recommendationType,
  });
}
