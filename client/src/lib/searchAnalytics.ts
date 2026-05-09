import { trackEvent } from './analytics';

export function trackSearchQuery(query: string, resultsCount: number) {
  trackEvent({
    category: 'feature_interaction',
    action: 'search_performed',
    label: 'Resources Search',
    value: resultsCount,
  });
}

export function trackFilterApplied(filterType: string, filterValue: string) {
  trackEvent({
    category: 'feature_interaction',
    action: 'filter_applied',
    label: `${filterType}: ${filterValue}`,
  });
}

export function trackFilterRemoved(filterType: string, filterValue: string) {
  trackEvent({
    category: 'feature_interaction',
    action: 'filter_removed',
    label: `${filterType}: ${filterValue}`,
  });
}

export function trackResourceClicked(resourceId: string, resourceType: string) {
  trackEvent({
    category: 'feature_interaction',
    action: 'resource_clicked',
    label: `${resourceType}: ${resourceId}`,
  });
}

export function trackClearAllFilters(activeFilterCount: number) {
  trackEvent({
    category: 'feature_interaction',
    action: 'clear_all_filters',
    label: 'Resources Filters',
    value: activeFilterCount,
  });
}
