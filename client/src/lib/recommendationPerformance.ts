/**
 * Recommendation Performance Analytics
 * 
 * Calculates and aggregates metrics for recommendation effectiveness:
 * - Click-through rates (CTR)
 * - Engagement metrics
 * - Performance trends over time
 * - Comparison between recommendation types
 */

export interface RecommendationMetric {
  type: 'user-behavior' | 'trending' | 'similar';
  impressions: number;
  clicks: number;
  ctr: number; // Click-through rate (clicks / impressions)
  engagements: number;
  dismissals: number;
  avgTimeOnResource: number; // in seconds
  topResources: Array<{
    resourceId: string;
    clicks: number;
    engagements: number;
  }>;
}

export interface PerformanceTrend {
  date: string;
  type: 'user-behavior' | 'trending' | 'similar';
  impressions: number;
  clicks: number;
  ctr: number;
}

export interface PerformanceStats {
  totalImpressions: number;
  totalClicks: number;
  overallCTR: number;
  byType: Record<'user-behavior' | 'trending' | 'similar', RecommendationMetric>;
  trends: PerformanceTrend[];
  topPerformingResources: Array<{
    resourceId: string;
    totalClicks: number;
    totalEngagements: number;
    avgCTR: number;
  }>;
}

// Storage key for performance data
const PERFORMANCE_STORAGE_KEY = 'recommendation_performance_v1';

interface StoredPerformanceEvent {
  timestamp: number;
  type: 'user-behavior' | 'trending' | 'similar';
  action: 'impression' | 'click' | 'engagement' | 'dismissal';
  resourceId?: string;
  duration?: number;
}

/**
 * Load performance events from localStorage
 */
