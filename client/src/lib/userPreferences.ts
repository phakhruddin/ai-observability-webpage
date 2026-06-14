/**
 * User Preferences & Personalization
 * 
 * Manages user profile data, interests, and personalization settings
 * Stores preferences in localStorage for persistence
 */

export interface UserInterest {
  category: 'industry' | 'useCase' | 'topic' | 'resourceType';
  value: string;
  weight: number; // 0-1, higher = more interested
  addedAt: number; // timestamp
}

export interface SearchHistoryEntry {
  query: string;
  timestamp: number;
  resultCount: number;
  appliedFilters?: {
    industries?: string[];
    useCases?: string[];
    topics?: string[];
  };
}

export interface RecommendationHistoryEntry {
  resourceId: string;
  recommendationType: 'user-behavior' | 'trending' | 'similar';
  shownAt: number;
  clicked: boolean;
  clickedAt?: number;
  dismissed: boolean;
  dismissedAt?: number;
}

export interface RecommendationFilters {
  showTrending: boolean;
  showSimilar: boolean;
  showUserBehavior: boolean;
}

export interface UserPreferences {
  userId: string;
  createdAt: number;
  interests: UserInterest[];
  searchHistory: SearchHistoryEntry[];
  recommendationHistory: RecommendationHistoryEntry[];
  settings: {
    enablePersonalization: boolean;
    enableSearchTracking: boolean;
    maxSearchHistoryItems: number;
    recommendationFrequency: 'always' | 'often' | 'sometimes' | 'rarely';
    preferredResourceTypes: string[];
  };
  recommendationFilters: RecommendationFilters;
}

const STORAGE_KEY = 'user_preferences_v1';
const DEFAULT_PREFERENCES: UserPreferences = {
  userId: generateUserId(),
  createdAt: Date.now(),
  interests: [],
  searchHistory: [],
  recommendationHistory: [],
  settings: {
    enablePersonalization: true,
    enableSearchTracking: true,
    maxSearchHistoryItems: 50,
    recommendationFrequency: 'often',
    preferredResourceTypes: [],
  },
  recommendationFilters: {
    showTrending: true,
    showSimilar: true,
    showUserBehavior: true,
  },
};

function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Load user preferences from localStorage, or create default if not exists
 */
export function loadUserPreferences(): UserPreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const prefs = JSON.parse(stored);
      // Ensure new properties exist for backward compatibility
      if (!prefs.recommendationFilters) {
        prefs.recommendationFilters = DEFAULT_PREFERENCES.recommendationFilters;
      }
      return prefs;
    }
  } catch (error) {
    console.error('Failed to load user preferences:', error);
  }
  return { ...DEFAULT_PREFERENCES };
}

/**
 * Save user preferences to localStorage
 */
export function saveUserPreferences(preferences: UserPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Failed to save user preferences:', error);
  }
}

/**
 * Add or update a user interest
 */
export function addUserInterest(
  preferences: UserPreferences,
  category: UserInterest['category'],
  value: string,
  weight: number = 0.7
): UserPreferences {
  const existingIndex = preferences.interests.findIndex(
    (i) => i.category === category && i.value === value
  );

  if (existingIndex >= 0) {
    // Update existing interest weight
    preferences.interests[existingIndex].weight = Math.min(1, weight + 0.1);
  } else {
    // Add new interest
    preferences.interests.push({
      category,
      value,
      weight,
      addedAt: Date.now(),
    });
  }

  // Keep only top 20 interests by weight
  preferences.interests.sort((a, b) => b.weight - a.weight);
  preferences.interests = preferences.interests.slice(0, 20);

  saveUserPreferences(preferences);
  return preferences;
}

/**
 * Remove a user interest
 */
export function removeUserInterest(
  preferences: UserPreferences,
  category: UserInterest['category'],
  value: string
): UserPreferences {
  preferences.interests = preferences.interests.filter(
    (i) => !(i.category === category && i.value === value)
  );
  saveUserPreferences(preferences);
  return preferences;
}

/**
 * Add search to history
 */
export function addSearchToHistory(
  preferences: UserPreferences,
  query: string,
  resultCount: number,
  appliedFilters?: SearchHistoryEntry['appliedFilters']
): UserPreferences {
  if (!preferences.settings.enableSearchTracking) {
    return preferences;
  }

  preferences.searchHistory.unshift({
    query,
    timestamp: Date.now(),
    resultCount,
    appliedFilters,
  });

  // Keep only max items
  preferences.searchHistory = preferences.searchHistory.slice(
    0,
    preferences.settings.maxSearchHistoryItems
  );

  saveUserPreferences(preferences);
  return preferences;
}

/**
 * Clear search history
 */
export function clearSearchHistory(preferences: UserPreferences): UserPreferences {
  preferences.searchHistory = [];
  saveUserPreferences(preferences);
  return preferences;
}

