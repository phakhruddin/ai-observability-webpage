import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trackIntegrationConnect, trackRecommendationClick } from "@/lib/dashboardAnalytics";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  AlertCircle,
  Zap,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Database,
  Slack,
  Cloud,
  GitBranch,
} from "lucide-react";

/**
 * Trial Dashboard Component
 * 
 * Displays key metrics during the free trial period:
 * - Log volume ingested
 * - Alerts triggered and reduced
 * - Integration status
 * - Trial progress
 * - Estimated value/savings
 * 
 * Design: Professional metrics dashboard with teal accents
 */

interface DashboardMetrics {
  logsIngested: number;
  alertsTriggered: number;
  alertsReduced: number;
  avgResponseTime: number;
  integrationsConnected: number;
  trialDaysRemaining: number;
  estimatedSavings: number;
}

interface IntegrationStatus {
  name: string;
  icon: React.ReactNode;
  status: "connected" | "pending" | "available";
  lastSync?: string;
}

const logVolumeData = [
  { day: "Day 1", logs: 2400, alerts: 240 },
  { day: "Day 2", logs: 3210, alerts: 221 },
  { day: "Day 3", logs: 2290, alerts: 229 },
  { day: "Day 4", logs: 2000, alerts: 200 },
  { day: "Day 5", logs: 2181, alerts: 220 },
  { day: "Day 6", logs: 2500, alerts: 250 },
  { day: "Day 7", logs: 2100, alerts: 210 },
];

const alertReductionData = [
  { name: "Noise", value: 65, fill: "#ef4444" },
  { name: "Critical", value: 25, fill: "#06b6d4" },
  { name: "Warning", value: 10, fill: "#f59e0b" },
];

const integrations: IntegrationStatus[] = [
  { name: "CloudWatch", icon: <Cloud className="w-5 h-5" />, status: "connected", lastSync: "2 min ago" },
  { name: "Slack", icon: <Slack className="w-5 h-5" />, status: "connected", lastSync: "1 min ago" },
  { name: "Kubernetes", icon: <GitBranch className="w-5 h-5" />, status: "pending" },
  { name: "Database", icon: <Database className="w-5 h-5" />, status: "available" },
];