export function loadPerformanceEvents(): StoredPerformanceEvent[] {
  try {
    const stored = localStorage.getItem(PERFORMANCE_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load performance events:', error);
  }
  return [];
}

/**
 * Save performance event
 */
export function recordPerformanceEvent(
  type: 'user-behavior' | 'trending' | 'similar',
  action: 'impression' | 'click' | 'engagement' | 'dismissal',
  resourceId?: string,
  duration?: number
): void {
  try {
    const events = loadPerformanceEvents();
    events.push({
      timestamp: Date.now(),
      type,
      action,
      resourceId,
      duration,
    });

    // Keep only last 1000 events to avoid localStorage bloat
    const recentEvents = events.slice(-1000);
    localStorage.setItem(PERFORMANCE_STORAGE_KEY, JSON.stringify(recentEvents));
  } catch (error) {
    console.error('Failed to record performance event:', error);
  }
}

/**
 * Calculate metrics for a specific recommendation type
 */
export function calculateMetricsForType(
  type: 'user-behavior' | 'trending' | 'similar',
  events: StoredPerformanceEvent[]
): RecommendationMetric {
  const typeEvents = events.filter((e) => e.type === type);

  const impressions = typeEvents.filter((e) => e.action === 'impression').length;
  const clicks = typeEvents.filter((e) => e.action === 'click').length;
  const engagements = typeEvents.filter((e) => e.action === 'engagement').length;
  const dismissals = typeEvents.filter((e) => e.action === 'dismissal').length;

  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;

  // Calculate average time on resource
  const engagementEvents = typeEvents.filter((e) => e.action === 'engagement' && e.duration);
  const avgTimeOnResource =
    engagementEvents.length > 0
      ? engagementEvents.reduce((sum, e) => sum + (e.duration || 0), 0) / engagementEvents.length
      : 0;

  // Get top resources
  const resourceMetrics: Record<string, { clicks: number; engagements: number }> = {};
  typeEvents.forEach((event) => {
    if (event.resourceId) {
      if (!resourceMetrics[event.resourceId]) {
        resourceMetrics[event.resourceId] = { clicks: 0, engagements: 0 };
      }
      if (event.action === 'click') {
        resourceMetrics[event.resourceId].clicks++;
      } else if (event.action === 'engagement') {
        resourceMetrics[event.resourceId].engagements++;
      }
    }
  });

  const topResources = Object.entries(resourceMetrics)
    .map(([resourceId, metrics]) => ({
      resourceId,
      clicks: metrics.clicks,
      engagements: metrics.engagements,
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5);

  return {
    type,
    impressions,
    clicks,
    ctr,
    engagements,
    dismissals,
    avgTimeOnResource,
    topResources,
  };
}

/**
 * Calculate overall performance statistics
 */
export function calculatePerformanceStats(
  dateRangeStart?: number,
  dateRangeEnd?: number
): PerformanceStats {
  const allEvents = loadPerformanceEvents();

  // Filter by date range if provided
  let events = allEvents;
  if (dateRangeStart || dateRangeEnd) {
    events = allEvents.filter((e) => {
      if (dateRangeStart && e.timestamp < dateRangeStart) return false;
      if (dateRangeEnd && e.timestamp > dateRangeEnd) return false;
      return true;
    });
  }

  // Calculate metrics for each type
  const byType = {
    'user-behavior': calculateMetricsForType('user-behavior', events),
    trending: calculateMetricsForType('trending', events),
    similar: calculateMetricsForType('similar', events),
  };

  // Calculate overall metrics
  const totalImpressions = Object.values(byType).reduce((sum, m) => sum + m.impressions, 0);
  const totalClicks = Object.values(byType).reduce((sum, m) => sum + m.clicks, 0);
  const overallCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

  // Calculate trends (daily)
  const trendMap: Record<string, Record<string, { impressions: number; clicks: number }>> = {};
  events.forEach((event) => {
    const date = new Date(event.timestamp).toISOString().split('T')[0];
    if (!trendMap[date]) {
      trendMap[date] = {
        'user-behavior': { impressions: 0, clicks: 0 },
        trending: { impressions: 0, clicks: 0 },
        similar: { impressions: 0, clicks: 0 },
      };
    }

    if (event.action === 'impression') {
      trendMap[date][event.type].impressions++;
    } else if (event.action === 'click') {
      trendMap[date][event.type].clicks++;
    }
  });

  const trends: PerformanceTrend[] = [];
  Object.entries(trendMap).forEach(([date, typeData]) => {
    Object.entries(typeData).forEach(([type, data]) => {
      trends.push({
        date,
        type: type as 'user-behavior' | 'trending' | 'similar',
        impressions: data.impressions,
        clicks: data.clicks,
        ctr: data.impressions > 0 ? (data.clicks / data.impressions) * 100 : 0,
      });
    });
  });

  // Calculate top performing resources across all types
  const resourceMetrics: Record<
    string,
    { totalClicks: number; totalEngagements: number; typeCount: number }
  > = {};
  events.forEach((event) => {
    if (event.resourceId) {
      if (!resourceMetrics[event.resourceId]) {
        resourceMetrics[event.resourceId] = { totalClicks: 0, totalEngagements: 0, typeCount: 0 };
      }
      if (event.action === 'click') {
        resourceMetrics[event.resourceId].totalClicks++;
      } else if (event.action === 'engagement') {
        resourceMetrics[event.resourceId].totalEngagements++;
      }
    }
  });

  const topPerformingResources = Object.entries(resourceMetrics)
    .map(([resourceId, metrics]) => ({
      resourceId,
      totalClicks: metrics.totalClicks,
      totalEngagements: metrics.totalEngagements,
      avgCTR: metrics.totalClicks > 0 ? (metrics.totalClicks / (metrics.totalClicks + 1)) * 100 : 0,
    }))
    .sort((a, b) => b.totalClicks - a.totalClicks)
    .slice(0, 10);

  return {
    totalImpressions,
    totalClicks,
    overallCTR,
    byType,
    trends,
    topPerformingResources,
  };
}

/**
 * Get performance stats for a specific date range
 */
export function getPerformanceStatsForDateRange(
  startDate: Date,
  endDate: Date
): PerformanceStats {
  return calculatePerformanceStats(startDate.getTime(), endDate.getTime());
}

/**
 * Clear all performance data
 */
export function clearPerformanceData(): void {
  try {
    localStorage.removeItem(PERFORMANCE_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear performance data:', error);
  }
}

/**
 * Export performance data as JSON
 */
export function exportPerformanceData(): string {
  const stats = calculatePerformanceStats();
  return JSON.stringify(stats, null, 2);
}
