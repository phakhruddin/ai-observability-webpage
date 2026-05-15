import { ResourceMetadata, allResources } from './resourceMetadata';

/**
 * Recommendation Engine for AI Observability Resources
 * 
 * Implements multi-signal recommendation scoring based on:
 * - Resource similarity (shared industries, use cases, topics)
 * - User behavior (search history, filter patterns, clicks)
 * - Content freshness and popularity
 */

export interface UserBehavior {
  searchQueries: string[];
  appliedFilters: {
    industries?: string[];
    useCases?: string[];
    topics?: string[];
  };
  viewedResourceIds: string[];
  clickedResourceIds: string[];
}

export interface RecommendationScore {
  resourceId: string;
  score: number;
  reasons: string[];
}

export interface Recommendation {
  resource: ResourceMetadata;
  score: number;
  reasons: string[];
}

// Calculate similarity between two resources based on metadata overlap
function calculateResourceSimilarity(resource1: ResourceMetadata, resource2: ResourceMetadata): number {
  let similarityScore = 0;
  let maxScore = 0;

  // Industry similarity (weight: 3)
  const industryOverlap = resource1.industries.filter((ind) =>
    resource2.industries.includes(ind)
  ).length;
  similarityScore += industryOverlap * 3;
  maxScore += Math.max(resource1.industries.length, resource2.industries.length) * 3;

  // Use case similarity (weight: 3)
  const useCaseOverlap = resource1.useCases.filter((uc) =>
    resource2.useCases.includes(uc)
  ).length;
  similarityScore += useCaseOverlap * 3;
  maxScore += Math.max(resource1.useCases.length, resource2.useCases.length) * 3;

  // Topic similarity (weight: 2)
  const topicOverlap = resource1.topics.filter((t) =>
    resource2.topics.includes(t)
  ).length;
  similarityScore += topicOverlap * 2;
  maxScore += Math.max(resource1.topics.length, resource2.topics.length) * 2;

  // Resource type bonus (weight: 1)
  if (resource1.type === resource2.type) {
    similarityScore += 1;
  }
  maxScore += 1;

  return maxScore > 0 ? similarityScore / maxScore : 0;
}

// Calculate behavior-based score based on user's search/filter patterns
function calculateBehaviorScore(resource: ResourceMetadata, behavior: UserBehavior): number {
  let score = 0;

  // Boost for resources matching applied filters
  if (behavior.appliedFilters.industries && behavior.appliedFilters.industries.length > 0) {
    const matchingIndustries = resource.industries.filter((ind) =>
      behavior.appliedFilters.industries?.includes(ind)
    ).length;
    score += matchingIndustries * 2;
  }

  if (behavior.appliedFilters.useCases && behavior.appliedFilters.useCases.length > 0) {
    const matchingUseCases = resource.useCases.filter((uc) =>
      behavior.appliedFilters.useCases?.includes(uc)
    ).length;
    score += matchingUseCases * 2;
  }

  if (behavior.appliedFilters.topics && behavior.appliedFilters.topics.length > 0) {
    const matchingTopics = resource.topics.filter((t) =>
      behavior.appliedFilters.topics?.includes(t)
    ).length;
    score += matchingTopics * 1.5;
  }

  // Boost for resources matching search queries
  if (behavior.searchQueries.length > 0) {
    const queryMatch = behavior.searchQueries.some((query) => {
      const lowerQuery = query.toLowerCase();
      return (
        resource.title.toLowerCase().includes(lowerQuery) ||
        resource.description.toLowerCase().includes(lowerQuery) ||
        resource.topics.some((t) => t.toLowerCase().includes(lowerQuery))
      );
    });
    if (queryMatch) {
      score += 1;
    }
  }

  return score;
}

