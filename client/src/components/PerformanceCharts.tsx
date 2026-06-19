import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { calculatePerformanceStats } from '@/lib/recommendationPerformance';

/**
 * Performance Charts Component
 * 
 * Visualizes recommendation performance data:
 * - CTR trends over time
 * - Impressions vs Clicks comparison
 * - Performance by recommendation type
 * - Engagement distribution
 */

export function PerformanceCharts() {
  const stats = useMemo(() => calculatePerformanceStats(), []);

  // Prepare trend data for line chart
  const trendData = useMemo(() => {
    const groupedByDate: Record<string, Record<string, { impressions: number; clicks: number }>> = {};

    stats.trends.forEach((trend) => {
      if (!groupedByDate[trend.date]) {
        groupedByDate[trend.date] = {
          'user-behavior': { impressions: 0, clicks: 0 },
          trending: { impressions: 0, clicks: 0 },
          similar: { impressions: 0, clicks: 0 },
        };
      }
      groupedByDate[trend.date][trend.type] = {
        impressions: trend.impressions,
        clicks: trend.clicks,
      };
    });

    return Object.entries(groupedByDate)
      .map(([date, data]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        'User Behavior CTR': data['user-behavior'].impressions > 0
          ? ((data['user-behavior'].clicks / data['user-behavior'].impressions) * 100).toFixed(1)
          : 0,
        'Trending CTR': data.trending.impressions > 0
          ? ((data.trending.clicks / data.trending.impressions) * 100).toFixed(1)
          : 0,
        'Similar CTR': data.similar.impressions > 0
          ? ((data.similar.clicks / data.similar.impressions) * 100).toFixed(1)
          : 0,
      }))
      .slice(-30); // Last 30 days
  }, [stats.trends]);

  // Prepare comparison data
  const comparisonData = useMemo(() => {
    return [
      {
        name: 'User Behavior',
        impressions: stats.byType['user-behavior'].impressions,
        clicks: stats.byType['user-behavior'].clicks,
      },
      {
        name: 'Trending',
        impressions: stats.byType.trending.impressions,
        clicks: stats.byType.trending.clicks,
      },
      {
        name: 'Similar',
        impressions: stats.byType.similar.impressions,
        clicks: stats.byType.similar.clicks,
      },
    ];
  }, [stats.byType]);

  // Prepare pie chart data
  const pieData = useMemo(() => {
    return [
      { name: 'User Behavior', value: stats.byType['user-behavior'].clicks },
      { name: 'Trending', value: stats.byType.trending.clicks },
      { name: 'Similar', value: stats.byType.similar.clicks },
    ].filter((item) => item.value > 0);
  }, [stats.byType]);

  const COLORS = ['#14b8a6', '#06b6d4', '#0ea5e9'];

  return (
    <div className="space-y-6">
      {/* CTR Trends */}
      {trendData.length > 0 && (
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">CTR Trends (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" label={{ value: 'CTR (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="User Behavior CTR"
                stroke="#14b8a6"
                dot={false}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="Trending CTR"
                stroke="#06b6d4"
                dot={false}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="Similar CTR"
                stroke="#0ea5e9"
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Impressions vs Clicks Comparison */}
      {comparisonData.some((d) => d.impressions > 0) && (
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">Impressions vs Clicks by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="impressions" fill="#14b8a6" />
              <Bar dataKey="clicks" fill="#06b6d4" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Click Distribution Pie Chart */}
      {pieData.length > 0 && (
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">Click Distribution by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Empty State */}
      {stats.totalImpressions === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No chart data available yet.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Charts will appear as users interact with recommendations.
          </p>
        </Card>
      )}
    </div>
  );
}
