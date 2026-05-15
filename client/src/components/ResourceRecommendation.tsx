import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Recommendation } from "@/lib/recommendationEngine";
import { ArrowRight, Lightbulb, TrendingUp, Zap } from "lucide-react";
import { trackRecommendationClick, trackRecommendationImpression } from "@/lib/recommendationAnalytics";

/**
 * ResourceRecommendation Component
 * 
 * Displays recommended resources based on:
 * - Similar resources (when viewing a specific resource)
 * - User behavior (search history, filters)
 * - Trending/popular content
 * 
 * Design: Dark theme with teal accents, card-based layout
 */

interface ResourceRecommendationProps {
  recommendations: Recommendation[];
  type: 'similar-resource' | 'user-behavior' | 'trending';
  title?: string;
  description?: string;
  onResourceClick?: (resourceId: string) => void;
  maxDisplay?: number;
}

function getRecommendationIcon(type: 'similar-resource' | 'user-behavior' | 'trending') {
  switch (type) {
    case 'similar-resource':
      return <Lightbulb className="w-5 h-5 text-accent" />;
    case 'user-behavior':
      return <TrendingUp className="w-5 h-5 text-accent" />;
    case 'trending':
      return <Zap className="w-5 h-5 text-accent" />;
  }
}

function getRecommendationTitle(type: 'similar-resource' | 'user-behavior' | 'trending') {
  switch (type) {
    case 'similar-resource':
      return 'You Might Also Like';
    case 'user-behavior':
      return 'Recommended for You';
    case 'trending':
      return 'Trending Now';
  }
}

function getRecommendationDescription(type: 'similar-resource' | 'user-behavior' | 'trending') {
  switch (type) {
    case 'similar-resource':
      return 'Resources related to what you\'re reading';
    case 'user-behavior':
      return 'Based on your interests and search history';
    case 'trending':
      return 'Popular resources from our community';
  }
}

export function ResourceRecommendation({
  recommendations,
  type,
  title,
  description,
  onResourceClick,
  maxDisplay = 3,
}: ResourceRecommendationProps) {
  if (recommendations.length === 0) {
    return null;
  }

  const displayedRecommendations = recommendations.slice(0, maxDisplay);

  // Track impression
  React.useEffect(() => {
    trackRecommendationImpression(
      type,
      displayedRecommendations.map((r) => r.resource.id),
      displayedRecommendations.length
    );
  }, [type, displayedRecommendations]);

  const handleResourceClick = (resourceId: string, resourceType: string) => {
    trackRecommendationClick(type, resourceId, resourceType);
    if (onResourceClick) {
      onResourceClick(resourceId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          {getRecommendationIcon(type)}
          <h3 className="text-2xl font-bold">
            {title || getRecommendationTitle(type)}
          </h3>
        </div>
        <p className="text-muted-foreground">
          {description || getRecommendationDescription(type)}
        </p>
      </div>

      {/* Recommendation Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {displayedRecommendations.map((recommendation) => (
          <Card
            key={recommendation.resource.id}
            className="group p-6 bg-card border-accent/20 hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 cursor-pointer"
            onClick={() => handleResourceClick(recommendation.resource.id, recommendation.resource.type)}
          >
            {/* Resource Type Badge */}
            <div className="flex items-start justify-between mb-4">
              <span className="px-2 py-1 rounded text-xs font-medium bg-accent/10 text-accent border border-accent/20">
                {recommendation.resource.type === 'case-study'
                  ? 'Case Study'
                  : recommendation.resource.type === 'blog-article'
                    ? 'Blog Article'
                    : 'Success Story'}
              </span>
              {recommendation.resource.featured && (
                <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                  Featured
                </span>
              )}
            </div>

            {/* Title */}
            <h4 className="text-lg font-semibold mb-2 group-hover:text-accent transition-colors line-clamp-2">
              {recommendation.resource.title}
            </h4>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {recommendation.resource.description}
            </p>

            {/* Metadata */}
            <div className="space-y-3 mb-4 pb-4 border-b border-accent/10">
              {/* Industries */}
              {recommendation.resource.industries.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {recommendation.resource.industries.slice(0, 2).map((industry) => (
                    <span
                      key={industry}
                      className="text-xs px-2 py-1 rounded bg-background text-foreground border border-accent/20"
                    >
                      {industry}
                    </span>
                  ))}
                  {recommendation.resource.industries.length > 2 && (
                    <span className="text-xs px-2 py-1 text-muted-foreground">
                      +{recommendation.resource.industries.length - 2} more
                    </span>
                  )}
                </div>
              )}

              {/* Use Cases */}
              {recommendation.resource.useCases.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {recommendation.resource.useCases.slice(0, 2).map((useCase) => (
                    <span
                      key={useCase}
                      className="text-xs px-2 py-1 rounded bg-accent/5 text-accent border border-accent/20"
                    >
                      {useCase}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Recommendation Reasons */}
            {recommendation.reasons.length > 0 && (
              <div className="mb-4 space-y-1">
                <p className="text-xs font-semibold text-accent uppercase tracking-wide">Why recommended:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {recommendation.reasons.slice(0, 2).map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                {recommendation.resource.readTime && (
                  <span>{recommendation.resource.readTime} min read</span>
                )}
                {recommendation.resource.date && (
                  <>
                    <span>•</span>
                    <span>{recommendation.resource.date}</span>
                  </>
                )}
              </div>
              <ArrowRight className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Export a compact variant for sidebars or smaller spaces
interface CompactResourceRecommendationProps {
  recommendations: Recommendation[];
  type: 'similar-resource' | 'user-behavior' | 'trending';
  onResourceClick?: (resourceId: string) => void;
  maxDisplay?: number;
}

export function CompactResourceRecommendation({
  recommendations,
  type,
  onResourceClick,
  maxDisplay = 3,
}: CompactResourceRecommendationProps) {
  if (recommendations.length === 0) {
    return null;
  }

  const displayedRecommendations = recommendations.slice(0, maxDisplay);

  // Track impression
  React.useEffect(() => {
    trackRecommendationImpression(
      type,
      displayedRecommendations.map((r) => r.resource.id),
      displayedRecommendations.length
    );
  }, [type, displayedRecommendations]);

  const handleResourceClick = (resourceId: string, resourceType: string) => {
    trackRecommendationClick(type, resourceId, resourceType);
    if (onResourceClick) {
      onResourceClick(resourceId);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {getRecommendationIcon(type)}
        <h4 className="font-semibold text-sm">
          {getRecommendationTitle(type)}
        </h4>
      </div>

      <div className="space-y-2">
        {displayedRecommendations.map((recommendation) => (
          <div
            key={recommendation.resource.id}
            className="p-3 rounded-lg bg-card border border-accent/20 hover:border-accent/50 cursor-pointer transition-all hover:bg-accent/5 group"
            onClick={() => handleResourceClick(recommendation.resource.id, recommendation.resource.type)}
          >
            <p className="text-sm font-medium group-hover:text-accent transition-colors line-clamp-2">
              {recommendation.resource.title}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground">
                {recommendation.resource.type === 'case-study'
                  ? 'Case Study'
                  : recommendation.resource.type === 'blog-article'
                    ? 'Article'
                    : 'Story'}
              </span>
              {recommendation.reasons.length > 0 && (
                <span className="text-xs text-accent">{recommendation.reasons[0]}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

