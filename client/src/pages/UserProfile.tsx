import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2, Plus, TrendingUp, Clock, BarChart3, Settings, Filter } from 'lucide-react';
import {
  loadUserPreferences,
  saveUserPreferences,
  removeUserInterest,
  clearSearchHistory,
  getRecommendationStats,
  getTopInterestsByCategory,
  updatePersonalizationSettings,
  deleteAllUserData,
  updateRecommendationFilters,
  UserPreferences,
} from '@/lib/userPreferences';
import { allResources } from '@/lib/resourceMetadata';

/**
 * User Profile & Personalization Dashboard
 * 
 * Allows users to:
 * - View and manage their interests
 * - Review search history
 * - See recommendation statistics
 * - Adjust personalization settings
 * - Export/delete their data
 */

export function UserProfile() {
  const [, setLocation] = useLocation();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [activeTab, setActiveTab] = useState<'interests' | 'history' | 'stats' | 'settings' | 'filters'>('interests');
  const [stats, setStats] = useState(getRecommendationStats(null));

  useEffect(() => {
    const prefs = loadUserPreferences();
    setPreferences(prefs);
    if (prefs) {
      setStats(getRecommendationStats(prefs));
    }
  }, []);

  if (!preferences) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-muted-foreground">Loading profile...</div>
      </div>
    );
  }

  const handleRemoveInterest = (category: any, value: string) => {
    const updated = removeUserInterest(preferences, category, value);
    setPreferences(updated);
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear your search history? This cannot be undone.')) {
      const updated = clearSearchHistory(preferences);
      setPreferences(updated);
    }
  };

  const handleDeleteAllData = () => {
    if (
      confirm(
        'Are you sure you want to delete all your personal data? This will reset your profile completely.'
      )
    ) {
      deleteAllUserData();
      setLocation('/');
    }
  };

  const handleToggleSetting = (setting: 'enablePersonalization' | 'enableSearchTracking') => {
    const newValue = !preferences.settings[setting];
    const updated = updatePersonalizationSettings(preferences, {
      [setting]: newValue,
    });
    setPreferences(updated);
  };

  const handleToggleFilter = (filterType: 'showTrending' | 'showSimilar' | 'showUserBehavior') => {
    const updated = updateRecommendationFilters(preferences, {
      [filterType]: !preferences.recommendationFilters[filterType],
    });
    setPreferences(updated);
  };

  const topIndustries = getTopInterestsByCategory(preferences, 'industry', 5);
  const topUseCases = getTopInterestsByCategory(preferences, 'useCase', 5);
  const topTopics = getTopInterestsByCategory(preferences, 'topic', 5);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-accent/10 bg-card/50">
        <div className="container max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setLocation('/blog')}
              className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold">Your Profile</h1>
              <p className="text-muted-foreground">Manage your interests and personalization preferences</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 border-b border-accent/10">
            {(['interests', 'history', 'stats', 'filters', 'settings'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                  activeTab === tab
                    ? 'border-accent text-accent'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab === 'interests' && 'Interests'}
                {tab === 'history' && 'Search History'}
                {tab === 'stats' && 'Statistics'}
                {tab === 'filters' && 'Filters'}
                {tab === 'settings' && 'Settings'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Interests Tab */}
        {activeTab === 'interests' && (
          <div className="space-y-8">
            {/* Industries */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-accent" />
                <h2 className="text-xl font-bold">Industries of Interest</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topIndustries.length > 0 ? (
                  topIndustries.map((interest) => (
                    <Card key={`${interest.category}-${interest.value}`} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium">{interest.value}</p>
                        <div className="w-32 h-2 bg-accent/10 rounded-full mt-2">
                          <div
                            className="h-full bg-accent rounded-full"
                            style={{ width: `${interest.weight * 100}%` }}
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveInterest(interest.category, interest.value)}
                        className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted-foreground col-span-2">No industries tracked yet. Search and filter to build your interests.</p>
                )}
              </div>
            </div>

            {/* Use Cases */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-accent" />
                <h2 className="text-xl font-bold">Use Cases of Interest</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topUseCases.length > 0 ? (
                  topUseCases.map((interest) => (
                    <Card key={`${interest.category}-${interest.value}`} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium">{interest.value}</p>
                        <div className="w-32 h-2 bg-accent/10 rounded-full mt-2">
                          <div
                            className="h-full bg-accent rounded-full"
                            style={{ width: `${interest.weight * 100}%` }}
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveInterest(interest.category, interest.value)}
                        className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted-foreground col-span-2">No use cases tracked yet. Search and filter to build your interests.</p>
                )}
              </div>
            </div>

            {/* Topics */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-accent" />
                <h2 className="text-xl font-bold">Topics of Interest</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topTopics.length > 0 ? (
                  topTopics.map((interest) => (
                    <Card key={`${interest.category}-${interest.value}`} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium">{interest.value}</p>
                        <div className="w-32 h-2 bg-accent/10 rounded-full mt-2">
                          <div
                            className="h-full bg-accent rounded-full"
                            style={{ width: `${interest.weight * 100}%` }}
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveInterest(interest.category, interest.value)}
                        className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted-foreground col-span-2">No topics tracked yet. Search and filter to build your interests.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Search History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" />
                <h2 className="text-xl font-bold">Search History</h2>
              </div>
              {preferences.searchHistory.length > 0 && (
                <Button variant="outline" size="sm" onClick={handleClearHistory}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear History
                </Button>
              )}
            </div>

            {preferences.searchHistory.length > 0 ? (
              <div className="space-y-3">
                {preferences.searchHistory.map((entry, idx) => (
                  <Card key={idx} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-lg">{entry.query}</p>
                        <p className="text-sm text-muted-foreground">
                          {entry.resultCount} result{entry.resultCount !== 1 ? 's' : ''} •{' '}
                          {new Date(entry.timestamp).toLocaleDateString()} at{' '}
                          {new Date(entry.timestamp).toLocaleTimeString()}
                        </p>
                        {entry.appliedFilters && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {entry.appliedFilters.industries?.map((ind) => (
                              <span key={ind} className="px-2 py-1 bg-accent/10 text-accent text-xs rounded">
                                {ind}
                              </span>
                            ))}
                            {entry.appliedFilters.useCases?.map((uc) => (
                              <span key={uc} className="px-2 py-1 bg-accent/10 text-accent text-xs rounded">
                                {uc}
                              </span>
                            ))}
                            {entry.appliedFilters.topics?.map((topic) => (
                              <span key={topic} className="px-2 py-1 bg-accent/10 text-accent text-xs rounded">
                                {topic}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No search history yet. Start searching to see your history here.</p>
              </Card>
            )}
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-bold">Recommendation Statistics</h2>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-6">
                <p className="text-muted-foreground text-sm mb-2">Total Shown</p>
                <p className="text-3xl font-bold">{stats.totalShown}</p>
              </Card>
              <Card className="p-6">
                <p className="text-muted-foreground text-sm mb-2">Clicked</p>
                <p className="text-3xl font-bold text-accent">{stats.totalClicked}</p>
              </Card>
              <Card className="p-6">
                <p className="text-muted-foreground text-sm mb-2">Click-Through Rate</p>
                <p className="text-3xl font-bold">{stats.clickThroughRate}%</p>
              </Card>
              <Card className="p-6">
                <p className="text-muted-foreground text-sm mb-2">Dismissed</p>
                <p className="text-3xl font-bold">{stats.totalDismissed}</p>
              </Card>
            </div>

            {/* Breakdown by Type */}
            <Card className="p-6">
              <h3 className="font-bold mb-4">Recommendations by Type</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">User Behavior</span>
                  <span className="font-medium">{stats.byType.userBehavior}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Trending</span>
                  <span className="font-medium">{stats.byType.trending}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Similar Resources</span>
                  <span className="font-medium">{stats.byType.similar}</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <Settings className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-bold">Personalization Settings</h2>
            </div>

            {/* Toggle Settings */}
            <div className="space-y-4">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Personalization</p>
                    <p className="text-sm text-muted-foreground">
                      Allow the system to personalize recommendations based on your behavior
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggleSetting('enablePersonalization')}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      preferences.settings.enablePersonalization ? 'bg-accent' : 'bg-muted'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        preferences.settings.enablePersonalization ? 'translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Search Tracking</p>
                    <p className="text-sm text-muted-foreground">
                      Track your searches to improve recommendations
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggleSetting('enableSearchTracking')}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      preferences.settings.enableSearchTracking ? 'bg-accent' : 'bg-muted'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        preferences.settings.enableSearchTracking ? 'translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>
              </Card>
            </div>

            {/* Recommendation Frequency */}
            <Card className="p-6">
              <div className="mb-4">
                <p className="font-medium text-lg">Recommendation Frequency</p>
                <p className="text-sm text-muted-foreground mt-1">How often recommendations appear on the Blog page</p>
              </div>
              <div className="space-y-3">
                {[
                  { value: 'always' as const, label: 'Always', description: 'Show recommendations on every page load' },
                  { value: 'often' as const, label: 'Often', description: 'Show recommendations frequently' },
                  { value: 'sometimes' as const, label: 'Sometimes', description: 'Show recommendations occasionally' },
                  { value: 'rarely' as const, label: 'Rarely', description: 'Show recommendations infrequently' },
                ].map((freq) => (
                  <label key={freq.value} className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-accent/5 transition-colors">
                    <input
                      type="radio"
                      name="frequency"
                      checked={preferences.settings.recommendationFrequency === freq.value}
                      onChange={() =>
                        setPreferences(
                          updatePersonalizationSettings(preferences, {
                            recommendationFrequency: freq.value,
                          })
                        )
                      }
                      className="w-4 h-4 mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{freq.label}</p>
                      <p className="text-sm text-muted-foreground">{freq.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </Card>

            {/* Data Management */}
            <Card className="p-6 border-destructive/20 bg-destructive/5">
              <h3 className="font-bold mb-4 text-destructive">Data Management</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={() => {
                  const data = JSON.stringify(preferences, null, 2);
                  const blob = new Blob([data], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `user-data-${new Date().toISOString()}.json`;
                  a.click();
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Export My Data
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={handleDeleteAllData}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete All My Data
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Filters Tab */}
        {activeTab === 'filters' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <Filter className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-bold">Recommendation Filters</h2>
            </div>

            <p className="text-muted-foreground mb-6">
              Choose which types of recommendations you'd like to see. You can enable or disable each type to customize your experience.
            </p>

            {/* Filter Toggles */}
            <div className="space-y-4">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-lg">User Behavior Recommendations</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Resources based on your search history and interests
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggleFilter('showUserBehavior')}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      preferences.recommendationFilters.showUserBehavior ? 'bg-accent' : 'bg-muted'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        preferences.recommendationFilters.showUserBehavior ? 'translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-lg">Trending Resources</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Popular resources from the community
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggleFilter('showTrending')}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      preferences.recommendationFilters.showTrending ? 'bg-accent' : 'bg-muted'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        preferences.recommendationFilters.showTrending ? 'translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-lg">Similar Resources</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Resources similar to ones you've viewed
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggleFilter('showSimilar')}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      preferences.recommendationFilters.showSimilar ? 'bg-accent' : 'bg-muted'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        preferences.recommendationFilters.showSimilar ? 'translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>
              </Card>
            </div>

            {/* Active Filters Summary */}
            <Card className="p-6 bg-accent/5 border-accent/20">
              <p className="font-medium mb-3">Active Filters</p>
              <div className="flex flex-wrap gap-2">
                {preferences.recommendationFilters.showUserBehavior && (
                  <span className="px-3 py-1 bg-accent/20 text-accent text-sm rounded-full">
                    User Behavior
                  </span>
                )}
                {preferences.recommendationFilters.showTrending && (
                  <span className="px-3 py-1 bg-accent/20 text-accent text-sm rounded-full">
                    Trending
                  </span>
                )}
                {preferences.recommendationFilters.showSimilar && (
                  <span className="px-3 py-1 bg-accent/20 text-accent text-sm rounded-full">
                    Similar Resources
                  </span>
                )}
                {!preferences.recommendationFilters.showUserBehavior &&
                  !preferences.recommendationFilters.showTrending &&
                  !preferences.recommendationFilters.showSimilar && (
                    <p className="text-muted-foreground text-sm">No filters active. Enable at least one filter to see recommendations.</p>
                  )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