// Calculate recency score (newer content gets slight boost)
function calculateRecencyScore(resource: ResourceMetadata): number {
  // Parse date string (e.g., "May 2026")
  const dateStr = resource.date.toLowerCase();
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const months: { [key: string]: number } = {
    january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
    july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
  };

  let resourceMonth = 0;
  let resourceYear = currentYear;

  for (const [monthName, monthNum] of Object.entries(months)) {
    if (dateStr.includes(monthName)) {
      resourceMonth = monthNum;
      break;
    }
  }

  // Extract year if present
  const yearMatch = dateStr.match(/\d{4}/);
  if (yearMatch) {
    resourceYear = parseInt(yearMatch[0]);
  }

  // Calculate months difference
  const monthsDiff = (currentYear - resourceYear) * 12 + (currentMonth - resourceMonth);
  
  // Recency boost: newer content gets higher score, but not overwhelming
  // 0 months old = 1.0, 6 months old = 0.7, 12 months old = 0.4
  return Math.max(0.4, 1 - (monthsDiff * 0.05));
}

// Get recommendations based on a specific viewed resource
export function getRecommendationsForResource(
  resourceId: string,
  count: number = 3
): Recommendation[] {
  const viewedResource = allResources.find((r) => r.id === resourceId);
  if (!viewedResource) return [];

  const recommendations: RecommendationScore[] = allResources
    .filter((r) => r.id !== resourceId)
    .map((resource) => {
      const similarity = calculateResourceSimilarity(viewedResource, resource);
      const recency = calculateRecencyScore(resource);
      const score = similarity * 0.7 + recency * 0.3;

      const reasons: string[] = [];

      // Generate human-readable reasons
      const industryOverlap = viewedResource.industries.filter((ind) =>
        resource.industries.includes(ind)
      );
      if (industryOverlap.length > 0) {
        reasons.push(`Related to ${industryOverlap.join(', ')}`);
      }

      const useCaseOverlap = viewedResource.useCases.filter((uc) =>
        resource.useCases.includes(uc)
      );
      if (useCaseOverlap.length > 0) {
        reasons.push(`Covers ${useCaseOverlap.join(', ')}`);
      }

      const topicOverlap = viewedResource.topics.filter((t) =>
        resource.topics.includes(t)
      );
      if (topicOverlap.length > 0) {
        reasons.push(`Related topic: ${topicOverlap.join(', ')}`);
      }

      return { resourceId: resource.id, score, reasons };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, count);

  return recommendations.map((rec) => ({
    resource: allResources.find((r) => r.id === rec.resourceId)!,
    score: rec.score,
    reasons: rec.reasons,
  }));
}

// Get recommendations based on user behavior
export function getRecommendationsForUser(
  behavior: UserBehavior,
  count: number = 3,
  excludeResourceIds: string[] = []
): Recommendation[] {
  // If user has viewed resources, use them as base for similarity
  if (behavior.viewedResourceIds.length > 0) {
    const allRecommendations: RecommendationScore[] = [];

    // Get recommendations for each viewed resource
    behavior.viewedResourceIds.forEach((viewedId) => {
      const recs = getRecommendationsForResource(viewedId, 10);
      recs.forEach((rec) => {
        const existing = allRecommendations.find((r) => r.resourceId === rec.resource.id);
        if (existing) {
          existing.score += rec.score;
          existing.reasons = Array.from(new Set([...existing.reasons, ...rec.reasons]));
        } else {
          allRecommendations.push({
            resourceId: rec.resource.id,
            score: rec.score,
            reasons: rec.reasons,
          });
        }
      });
    });

    // Apply behavior-based scoring
    const behaviorScores = allRecommendations.map((rec) => {
      const resource = allResources.find((r) => r.id === rec.resourceId)!;
      const behaviorScore = calculateBehaviorScore(resource, behavior);
      return {
        ...rec,
        score: rec.score * 0.6 + behaviorScore * 0.4,
      };
    });

    return behaviorScores
      .filter((r) => !excludeResourceIds.includes(r.resourceId))
      .sort((a, b) => b.score - a.score)
      .slice(0, count)
      .map((rec) => ({
        resource: allResources.find((r) => r.id === rec.resourceId)!,
        score: rec.score,
        reasons: rec.reasons,
      }));
  }

  // Fallback: recommend based on current filters/searches
  const recommendations: RecommendationScore[] = allResources
    .filter((r) => !excludeResourceIds.includes(r.id))
    .map((resource) => {
      const behaviorScore = calculateBehaviorScore(resource, behavior);
      const recency = calculateRecencyScore(resource);
      const score = behaviorScore * 0.6 + recency * 0.4;

      const reasons: string[] = [];
      if (behavior.appliedFilters.industries?.length) {
        const matching = resource.industries.filter((ind) =>
          behavior.appliedFilters.industries?.includes(ind)
        );
        if (matching.length > 0) {
          reasons.push(`Matches your industry filter`);
        }
      }
      if (behavior.appliedFilters.useCases?.length) {
        const matching = resource.useCases.filter((uc) =>
          behavior.appliedFilters.useCases?.includes(uc)
        );
        if (matching.length > 0) {
          reasons.push(`Addresses your use case`);
        }
      }

      return { resourceId: resource.id, score, reasons };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, count);

  return recommendations.map((rec) => ({
    resource: allResources.find((r) => r.id === rec.resourceId)!,
    score: rec.score,
    reasons: rec.reasons,
  }));
}

// Get trending/popular resources
export function getTrendingResources(count: number = 3): Recommendation[] {
  return allResources
    .map((resource) => ({
      resource,
      score: calculateRecencyScore(resource) * (resource.featured ? 1.5 : 1),
      reasons: resource.featured ? ['Featured content'] : ['Popular resource'],
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}

// Load user behavior from localStorage
export function loadUserBehavior(): UserBehavior {
  try {
    const stored = localStorage.getItem('resourceRecommendationBehavior');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load user behavior:', e);
  }

  return {
    searchQueries: [],
    appliedFilters: {},
    viewedResourceIds: [],
    clickedResourceIds: [],
  };
}

// Save user behavior to localStorage
export function saveUserBehavior(behavior: UserBehavior): void {
  try {
    localStorage.setItem('resourceRecommendationBehavior', JSON.stringify(behavior));
  } catch (e) {
    console.error('Failed to save user behavior:', e);
  }
}

// Record a search query
export function recordSearchQuery(query: string): void {
  const behavior = loadUserBehavior();
  if (query && !behavior.searchQueries.includes(query)) {
    behavior.searchQueries.push(query);
    // Keep only last 10 searches
    if (behavior.searchQueries.length > 10) {
      behavior.searchQueries = behavior.searchQueries.slice(-10);
    }
    saveUserBehavior(behavior);
  }
}

// Record applied filters
export function recordAppliedFilters(filters: {
  industries?: string[];
  useCases?: string[];
  topics?: string[];
}): void {
  const behavior = loadUserBehavior();
  behavior.appliedFilters = filters;
  saveUserBehavior(behavior);
}

// Record a viewed resource
export function recordViewedResource(resourceId: string): void {
  const behavior = loadUserBehavior();
  if (!behavior.viewedResourceIds.includes(resourceId)) {
    behavior.viewedResourceIds.push(resourceId);
    // Keep only last 20 viewed resources
    if (behavior.viewedResourceIds.length > 20) {
      behavior.viewedResourceIds = behavior.viewedResourceIds.slice(-20);
    }
    saveUserBehavior(behavior);
  }
}

// Record a clicked resource
export function recordClickedResource(resourceId: string): void {
  const behavior = loadUserBehavior();
  if (!behavior.clickedResourceIds.includes(resourceId)) {
    behavior.clickedResourceIds.push(resourceId);
    // Keep only last 20 clicked resources
    if (behavior.clickedResourceIds.length > 20) {
      behavior.clickedResourceIds = behavior.clickedResourceIds.slice(-20);
    }
    saveUserBehavior(behavior);
  }
}

// Clear user behavior (for testing or user preference)
export function clearUserBehavior(): void {
  localStorage.removeItem('resourceRecommendationBehavior');
}
