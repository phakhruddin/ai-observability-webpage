import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, BarChart3, Eye, MousePointer, Zap, Download } from 'lucide-react';
import {
  calculatePerformanceStats,
  getPerformanceStatsForDateRange,
  exportPerformanceData,
  PerformanceStats,
} from '@/lib/recommendationPerformance';

/**
 * Performance Dashboard Component
 * 
 * Displays recommendation effectiveness metrics:
 * - Overall CTR and engagement statistics
 * - Performance breakdown by recommendation type
 * - Trends over time
 * - Top performing resources
 */

interface PerformanceDashboardProps {
  dateRangeStart?: Date;
  dateRangeEnd?: Date;
}

export function PerformanceDashboard({ dateRangeStart, dateRangeEnd }: PerformanceDashboardProps) {
  const [stats, setStats] = useState<PerformanceStats | null>(null);

  React.useEffect(() => {
    let performanceStats: PerformanceStats;
    if (dateRangeStart && dateRangeEnd) {
      performanceStats = getPerformanceStatsForDateRange(dateRangeStart, dateRangeEnd);
    } else {
      performanceStats = calculatePerformanceStats();
    }
    setStats(performanceStats);
  }, [dateRangeStart, dateRangeEnd]);

  if (!stats) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading performance data...</p>
      </div>
    );
  }

  const handleExport = () => {
    const data = exportPerformanceData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recommendation-performance-${new Date().toISOString()}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-bold">Performance Analytics</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          Export Data
        </Button>
      </div>

      {/* Overall Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Impressions</p>
              <p className="text-3xl font-bold">{stats.totalImpressions.toLocaleString()}</p>
            </div>
            <Eye className="w-8 h-8 text-accent/50" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Clicks</p>
              <p className="text-3xl font-bold">{stats.totalClicks.toLocaleString()}</p>
            </div>
            <MousePointer className="w-8 h-8 text-accent/50" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Overall CTR</p>
              <p className="text-3xl font-bold">{stats.overallCTR.toFixed(2)}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-accent/50" />
          </div>
        </Card>
      </div>

      {/* Performance by Type */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(stats.byType).map(([typeKey, metric]) => (
          <Card key={typeKey} className="p-6">
            <div className="mb-4">
              <p className="font-bold text-lg capitalize mb-1">
                {typeKey === 'user-behavior' ? 'User Behavior' : typeKey === 'trending' ? 'Trending' : 'Similar Resources'}
              </p>
              <p className="text-2xl font-bold text-accent">{metric.ctr.toFixed(2)}%</p>
              <p className="text-xs text-muted-foreground">Click-through rate</p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Impressions</span>
                <span className="font-medium">{metric.impressions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Clicks</span>
                <span className="font-medium">{metric.clicks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Engagements</span>
                <span className="font-medium">{metric.engagements}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Time (s)</span>
                <span className="font-medium">{metric.avgTimeOnResource.toFixed(1)}</span>
              </div>
            </div>

            {/* Progress bar for CTR */}
            <div className="mt-4">
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all"
                  style={{ width: `${Math.min(metric.ctr, 100)}%` }}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Top Performing Resources */}
      {stats.topPerformingResources.length > 0 && (
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" />
            Top Performing Resources
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-accent/10">
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Resource</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-medium">Clicks</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-medium">Engagements</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-medium">Avg CTR</th>
                </tr>
              </thead>
              <tbody>
                {stats.topPerformingResources.map((resource, idx) => (
                  <tr key={idx} className="border-b border-accent/5 hover:bg-accent/5 transition-colors">
                    <td className="py-3 px-3 font-medium truncate">{resource.resourceId}</td>
                    <td className="text-right py-3 px-3">{resource.totalClicks}</td>
                    <td className="text-right py-3 px-3">{resource.totalEngagements}</td>
                    <td className="text-right py-3 px-3 text-accent font-medium">
                      {resource.avgCTR.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {stats.totalImpressions === 0 && (
        <Card className="p-8 text-center">
          <BarChart3 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No recommendation data yet.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Performance metrics will appear as users interact with recommendations.
          </p>
        </Card>
      )}
    </div>
  );
}
