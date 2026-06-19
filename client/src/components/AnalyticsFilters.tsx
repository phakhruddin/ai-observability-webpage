import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Filter, X } from 'lucide-react';

/**
 * Analytics Filters Component
 * 
 * Provides interactive filters for:
 * - Date range selection (Last 7 days, 30 days, 90 days, custom)
 * - Recommendation type filtering
 */

interface AnalyticsFiltersProps {
  onDateRangeChange?: (startDate: Date | null, endDate: Date | null) => void;
  onTypeFilterChange?: (types: Array<'user-behavior' | 'trending' | 'similar'>) => void;
}

export function AnalyticsFilters({
  onDateRangeChange,
  onTypeFilterChange,
}: AnalyticsFiltersProps) {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'custom'>('30d');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [selectedTypes, setSelectedTypes] = useState<Array<'user-behavior' | 'trending' | 'similar'>>([
    'user-behavior',
    'trending',
    'similar',
  ]);

  const getDateRange = (range: string): { start: Date; end: Date } | null => {
    const end = new Date();
    const start = new Date();

    switch (range) {
      case '7d':
        start.setDate(end.getDate() - 7);
        return { start, end };
      case '30d':
        start.setDate(end.getDate() - 30);
        return { start, end };
      case '90d':
        start.setDate(end.getDate() - 90);
        return { start, end };
      case 'custom':
        if (customStartDate && customEndDate) {
          return {
            start: new Date(customStartDate),
            end: new Date(customEndDate),
          };
        }
        return null;
      default:
        return null;
    }
  };

  const handleDateRangeChange = (range: '7d' | '30d' | '90d' | 'custom') => {
    setDateRange(range);
    const dateRangeData = getDateRange(range);
    if (dateRangeData && onDateRangeChange) {
      onDateRangeChange(dateRangeData.start, dateRangeData.end);
    }
  };

  const handleCustomDateChange = () => {
    if (customStartDate && customEndDate) {
      const start = new Date(customStartDate);
      const end = new Date(customEndDate);
      if (onDateRangeChange) {
        onDateRangeChange(start, end);
      }
    }
  };

  const handleTypeToggle = (type: 'user-behavior' | 'trending' | 'similar') => {
    let newTypes: Array<'user-behavior' | 'trending' | 'similar'>;
    if (selectedTypes.includes(type)) {
      newTypes = selectedTypes.filter((t) => t !== type);
    } else {
      newTypes = [...selectedTypes, type];
    }
    setSelectedTypes(newTypes);
    if (onTypeFilterChange) {
      onTypeFilterChange(newTypes);
    }
  };

  const handleClearFilters = () => {
    setDateRange('30d');
    setCustomStartDate('');
    setCustomEndDate('');
    setSelectedTypes(['user-behavior', 'trending', 'similar']);
    const dateRangeData = getDateRange('30d');
    if (dateRangeData && onDateRangeChange) {
      onDateRangeChange(dateRangeData.start, dateRangeData.end);
    }
    if (onTypeFilterChange) {
      onTypeFilterChange(['user-behavior', 'trending', 'similar']);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-accent" />
          <h3 className="font-bold text-lg">Filters</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearFilters}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4 mr-1" />
          Clear
        </Button>
      </div>

      <div className="space-y-6">
        {/* Date Range Selection */}
        <div>
          <p className="font-medium mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Date Range
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {['7d', '30d', '90d'].map((range) => (
              <Button
                key={range}
                variant={dateRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleDateRangeChange(range as '7d' | '30d' | '90d')}
                className="w-full"
              >
                {range === '7d' ? 'Last 7 days' : range === '30d' ? 'Last 30 days' : 'Last 90 days'}
              </Button>
            ))}
          </div>

          {/* Custom Date Range */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Custom Range</p>
            <div className="flex gap-2">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="flex-1 px-3 py-2 bg-background border border-accent/20 rounded-lg text-foreground text-sm"
              />
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="flex-1 px-3 py-2 bg-background border border-accent/20 rounded-lg text-foreground text-sm"
              />
              <Button
                size="sm"
                onClick={handleCustomDateChange}
                disabled={!customStartDate || !customEndDate}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>

        {/* Recommendation Type Filter */}
        <div>
          <p className="font-medium mb-3">Recommendation Types</p>
          <div className="space-y-2">
            {[
              { id: 'user-behavior', label: 'User Behavior' },
              { id: 'trending', label: 'Trending' },
              { id: 'similar', label: 'Similar Resources' },
            ].map((type) => (
              <label key={type.id} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-accent/5 transition-colors">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type.id as any)}
                  onChange={() => handleTypeToggle(type.id as any)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm">{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Active Filters Summary */}
        {(dateRange !== '30d' || selectedTypes.length !== 3) && (
          <div className="p-3 bg-accent/5 border border-accent/20 rounded-lg">
            <p className="text-xs text-muted-foreground mb-2">Active Filters:</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded">
                {dateRange === '7d' ? 'Last 7 days' : dateRange === '30d' ? 'Last 30 days' : dateRange === '90d' ? 'Last 90 days' : 'Custom range'}
              </span>
              {selectedTypes.map((type) => (
                <span key={type} className="px-2 py-1 bg-accent/10 text-accent text-xs rounded">
                  {type === 'user-behavior' ? 'User Behavior' : type === 'trending' ? 'Trending' : 'Similar'}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
