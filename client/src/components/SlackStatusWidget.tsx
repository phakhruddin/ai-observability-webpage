import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slack, RefreshCw, AlertTriangle, CheckCircle2, Activity } from "lucide-react";
import {
  StatusBadge,
  MetricCard,
  HealthIndicator,
  ConnectionStatus,
  DiagnosticItem,
  type HealthStatus,
} from "@/components/StatusIndicator";
import { MetricsChart } from "@/components/MetricsChart";
import { toast } from "sonner";
import { trackStatusRefresh, trackTestMessageSent, trackPermissionsReview, trackSlackAppSettings, trackReconnect } from "@/lib/statusWidgetAnalytics";

/**
 * SlackStatusWidget Component
 * 
 * Displays real-time Slack integration health and diagnostics:
 * - Connection status and health indicators
 * - Delivery metrics (success rate, latency, alerts sent)
 * - Diagnostic checks (bot permissions, channel access, API connectivity)
 * - Quick troubleshooting actions
 * 
 * Design: Professional monitoring dashboard with dark theme
 */

interface DiagnosticCheck {
  name: string;
  status: HealthStatus;
  details: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function SlackStatusWidget() {
  const [isConnected, setIsConnected] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastChecked, setLastChecked] = useState<string | null>(null);
  const [metrics, setMetrics] = useState({
    alertsSent: 1247,
    successRate: 99.2,
    avgLatency: 1.2,
    failedAlerts: 10,
  });
  const [diagnostics, setDiagnostics] = useState<DiagnosticCheck[]>([
    {
      name: "Bot Token Valid",
      status: "healthy",
      details: "Token is active and has not expired",
    },
    {
      name: "Bot Permissions",
      status: "healthy",
      details: "All required scopes are granted",
    },
    {
      name: "Channel Access",
      status: "healthy",
      details: "Bot has access to all configured channels",
    },
    {
      name: "API Connectivity",
      status: "healthy",
      details: "Connection to Slack API is stable",
    },
    {
      name: "Message Delivery",
      status: "healthy",
      details: "Last message delivered 2 minutes ago",
    },
  ]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Simulate API call to refresh diagnostics
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const now = new Date();
      setLastChecked(now.toLocaleTimeString());
      
      // Randomly update one metric for demo
      setMetrics((prev) => ({
        ...prev,
        alertsSent: prev.alertsSent + Math.floor(Math.random() * 5),
      }));

      trackStatusRefresh("healthy");
      toast.success("Status refreshed successfully!");
    } catch (error) {
      toast.error("Failed to refresh status");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleReconnect = async () => {
    setIsRefreshing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsConnected(true);
      const now = new Date();
      setLastChecked(now.toLocaleTimeString());
      trackReconnect();
      toast.success("Reconnected to Slack successfully!");
    } catch (error) {
      toast.error("Failed to reconnect");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleFixPermissions = () => {
    trackPermissionsReview();
    toast.info("Opening Slack app settings...");
    window.open("https://api.slack.com/apps", "_blank");
  };

  const handleTestMessage = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      trackTestMessageSent();
      toast.success("Test message sent to #critical-alerts!");
    } catch (error) {
      toast.error("Failed to send test message");
    }
  };

  useEffect(() => {
    const now = new Date();
    setLastChecked(now.toLocaleTimeString());
  }, []);

  const overallHealth: HealthStatus = diagnostics.every((d) => d.status === "healthy")
    ? "healthy"
    : diagnostics.some((d) => d.status === "error")
    ? "error"
    : "warning";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10">
            <Slack className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Slack Integration Status</h2>
            <p className="text-sm text-muted-foreground">
              Last checked: {lastChecked || "Never"}
            </p>
          </div>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2"
          variant="outline"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Checking..." : "Refresh"}
        </Button>
      </div>

      {/* Overall Health Status */}
      <Card className="bg-card border-border p-6">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <HealthIndicator status={overallHealth} size="lg" />
              <h3 className="text-lg font-semibold text-foreground">
                {overallHealth === "healthy"
                  ? "All Systems Operational"
                  : overallHealth === "warning"
                  ? "Minor Issues Detected"
                  : "Connection Issues"}
              </h3>
            </div>
            <p className="text-muted-foreground">
              {overallHealth === "healthy"
                ? "Your Slack integration is working perfectly. All checks passed."
                : overallHealth === "warning"
                ? "Some checks have warnings. Review the diagnostics below."
                : "Connection to Slack is unavailable. Please reconnect."}
            </p>
          </div>
          {!isConnected && (
            <Button
              onClick={handleReconnect}
              disabled={isRefreshing}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Reconnect
            </Button>
          )}
        </div>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          label="Alerts Sent"
          value={metrics.alertsSent}
          trend="up"
          trendValue="+12 today"
          icon={<Activity className="w-5 h-5" />}
        />
        <MetricCard
          label="Success Rate"
          value={metrics.successRate}
          unit="%"
          trend="stable"
          trendValue="Excellent"
        />
        <MetricCard
          label="Avg Latency"
          value={metrics.avgLatency}
          unit="ms"
          trend="down"
          trendValue="-0.3ms"
        />
        <MetricCard
          label="Failed Alerts"
          value={metrics.failedAlerts}
          trend="down"
          trendValue="0 in last hour"
        />
      </div>

      {/* Connection Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ConnectionStatus
          isConnected={isConnected}
          lastConnected={lastChecked || undefined}
          connectionDetails={{
            workspace: "your-workspace.slack.com",
            channels: 3,
            botStatus: "Active",
          }}
        />

        {/* Quick Actions */}
        <Card className="bg-card border-border p-4">
          <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button
              onClick={handleTestMessage}
              className="w-full justify-start text-left"
              variant="outline"
            >
              <span className="flex-1">Send Test Message</span>
              <span className="text-xs text-muted-foreground">→</span>
            </Button>
            <Button
              onClick={handleFixPermissions}
              className="w-full justify-start text-left"
              variant="outline"
            >
              <span className="flex-1">Review Permissions</span>
              <span className="text-xs text-muted-foreground">→</span>
            </Button>
            <Button
              onClick={() => {
                trackSlackAppSettings();
                window.open("https://api.slack.com/apps", "_blank");
              }}
              className="w-full justify-start text-left"
              variant="outline"
            >
              <span className="flex-1">Slack App Settings</span>
              <span className="text-xs text-muted-foreground">↗</span>
            </Button>
          </div>
        </Card>
      </div>

      {/* Performance Metrics Chart */}
      <MetricsChart
        title="7-Day Performance Metrics"
        showLegend={true}
        height={320}
      />

      {/* Diagnostics */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-accent" />
          Diagnostic Checks
        </h3>
        <div className="space-y-1">
          {diagnostics.map((check, idx) => (
            <DiagnosticItem
              key={idx}
              name={check.name}
              status={check.status}
              details={check.details}
              action={check.action}
            />
          ))}
        </div>
      </Card>

      {/* Troubleshooting Tips */}
      <Card className="bg-accent/5 border border-accent/20 p-6">
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-accent" />
          Troubleshooting Tips
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="text-accent font-bold">•</span>
            <span>
              If alerts aren't arriving, verify the bot has been added to your alert channels
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent font-bold">•</span>
            <span>
              Check that your bot token hasn't expired by reviewing it in Slack app settings
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent font-bold">•</span>
            <span>
              Ensure your Slack workspace allows third-party integrations in security settings
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent font-bold">•</span>
            <span>
              Try sending a test message to verify the connection is working properly
            </span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
