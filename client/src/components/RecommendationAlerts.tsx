import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Bell, Check, ChevronDown, ChevronUp, Info, RotateCcw, Settings2, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  dismissRecommendationAlert,
  evaluateRecommendationAlerts,
  loadRecommendationAlertSettings,
  recommendationTypeLabels,
  resetDismissedRecommendationAlerts,
  saveRecommendationAlertSettings,
  RecommendationAlertSettings,
  RecommendationPerformanceAlert,
  RecommendationType,
} from '@/lib/recommendationAlerts';
import { calculatePerformanceStats, PerformanceStats } from '@/lib/recommendationPerformance';

const recommendationTypes: RecommendationType[] = ['user-behavior', 'trending', 'similar'];

function formatType(type: RecommendationType) {
  return recommendationTypeLabels[type];
}

export function RecommendationAlerts() {
  const [settings, setSettings] = useState<RecommendationAlertSettings>(() => loadRecommendationAlertSettings());
  const [stats, setStats] = useState<PerformanceStats>(() => calculatePerformanceStats());
  const [dismissedAlertIds, setDismissedAlertIds] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  const refresh = useCallback(() => {
    setStats(calculatePerformanceStats());
    setSettings(loadRecommendationAlertSettings());
  }, []);

  useEffect(() => {
    const handlePerformanceUpdate = () => refresh();
    window.addEventListener('recommendation-performance-updated', handlePerformanceUpdate);
    window.addEventListener('recommendation-alert-settings-changed', handlePerformanceUpdate);
    const interval = window.setInterval(refresh, 15_000);

    return () => {
      window.removeEventListener('recommendation-performance-updated', handlePerformanceUpdate);
      window.removeEventListener('recommendation-alert-settings-changed', handlePerformanceUpdate);
      window.clearInterval(interval);
    };
  }, [refresh]);

  const alerts = useMemo(
    () => evaluateRecommendationAlerts(stats, settings).filter((alert) => !dismissedAlertIds.includes(alert.id)),
    [dismissedAlertIds, settings, stats]
  );

  const updateSettings = (changes: Partial<RecommendationAlertSettings>) => {
    const next = saveRecommendationAlertSettings({ ...settings, ...changes });
    setSettings(next);
  };

  const updateType = (type: RecommendationType, enabled: boolean) => {
    updateSettings({ types: { ...settings.types, [type]: enabled } });
  };

  const handleDismiss = (alert: RecommendationPerformanceAlert) => {
    dismissRecommendationAlert(alert.id);
    setDismissedAlertIds((current) => [...current, alert.id]);
  };

  const resetAlerts = () => {
    resetDismissedRecommendationAlerts();
    setDismissedAlertIds([]);
    refresh();
  };

  return (
    <Card className={`overflow-hidden ${alerts.length > 0 ? 'border-amber-500/40' : 'border-accent/20'}`}>
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 rounded-lg p-2 ${alerts.length > 0 ? 'bg-amber-500/15 text-amber-500' : 'bg-accent/10 text-accent'}`}>
            {alerts.length > 0 ? <AlertTriangle className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Performance alerts</h3>
              {alerts.length > 0 && (
                <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-500">
                  {alerts.length} active
                </span>
              )}
            </div>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Get notified in this dashboard when a recommendation type falls below your CTR target.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-start">
          <span className={`text-xs font-medium ${settings.enabled ? 'text-accent' : 'text-muted-foreground'}`}>
            {settings.enabled ? 'Monitoring on' : 'Monitoring off'}
          </span>
          <Switch checked={settings.enabled} onCheckedChange={(enabled) => updateSettings({ enabled })} aria-label="Toggle performance alerts" />
          <Button variant="ghost" size="icon-sm" onClick={() => setShowSettings((open) => !open)} aria-label="Configure performance alerts">
            <Settings2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {alerts.length > 0 ? (
        <div className="space-y-3 border-t border-amber-500/15 bg-amber-500/5 p-5">
          {alerts.map((alert) => (
            <Alert key={alert.id} variant="destructive" className="border-amber-500/30 bg-background/80 text-foreground">
              <AlertTriangle className="text-amber-500" />
              <AlertTitle className="flex items-center justify-between gap-3 text-foreground">
                {formatType(alert.type)} CTR is below target
                <Button variant="ghost" size="icon-sm" onClick={() => handleDismiss(alert)} aria-label={`Dismiss ${formatType(alert.type)} alert`}>
                  <X className="h-4 w-4" />
                </Button>
              </AlertTitle>
              <AlertDescription className="text-muted-foreground">
                <span className="font-semibold text-amber-500">{alert.ctr.toFixed(2)}%</span> CTR from {alert.impressions.toLocaleString()} impressions ({alert.clicks} clicks), below your {alert.threshold.toFixed(1)}% threshold.
              </AlertDescription>
            </Alert>
          ))}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs text-muted-foreground">
            <span>Alerts refresh after new recommendation events and every 15 seconds.</span>
            <Button variant="ghost" size="sm" onClick={resetAlerts} className="h-7 gap-1.5 text-xs">
              <RotateCcw className="h-3 w-3" /> Reset dismissed alerts
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 border-t border-accent/10 bg-accent/5 px-5 py-3 text-sm text-muted-foreground">
          <Check className="h-4 w-4 text-accent" />
          {settings.enabled ? 'All monitored recommendation types are meeting their CTR targets.' : 'Turn monitoring on to receive proactive CTR alerts.'}
        </div>
      )}

      {showSettings && (
        <div className="space-y-5 border-t border-accent/10 bg-card/60 p-5">
          <div className="flex items-start gap-2">
            <Info className="mt-0.5 h-4 w-4 text-accent" />
            <p className="text-sm text-muted-foreground">Alerts only activate after a type reaches the minimum impression count, preventing noisy warnings from small samples.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="flex items-center justify-between text-sm font-medium">
                CTR threshold <span className="text-accent">{settings.threshold.toFixed(1)}%</span>
              </span>
              <input
                type="range"
                min="0.5"
                max="20"
                step="0.5"
                value={settings.threshold}
                onChange={(event) => updateSettings({ threshold: Number(event.target.value) })}
                className="w-full accent-teal-500"
                aria-label="CTR alert threshold"
              />
              <span className="text-xs text-muted-foreground">Alert when CTR falls below this target.</span>
            </label>
            <label className="space-y-2">
              <span className="flex items-center justify-between text-sm font-medium">
                Minimum impressions <span className="text-accent">{settings.minimumImpressions}</span>
              </span>
              <input
                type="range"
                min="1"
                max="100"
                step="1"
                value={settings.minimumImpressions}
                onChange={(event) => updateSettings({ minimumImpressions: Number(event.target.value) })}
                className="w-full accent-teal-500"
                aria-label="Minimum impressions for CTR alerts"
              />
              <span className="text-xs text-muted-foreground">Wait for enough traffic before alerting.</span>
            </label>
          </div>
          <div>
            <p className="mb-3 text-sm font-medium">Monitor recommendation types</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {recommendationTypes.map((type) => (
                <label key={type} className="flex items-center justify-between rounded-lg border border-accent/10 bg-background/40 p-3 text-sm">
                  <span>{formatType(type)}</span>
                  <Switch checked={settings.types[type]} onCheckedChange={(enabled) => updateType(type, enabled)} aria-label={`Monitor ${formatType(type)}`} />
                </label>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-accent/10 pt-4">
            <p className="text-xs text-muted-foreground">Settings are saved to this browser for your profile.</p>
            <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)} className="gap-1.5">
              {showSettings ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />} Close
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