export function TrialDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    logsIngested: 15240,
    alertsTriggered: 1240,
    alertsReduced: 806,
    avgResponseTime: 4.2,
    integrationsConnected: 2,
    trialDaysRemaining: 9,
    estimatedSavings: 2400,
  });

  // Simulate real-time metric updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        logsIngested: prev.logsIngested + Math.floor(Math.random() * 500),
        alertsTriggered: prev.alertsTriggered + Math.floor(Math.random() * 20),
        alertsReduced: prev.alertsReduced + Math.floor(Math.random() * 15),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const alertReductionPercentage = Math.round(
    (metrics.alertsReduced / metrics.alertsTriggered) * 100
  );

  const trialProgressPercentage = Math.round(((14 - metrics.trialDaysRemaining) / 14) * 100);

  return (
    <div className="space-y-8">
      {/* Trial Progress */}
      <Card className="bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Trial Progress</h3>
            <p className="text-sm text-muted-foreground">
              {metrics.trialDaysRemaining} days remaining in your free trial
            </p>
          </div>
          <Badge className="bg-accent text-accent-foreground">{trialProgressPercentage}%</Badge>
        </div>
        <Progress value={trialProgressPercentage} className="h-2" />
        <div className="flex justify-between mt-4 text-xs text-muted-foreground">
          <span>Started</span>
          <span>Day {14 - metrics.trialDaysRemaining} of 14</span>
        </div>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Logs Ingested */}
        <Card className="bg-card border-border p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Logs Ingested</p>
              <p className="text-3xl font-bold text-foreground">
                {(metrics.logsIngested / 1000).toFixed(1)}K
              </p>
            </div>
            <Database className="w-8 h-8 text-accent opacity-20" />
          </div>
          <p className="text-xs text-muted-foreground">+{Math.floor(Math.random() * 500)} today</p>
        </Card>

        {/* Alerts Triggered */}
        <Card className="bg-card border-border p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Alerts Triggered</p>
              <p className="text-3xl font-bold text-foreground">{metrics.alertsTriggered}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-accent opacity-20" />
          </div>
          <p className="text-xs text-muted-foreground">+{Math.floor(Math.random() * 20)} today</p>
        </Card>

        {/* Alerts Reduced */}
        <Card className="bg-card border-border p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Noise Eliminated</p>
              <p className="text-3xl font-bold text-accent">{metrics.alertsReduced}</p>
            </div>
            <Zap className="w-8 h-8 text-accent opacity-20" />
          </div>
          <p className="text-xs text-muted-foreground">{alertReductionPercentage}% of alerts</p>
        </Card>

        {/* Avg Response Time */}
        <Card className="bg-card border-border p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Avg Response Time</p>
              <p className="text-3xl font-bold text-foreground">{metrics.avgResponseTime}m</p>
            </div>
            <Clock className="w-8 h-8 text-accent opacity-20" />
          </div>
          <p className="text-xs text-muted-foreground">↓ 65% vs industry avg</p>
        </Card>
      </div>

      {/* Estimated Value */}
      <Card className="bg-gradient-to-r from-green-500/10 to-green-500/5 border-green-500/20 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Estimated Monthly Savings</h3>
            <p className="text-sm text-muted-foreground">
              Based on your current usage and alert reduction
            </p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-green-500">${metrics.estimatedSavings}</p>
            <p className="text-xs text-muted-foreground mt-1">vs manual monitoring</p>
          </div>
        </div>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Log Volume Trend */}
        <Card className="bg-card border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Log Volume Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={logVolumeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "1px solid rgba(6,182,212,0.5)",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="logs"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={{ fill: "#06b6d4", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Alert Distribution */}
        <Card className="bg-card border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Alert Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={alertReductionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {alertReductionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Integration Status */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Connected Integrations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {integrations.map((integration, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg border border-border/50 bg-background/50 hover:border-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-accent">{integration.icon}</div>
                {integration.status === "connected" && (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                )}
                {integration.status === "pending" && (
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                )}
                {integration.status === "available" && (
                  <AlertCircle className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <h4 className="font-semibold text-foreground mb-1">{integration.name}</h4>
              {integration.status === "connected" && (
                <p className="text-xs text-green-500">Connected • {integration.lastSync}</p>
              )}
              {integration.status === "pending" && (
                <p className="text-xs text-yellow-500">Setup in progress</p>
              )}
              {integration.status === "available" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full mt-2 text-xs h-8"
                  onClick={() => trackIntegrationConnect(integration.name)}
                >
                  Connect
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-accent" />
          Recommendations
        </h3>
        <div className="space-y-3">
          <div
            className="p-4 rounded-lg bg-accent/10 border border-accent/20 cursor-pointer hover:border-accent/40 transition-colors"
            onClick={() => trackRecommendationClick("Connect Kubernetes Logs")}
          >
            <p className="text-sm font-medium text-foreground mb-1">Connect Kubernetes Logs</p>
            <p className="text-xs text-muted-foreground">
              You're missing insights from your Kubernetes cluster. Connecting will increase alert accuracy by ~20%.
            </p>
          </div>
          <div
            className="p-4 rounded-lg bg-accent/10 border border-accent/20 cursor-pointer hover:border-accent/40 transition-colors"
            onClick={() => trackRecommendationClick("Enable Slack Notifications")}
          >
            <p className="text-sm font-medium text-foreground mb-1">Enable Slack Notifications</p>
            <p className="text-xs text-muted-foreground">
              Get critical alerts delivered directly to your team's Slack channel for faster response times.
            </p>
          </div>
          <div
            className="p-4 rounded-lg bg-accent/10 border border-accent/20 cursor-pointer hover:border-accent/40 transition-colors"
            onClick={() => trackRecommendationClick("Create Custom Dashboards")}
          >
            <p className="text-sm font-medium text-foreground mb-1">Create Custom Dashboards</p>
            <p className="text-xs text-muted-foreground">
              Build team-specific dashboards to monitor metrics that matter most to your operations.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
