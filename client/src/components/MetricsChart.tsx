import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  generateTimeSeriesData,
  formatLatency,
  formatSuccessRate,
  getSuccessRateColor,
  getLatencyColor,
  getTimeRangeLabel,
  type ChartData,
  type TimeRange,
} from "@/lib/chartData";
import { trackTimeRangeChange } from "@/lib/chartAnalytics";

/**
 * MetricsChart Component
 * 
 * Displays dual-axis time-series chart with:
 * - Left axis: Alert delivery success rate (%)
 * - Right axis: Alert latency (ms)
 * - 7-day historical data
 * - Interactive tooltips
 * - Trend indicators
 * 
 * Design: Professional monitoring chart with dark theme
 */

interface MetricsChartProps {
  title?: string;
  showLegend?: boolean;
  height?: number;
}

export function MetricsChart({
  title = "Performance Metrics",
  showLegend = true,
  height = 300,
}: MetricsChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");

  const chartData = useMemo(() => generateTimeSeriesData(timeRange), [timeRange]);

  // Calculate chart dimensions
  const padding = { top: 20, right: 60, bottom: 40, left: 60 };
  const width = 100; // percentage
  const chartHeight = height - padding.top - padding.bottom;

  // Find min/max values for scaling
  const successRates = chartData.points.map((p) => p.successRate);
  const latencies = chartData.points.map((p) => p.latency);

  const minSuccessRate = Math.min(...successRates);
  const maxSuccessRate = Math.max(...successRates);
  const minLatency = Math.min(...latencies);
  const maxLatency = Math.max(...latencies);

  // Add padding to ranges
  const successRateRange = maxSuccessRate - minSuccessRate || 1;
  const latencyRange = maxLatency - minLatency || 1;

  // Scale functions
  const scaleX = (index: number) =>
    padding.left + ((index / (chartData.points.length - 1)) * (100 - padding.left - padding.right));

  const scaleSuccessRateY = (value: number) =>
    padding.top +
    ((maxSuccessRate - value) / (successRateRange * 1.1)) * chartHeight;

  const scaleLatencyY = (value: number) =>
    padding.top +
    ((maxLatency - value) / (latencyRange * 1.1)) * chartHeight;

  // Generate SVG paths
  const successRatePath = chartData.points
    .map(
      (point, idx) =>
        `${idx === 0 ? "M" : "L"} ${scaleX(idx)} ${scaleSuccessRateY(point.successRate)}`
    )
    .join(" ");

  const latencyPath = chartData.points
    .map(
      (point, idx) =>
        `${idx === 0 ? "M" : "L"} ${scaleX(idx)} ${scaleLatencyY(point.latency)}`
    )
    .join(" ");

  // Create gradient definitions
  const successRateGradientId = "successRateGradient";
  const latencyGradientId = "latencyGradient";

  return (
    <Card className="bg-card border-border p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <div className="flex items-center gap-4">
            {/* Time Range Selector */}
            <div className="flex gap-2">
              {(["7d", "30d", "90d"] as TimeRange[]).map((range) => (
                <Button
                  key={range}
                  onClick={() => {
                    setTimeRange(range);
                    trackTimeRangeChange("Performance Metrics", getTimeRangeLabel(range));
                  }}
                  variant={timeRange === range ? "default" : "outline"}
                  size="sm"
                  className={timeRange === range ? "bg-accent text-accent-foreground" : ""}
                >
                  {range === "7d" ? "7D" : range === "30d" ? "30D" : "90D"}
                </Button>
              ))}
            </div>
            {/* Trend Indicator */}
            <div>
              {chartData.trend === "up" && (
                <div className="flex items-center gap-1 text-green-400 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  Improving
                </div>
              )}
              {chartData.trend === "down" && (
                <div className="flex items-center gap-1 text-red-400 text-sm">
                  <TrendingDown className="w-4 h-4" />
                  Declining
                </div>
              )}
              {chartData.trend === "stable" && (
                <div className="text-gray-400 text-sm">Stable</div>
              )}
            </div>
          </div>
        </div>

        {/* Legend */}
        {showLegend && (
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-muted-foreground">Success Rate (%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-muted-foreground">Latency (ms)</span>
            </div>
          </div>
        )}

        {/* Chart */}
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 100 ${height}`}
            className="w-full min-w-full"
            style={{ height: `${height}px` }}
            preserveAspectRatio="none"
          >
            <defs>
              {/* Gradients */}
              <linearGradient id={successRateGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
              <linearGradient id={latencyGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={`grid-${i}`}
                x1={padding.left}
                y1={padding.top + (i * chartHeight) / 4}
                x2={100 - padding.right}
                y2={padding.top + (i * chartHeight) / 4}
                stroke="#374151"
                strokeWidth="0.3"
                opacity="0.5"
              />
            ))}

            {/* Left axis (Success Rate) */}
            <line
              x1={padding.left}
              y1={padding.top}
              x2={padding.left}
              y2={padding.top + chartHeight}
              stroke="#6b7280"
              strokeWidth="0.5"
            />

            {/* Right axis (Latency) */}
            <line
              x1={100 - padding.right}
              y1={padding.top}
              x2={100 - padding.right}
              y2={padding.top + chartHeight}
              stroke="#6b7280"
              strokeWidth="0.5"
            />

            {/* Bottom axis */}
            <line
              x1={padding.left}
              y1={padding.top + chartHeight}
              x2={100 - padding.right}
              y2={padding.top + chartHeight}
              stroke="#6b7280"
              strokeWidth="0.5"
            />

            {/* Success Rate area chart */}
            <path
              d={`${successRatePath} L ${scaleX(chartData.points.length - 1)} ${
                padding.top + chartHeight
              } L ${scaleX(0)} ${padding.top + chartHeight} Z`}
              fill={`url(#${successRateGradientId})`}
            />

            {/* Success Rate line */}
            <path
              d={successRatePath}
              fill="none"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Latency area chart */}
            <path
              d={`${latencyPath} L ${scaleX(chartData.points.length - 1)} ${
                padding.top + chartHeight
              } L ${scaleX(0)} ${padding.top + chartHeight} Z`}
              fill={`url(#${latencyGradientId})`}
            />

            {/* Latency line */}
            <path
              d={latencyPath}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points */}
            {chartData.points.map((point: any, idx: number) => (
              <g key={`point-${idx}`}>
                {/* Success rate point */}
                <circle
                  cx={scaleX(idx)}
                  cy={scaleSuccessRateY(point.successRate)}
                  r="1.2"
                  fill="#10b981"
                  opacity="0.8"
                />
                {/* Latency point */}
                <circle
                  cx={scaleX(idx)}
                  cy={scaleLatencyY(point.latency)}
                  r="1.2"
                  fill="#3b82f6"
                  opacity="0.8"
                />
              </g>
            ))}

            {/* X-axis labels */}
            {chartData.points.map((point: any, idx: number) => (
              <text
                key={`label-${idx}`}
                x={scaleX(idx)}
                y={padding.top + chartHeight + 15}
                textAnchor="middle"
                fontSize="10"
                fill="#9ca3af"
              >
                {point.date}
              </text>
            ))}

            {/* Left axis label (Success Rate) */}
            <text
              x={5}
              y={padding.top + chartHeight / 2}
              textAnchor="middle"
              fontSize="10"
              fill="#9ca3af"
              transform={`rotate(-90 5 ${padding.top + chartHeight / 2})`}
            >
              Success Rate (%)
            </text>

            {/* Right axis label (Latency) */}
            <text
              x={95}
              y={padding.top + chartHeight / 2}
              textAnchor="middle"
              fontSize="10"
              fill="#9ca3af"
              transform={`rotate(90 95 ${padding.top + chartHeight / 2})`}
            >
              Latency (ms)
            </text>
          </svg>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Avg Success Rate</p>
            <p className="text-lg font-semibold text-green-400">
              {formatSuccessRate(chartData.avgSuccessRate)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Avg Latency</p>
            <p className="text-lg font-semibold text-blue-400">
              {formatLatency(chartData.avgLatency)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Min Latency</p>
            <p className="text-lg font-semibold text-green-400">
              {formatLatency(chartData.minLatency)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Max Latency</p>
            <p className="text-lg font-semibold text-red-400">
              {formatLatency(chartData.maxLatency)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
