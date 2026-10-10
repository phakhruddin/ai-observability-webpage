import {
  calculatePerformanceStats,
  PerformanceStats,
} from './recommendationPerformance';

export type RecommendationType = 'user-behavior' | 'trending' | 'similar';

export interface RecommendationAlertSettings {
  enabled: boolean;
  threshold: number;
  minimumImpressions: number;
  types: Record<RecommendationType, boolean>;
}

export interface RecommendationPerformanceAlert {
  id: string;
  type: RecommendationType;
  ctr: number;
  threshold: number;
  impressions: number;
  clicks: number;
  severity: 'warning' | 'critical';
  createdAt: number;
}

const SETTINGS_KEY = 'recommendation_alert_settings_v1';
const DISMISSED_KEY = 'recommendation_alert_dismissed_v1';
const DEFAULT_SETTINGS: RecommendationAlertSettings = {
  enabled: true,
  threshold: 2.5,
  minimumImpressions: 10,
  types: {
    'user-behavior': true,
    trending: true,
    similar: true,
  },
};

export const recommendationTypeLabels: Record<RecommendationType, string> = {
  'user-behavior': 'User Behavior',
  trending: 'Trending',
  similar: 'Similar Resources',
};

function isRecommendationType(value: string): value is RecommendationType {
  return value === 'user-behavior' || value === 'trending' || value === 'similar';
}

export function loadRecommendationAlertSettings(): RecommendationAlertSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (!stored) return { ...DEFAULT_SETTINGS, types: { ...DEFAULT_SETTINGS.types } };

    const parsed = JSON.parse(stored) as Partial<RecommendationAlertSettings>;
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      types: { ...DEFAULT_SETTINGS.types, ...(parsed.types ?? {}) },
    };
  } catch (error) {
    console.error('Failed to load recommendation alert settings:', error);
    return { ...DEFAULT_SETTINGS, types: { ...DEFAULT_SETTINGS.types } };
  }
}

export function saveRecommendationAlertSettings(
  settings: RecommendationAlertSettings
): RecommendationAlertSettings {
  const normalized = {
    ...settings,
    threshold: Math.max(0.1, Math.min(50, settings.threshold)),
    minimumImpressions: Math.max(1, Math.min(1000, Math.round(settings.minimumImpressions))),
  };

  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(normalized));
    window.dispatchEvent(new CustomEvent('recommendation-alert-settings-changed'));
  } catch (error) {
    console.error('Failed to save recommendation alert settings:', error);
  }
  return normalized;
}

function loadDismissedAlerts(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(DISMISSED_KEY) ?? '{}');
  } catch {
    return {};
  }
}

export function dismissRecommendationAlert(alertId: string): void {
  try {
    const dismissed = loadDismissedAlerts();
    dismissed[alertId] = Date.now();
    localStorage.setItem(DISMISSED_KEY, JSON.stringify(dismissed));
  } catch (error) {
    console.error('Failed to dismiss recommendation alert:', error);
  }
}

export function evaluateRecommendationAlerts(
  stats: PerformanceStats = calculatePerformanceStats(),
  settings: RecommendationAlertSettings = loadRecommendationAlertSettings()
): RecommendationPerformanceAlert[] {
  if (!settings.enabled) return [];

  const dismissed = loadDismissedAlerts();
  return (Object.entries(stats.byType) as Array<[RecommendationType, PerformanceStats['byType'][RecommendationType]]>)
    .filter(([type, metric]) => settings.types[type] && metric.impressions >= settings.minimumImpressions)
    .filter(([, metric]) => metric.ctr < settings.threshold)
    .map(([type, metric]) => {
      const severity: 'warning' | 'critical' = metric.ctr < settings.threshold / 2 ? 'critical' : 'warning';
      const id = `${type}-${settings.threshold}-${settings.minimumImpressions}-${metric.impressions}-${metric.clicks}`;
      return {
        id,
        type,
        ctr: metric.ctr,
        threshold: settings.threshold,
        impressions: metric.impressions,
        clicks: metric.clicks,
        severity,
        createdAt: dismissed[id] ?? Date.now(),
      };
    })
    .filter((alert) => !dismissed[alert.id]);
}

export function getRecommendationAlertSummary(
  stats: PerformanceStats = calculatePerformanceStats(),
  settings: RecommendationAlertSettings = loadRecommendationAlertSettings()
): { alerts: RecommendationPerformanceAlert[]; monitoredTypes: number } {
  return {
    alerts: evaluateRecommendationAlerts(stats, settings),
    monitoredTypes: Object.entries(settings.types).filter(([, enabled]) => enabled).length,
  };
}

export function resetDismissedRecommendationAlerts(): void {
  try {
    localStorage.removeItem(DISMISSED_KEY);
  } catch (error) {
    console.error('Failed to reset recommendation alerts:', error);
  }
}

export { isRecommendationType };
