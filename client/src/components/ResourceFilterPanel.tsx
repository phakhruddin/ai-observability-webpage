import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { filterOptions, ResourceType, Industry, UseCaseCategory, Topic } from '@/lib/resourceMetadata';
import { trackFilterApplied, trackFilterRemoved, trackClearAllFilters } from '@/lib/searchAnalytics';

interface ResourceFilterPanelProps {
  onFilterChange: (filters: {
    types?: ResourceType[];
    industries?: Industry[];
    useCases?: UseCaseCategory[];
    topics?: Topic[];
  }) => void;
}

export function ResourceFilterPanel({ onFilterChange }: ResourceFilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    type: true,
    industry: true,
    useCase: true,
    topic: false,
  });

  const [selectedFilters, setSelectedFilters] = useState<{
    types: ResourceType[];
    industries: Industry[];
    useCases: UseCaseCategory[];
    topics: Topic[];
  }>({
    types: [],
    industries: [],
    useCases: [],
    topics: [],
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleFilterChange = (category: string, value: string, checked: boolean) => {
    const newFilters = { ...selectedFilters };

    if (category === 'type') {
      if (checked) {
        newFilters.types.push(value as ResourceType);
        trackFilterApplied('Content Type', value);
      } else {
        newFilters.types = newFilters.types.filter((t) => t !== value);
        trackFilterRemoved('Content Type', value);
      }
    } else if (category === 'industry') {
      if (checked) {
        newFilters.industries.push(value as Industry);
        trackFilterApplied('Industry', value);
      } else {
        newFilters.industries = newFilters.industries.filter((i) => i !== value);
        trackFilterRemoved('Industry', value);
      }
    } else if (category === 'useCase') {
      if (checked) {
        newFilters.useCases.push(value as UseCaseCategory);
        trackFilterApplied('Use Case', value);
      } else {
        newFilters.useCases = newFilters.useCases.filter((u) => u !== value);
        trackFilterRemoved('Use Case', value);
      }
    } else if (category === 'topic') {
      if (checked) {
        newFilters.topics.push(value as Topic);
        trackFilterApplied('Topic', value);
      } else {
        newFilters.topics = newFilters.topics.filter((t) => t !== value);
        trackFilterRemoved('Topic', value);
      }
    }

    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    trackClearAllFilters(activeFilterCount);
    setSelectedFilters({
      types: [],
      industries: [],
      useCases: [],
      topics: [],
    });
    onFilterChange({
      types: [],
      industries: [],
      useCases: [],
      topics: [],
    });
  };

  const activeFilterCount =
    selectedFilters.types.length +
    selectedFilters.industries.length +
    selectedFilters.useCases.length +
    selectedFilters.topics.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Filters</h3>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-xs text-accent hover:text-accent/80"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Resource Type Filter */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('type')}
          className="flex items-center justify-between w-full text-sm font-medium text-foreground hover:text-accent transition-colors"
        >
          Content Type
          <ChevronDown
            className={`w-4 h-4 transition-transform ${expandedSections.type ? 'rotate-180' : ''}`}
          />
        </button>
        {expandedSections.type && (
          <div className="space-y-2 pl-2">
            {filterOptions.types.map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={selectedFilters.types.includes(type)}
                  onCheckedChange={(checked) =>
                    handleFilterChange('type', type, checked as boolean)
                  }
                />
                <span className="text-sm text-muted-foreground capitalize">
                  {type.replace('-', ' ')}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Industry Filter */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('industry')}
          className="flex items-center justify-between w-full text-sm font-medium text-foreground hover:text-accent transition-colors"
        >
          Industry
          <ChevronDown
            className={`w-4 h-4 transition-transform ${expandedSections.industry ? 'rotate-180' : ''}`}
          />
        </button>
        {expandedSections.industry && (
          <div className="space-y-2 pl-2">
            {filterOptions.industries.map((industry) => (
              <label key={industry} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={selectedFilters.industries.includes(industry)}
                  onCheckedChange={(checked) =>
                    handleFilterChange('industry', industry, checked as boolean)
                  }
                />
                <span className="text-sm text-muted-foreground">{industry}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Use Case Filter */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('useCase')}
          className="flex items-center justify-between w-full text-sm font-medium text-foreground hover:text-accent transition-colors"
        >
          Use Case
          <ChevronDown
            className={`w-4 h-4 transition-transform ${expandedSections.useCase ? 'rotate-180' : ''}`}
          />
        </button>
        {expandedSections.useCase && (
          <div className="space-y-2 pl-2">
            {filterOptions.useCases.map((useCase) => (
              <label key={useCase} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={selectedFilters.useCases.includes(useCase)}
                  onCheckedChange={(checked) =>
                    handleFilterChange('useCase', useCase, checked as boolean)
                  }
                />
                <span className="text-sm text-muted-foreground capitalize">
                  {useCase.replace('-', ' ')}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Topic Filter */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('topic')}
          className="flex items-center justify-between w-full text-sm font-medium text-foreground hover:text-accent transition-colors"
        >
          Topic
          <ChevronDown
            className={`w-4 h-4 transition-transform ${expandedSections.topic ? 'rotate-180' : ''}`}
          />
        </button>
        {expandedSections.topic && (
          <div className="space-y-2 pl-2">
            {filterOptions.topics.map((topic) => (
              <label key={topic} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={selectedFilters.topics.includes(topic)}
                  onCheckedChange={(checked) =>
                    handleFilterChange('topic', topic, checked as boolean)
                  }
                />
                <span className="text-sm text-muted-foreground">{topic}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="pt-4 border-t border-accent/10 space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Active Filters:</p>
          <div className="flex flex-wrap gap-2">
            {selectedFilters.types.map((type) => (
              <span
                key={`type-${type}`}
                className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent text-xs rounded"
              >
                {type.replace('-', ' ')}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => handleFilterChange('type', type, false)}
                />
              </span>
            ))}
            {selectedFilters.industries.map((industry) => (
              <span
                key={`industry-${industry}`}
                className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent text-xs rounded"
              >
                {industry}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => handleFilterChange('industry', industry, false)}
                />
              </span>
            ))}
            {selectedFilters.useCases.map((useCase) => (
              <span
                key={`useCase-${useCase}`}
                className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent text-xs rounded"
              >
                {useCase.replace('-', ' ')}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => handleFilterChange('useCase', useCase, false)}
                />
              </span>
            ))}
            {selectedFilters.topics.map((topic) => (
              <span
                key={`topic-${topic}`}
                className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent text-xs rounded"
              >
                {topic}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => handleFilterChange('topic', topic, false)}
                />
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