/**
 * Record recommendation shown to user
 */
export function recordRecommendationShown(
  preferences: UserPreferences,
  resourceId: string,
  type: RecommendationHistoryEntry['recommendationType']
): UserPreferences {
  preferences.recommendationHistory.unshift({
    resourceId,
    recommendationType: type,
    shownAt: Date.now(),
    clicked: false,
    dismissed: false,
  });

  // Keep only recent 100 entries
  preferences.recommendationHistory = preferences.recommendationHistory.slice(0, 100);

  saveUserPreferences(preferences);
  return preferences;
}

/**
 * Record recommendation click
 */
export function recordRecommendationClick(
  preferences: UserPreferences,
  resourceId: string
): UserPreferences {
  const entry = preferences.recommendationHistory.find((r) => r.resourceId === resourceId);
  if (entry) {
    entry.clicked = true;
    entry.clickedAt = Date.now();
  }
  saveUserPreferences(preferences);
  return preferences;
}

/**
 * Record recommendation dismissed
 */
export function recordRecommendationDismissed(
  preferences: UserPreferences,
  resourceId: string
): UserPreferences {
  const entry = preferences.recommendationHistory.find((r) => r.resourceId === resourceId);
  if (entry) {
    entry.dismissed = true;
    entry.dismissedAt = Date.now();
  }
  saveUserPreferences(preferences);
  return preferences;
}

/**
 * Get recommendation statistics
 */
export function getRecommendationStats(preferences: UserPreferences | null | undefined) {
  if (!preferences) {
    return {
      totalShown: 0,
      totalClicked: 0,
      totalDismissed: 0,
      clickThroughRate: '0.0',
      byType: {
        userBehavior: 0,
        trending: 0,
        similar: 0,
      },
    };
  }

  const totalShown = preferences.recommendationHistory?.length || 0;
  const totalClicked = preferences.recommendationHistory?.filter((r) => r.clicked).length || 0;
  const totalDismissed = preferences.recommendationHistory?.filter((r) => r.dismissed).length || 0;
  const ctr = totalShown > 0 ? (totalClicked / totalShown) * 100 : 0;

  return {
    totalShown,
    totalClicked,
    totalDismissed,
    clickThroughRate: ctr.toFixed(1),
    byType: {
      userBehavior: preferences.recommendationHistory.filter(
        (r) => r.recommendationType === 'user-behavior'
      ).length,
      trending: preferences.recommendationHistory.filter(
        (r) => r.recommendationType === 'trending'
      ).length,
      similar: preferences.recommendationHistory.filter(
        (r) => r.recommendationType === 'similar'
      ).length,
    },
  };
}

/**
 * Get top interests by category
 */
export function getTopInterestsByCategory(
  preferences: UserPreferences,
  category: UserInterest['category'],
  limit: number = 5
): UserInterest[] {
  return preferences.interests
    .filter((i) => i.category === category)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, limit);
}

/**
 * Update personalization settings
 */
export function updatePersonalizationSettings(
  preferences: UserPreferences,
  settings: Partial<UserPreferences['settings']>
): UserPreferences {
  preferences.settings = { ...preferences.settings, ...settings };
  saveUserPreferences(preferences);
  return preferences;
}

/**
 * Export user data (for GDPR compliance)
 */
export function exportUserData(preferences: UserPreferences): string {
  return JSON.stringify(preferences, null, 2);
}

/**
 * Delete all user data
 */
export function deleteAllUserData(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Update recommendation filters
 */
export function updateRecommendationFilters(
  preferences: UserPreferences,
  filters: Partial<RecommendationFilters>
): UserPreferences {
  const updated = { ...preferences };
  updated.recommendationFilters = {
    ...updated.recommendationFilters,
    ...filters,
  };
  saveUserPreferences(updated);
  return updated;
}

/**
 * Get active recommendation types based on filters
 */
export function getActiveRecommendationTypes(preferences: UserPreferences): Array<'user-behavior' | 'trending' | 'similar'> {
  const types: Array<'user-behavior' | 'trending' | 'similar'> = [];
  if (preferences.recommendationFilters.showUserBehavior) types.push('user-behavior');
  if (preferences.recommendationFilters.showTrending) types.push('trending');
  if (preferences.recommendationFilters.showSimilar) types.push('similar');
  return types;
}

/**
 * Check if a recommendation type is enabled
 */
export function isRecommendationTypeEnabled(
  preferences: UserPreferences,
  type: 'user-behavior' | 'trending' | 'similar'
): boolean {
  switch (type) {
    case 'user-behavior':
      return preferences.recommendationFilters.showUserBehavior;
    case 'trending':
      return preferences.recommendationFilters.showTrending;
    case 'similar':
      return preferences.recommendationFilters.showSimilar;
  }
}
