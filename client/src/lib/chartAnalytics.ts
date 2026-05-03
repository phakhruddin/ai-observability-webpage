/**
 * Chart Analytics Module
 * 
 * Tracks user interactions with metrics charts:
 * - Chart views
 * - Data point hovers
 * - Chart exports
 * - Time range changes
 */

import { trackEvent } from "./analytics";

export function trackMetricsChartView(chartName: string) {
  trackEvent({
    category: "feature_interaction",
    action: "metrics_chart_viewed",
    label: chartName,
  });
}

export function trackChartDataPointHover(chartName: string, dataPoint: string) {
  trackEvent({
    category: "feature_interaction",
    action: "chart_data_point_hovered",
    label: `${chartName} - ${dataPoint}`,
  });
}

export function trackChartExport(chartName: string, format: string) {
  trackEvent({
    category: "download",
    action: "chart_exported",
    label: `${chartName} - ${format}`,
  });
}

export function trackTimeRangeChange(chartName: string, range: string) {
  trackEvent({
    category: "feature_interaction",
    action: "chart_time_range_changed",
    label: `${chartName} - ${range}`,
  });
}

export function trackChartFullscreen(chartName: string) {
  trackEvent({
    category: "feature_interaction",
    action: "chart_fullscreen_opened",
    label: chartName,
  });
}

export function trackPerformanceMetricsView() {
  trackMetricsChartView("Performance Metrics - 7 Day");
}

export function trackSuccessRateHover(value: number) {
  trackChartDataPointHover("Performance Metrics", `Success Rate: ${value}%`);
}

export function trackLatencyHover(value: number) {
  trackChartDataPointHover("Performance Metrics", `Latency: ${value}ms`);
}
