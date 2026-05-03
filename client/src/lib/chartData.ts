/**
 * Chart Data Utilities
 * 
 * Generates mock time-series data for:
 * - Alert delivery success rate (%)
 * - Alert latency (ms)
 * - 7-day historical trends
 */

export interface TimeSeriesPoint {
  date: string;
  timestamp: number;
  successRate: number;
  latency: number;
  alertsCount: number;
}

export interface ChartData {
  points: TimeSeriesPoint[];
  avgSuccessRate: number;
  avgLatency: number;
  minLatency: number;
  maxLatency: number;
  trend: "up" | "down" | "stable";
}

/**
 * Generate mock 7-day time-series data
 * Simulates realistic alert delivery metrics with natural variation
 */
export function generateSevenDayData(): ChartData {
  const points: TimeSeriesPoint[] = [];
  const now = new Date();
  
  // Generate data for last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Format date as "Mon", "Tue", etc.
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    const dayNum = date.getDate();
    const dateStr = `${dayName} ${dayNum}`;
    
    // Generate realistic metrics with slight variation
    // Success rate: 98-99.5% (high reliability)
    const baseSuccessRate = 98.5 + Math.random() * 1.0;
    const successRate = Math.min(99.9, Math.max(97.5, baseSuccessRate));
    
    // Latency: 0.8-2.5ms (realistic for API calls)
    const baseLatency = 1.2 + (Math.random() - 0.5) * 0.8;
    const latency = Math.max(0.5, Math.min(3.0, baseLatency));
    
    // Alert count: 150-300 per day
    const alertsCount = Math.floor(150 + Math.random() * 150);
    
    points.push({
      date: dateStr,
      timestamp: date.getTime(),
      successRate: parseFloat(successRate.toFixed(2)),
      latency: parseFloat(latency.toFixed(2)),
      alertsCount,
    });
  }
  
  // Calculate aggregate metrics
  const successRates = points.map((p) => p.successRate);
  const latencies = points.map((p) => p.latency);
  
  const avgSuccessRate = parseFloat(
    (successRates.reduce((a, b) => a + b, 0) / successRates.length).toFixed(2)
  );
  const avgLatency = parseFloat(
    (latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(2)
  );
  const minLatency = parseFloat(Math.min(...latencies).toFixed(2));
  const maxLatency = parseFloat(Math.max(...latencies).toFixed(2));
  
  // Determine trend
  const firstHalf = successRates.slice(0, Math.floor(successRates.length / 2));
  const secondHalf = successRates.slice(Math.floor(successRates.length / 2));
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  
  let trend: "up" | "down" | "stable" = "stable";
  if (secondAvg > firstAvg + 0.1) trend = "up";
  else if (secondAvg < firstAvg - 0.1) trend = "down";
  
  return {
    points,
    avgSuccessRate,
    avgLatency,
    minLatency,
    maxLatency,
    trend,
  };
}

/**
 * Format latency value for display
 */
export function formatLatency(ms: number): string {
  if (ms < 1) return `${(ms * 1000).toFixed(0)}µs`;
  return `${ms.toFixed(2)}ms`;
}

/**
 * Format success rate for display
 */
export function formatSuccessRate(rate: number): string {
  return `${rate.toFixed(2)}%`;
}

/**
 * Get color for success rate (green for high, yellow for medium, red for low)
 */
export function getSuccessRateColor(rate: number): string {
  if (rate >= 99) return "#10b981"; // green-500
  if (rate >= 98) return "#f59e0b"; // amber-500
  return "#ef4444"; // red-500
}

/**
 * Get color for latency (green for low, yellow for medium, red for high)
 */
export function getLatencyColor(ms: number): string {
  if (ms <= 1) return "#10b981"; // green-500
  if (ms <= 2) return "#f59e0b"; // amber-500
  return "#ef4444"; // red-500
}
