import { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Activity, Search, Filter, Download } from "lucide-react";
import { WebhookLogTable } from "@/components/WebhookLogTable";
import { StreamStatusIndicator } from "@/components/StreamStatusIndicator";
import { useWebhookStream } from "@/hooks/useWebhookStream";
import {
  generateMockDeliveryLogs,
  filterDeliveryLogs,
  type WebhookDeliveryLog,
  type DeliveryStatus,
  type WebhookLogFilter,
} from "@/lib/webhookLogTypes";
import {
  trackWebhookLogsViewed,
  trackFilterApplied,
  trackSearchPerformed,
  trackLogsExported,
} from "@/lib/webhookLogsAnalytics";

/**
 * WebhookLogs Page
 * 
 * Displays webhook delivery logs with:
 * - Real-time delivery status
 * - Response times and status codes
 * - Retry information
 * - Filtering and search
 * - Detailed log inspection
 * 
 * Design: Professional monitoring page with dark theme
 */

export default function WebhookLogs() {
  const [logs] = useState<WebhookDeliveryLog[]>(generateMockDeliveryLogs(50));
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<DeliveryStatus | "all">("all");
  const [severityFilter, setSeverityFilter] = useState<"all" | "critical" | "warning" | "info">("all");

  // Real-time streaming hook
  const { connectionState, newLogs, isPaused, logCount, lastUpdate, pause, resume, clearNewLogs } = useWebhookStream();

  useEffect(() => {
    trackWebhookLogsViewed();
  }, []);

  // Merge new logs with existing logs
  const allLogs = useMemo(() => {
    return [...newLogs, ...logs];
  }, [newLogs, logs]);

  const filteredLogs = useMemo(() => {
    const filter: WebhookLogFilter = {
      status: statusFilter === "all" ? undefined : statusFilter,
      severity: severityFilter === "all" ? undefined : (severityFilter as any),
      searchQuery: searchQuery || undefined,
    };
    return filterDeliveryLogs(allLogs, filter);
  }, [allLogs, searchQuery, statusFilter, severityFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = allLogs.length;
    const successful = allLogs.filter((l) => l.status === "success").length;
    const failed = allLogs.filter((l) => l.status === "failed").length;
    const retrying = allLogs.filter((l) => l.status === "retrying").length;
    const avgResponseTime = Math.round(allLogs.reduce((sum, l) => sum + l.responseTime, 0) / total);

    return {
      total,
      successful,
      failed,
      retrying,
      successRate: total > 0 ? Math.round((successful / total) * 100) : 0,
      avgResponseTime,
    };
  }, [allLogs]);

  const handleExportLogs = () => {
    const csv = [
      ["Timestamp", "Alert", "Webhook URL", "Status", "Response Time", "Status Code", "Retries"].join(","),
      ...filteredLogs.map((log) =>
        [
          log.timestamp,
          log.alertTitle,
          log.webhookUrl,
          log.status,
          log.responseTime,
          log.statusCode || "N/A",
          log.retryCount,
        ].join(",")
      ),
    ].join("\n");

    trackLogsExported(filteredLogs.length);

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `webhook-logs-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-b from-accent/10 to-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-accent/20">
              <Activity className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Webhook Delivery Logs</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Monitor webhook delivery status, response times, and retry attempts. 
            Inspect detailed logs to debug integration issues.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        {/* Real-time Stream Status */}
        <StreamStatusIndicator
          connectionState={connectionState}
          newLogCount={logCount}
          isPaused={isPaused}
          lastUpdate={lastUpdate}
          onPause={pause}
          onResume={resume}
          onClear={clearNewLogs}
        />
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-card border-border p-6">
            <p className="text-sm text-muted-foreground mb-2">Total Deliveries</p>
            <p className="text-3xl font-bold text-foreground">{stats.total}</p>
          </Card>
          <Card className="bg-card border-border p-6">
            <p className="text-sm text-muted-foreground mb-2">Success Rate</p>
            <p className="text-3xl font-bold text-green-400">{stats.successRate}%</p>
          </Card>
          <Card className="bg-card border-border p-6">
            <p className="text-sm text-muted-foreground mb-2">Failed</p>
            <p className="text-3xl font-bold text-red-400">{stats.failed}</p>
          </Card>
          <Card className="bg-card border-border p-6">
            <p className="text-sm text-muted-foreground mb-2">Retrying</p>
            <p className="text-3xl font-bold text-blue-400">{stats.retrying}</p>
          </Card>
          <Card className="bg-card border-border p-6">
            <p className="text-sm text-muted-foreground mb-2">Avg Response Time</p>
            <p className="text-3xl font-bold text-accent">{stats.avgResponseTime}ms</p>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-card border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-foreground">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Alert title or URL..."
                value={searchQuery}
                onChange={(e) => {
                  const query = e.target.value;
                  setSearchQuery(query);
                  if (query) trackSearchPerformed(query);
                }}
                className="pl-10"
              />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  const value = e.target.value as any;
                  setStatusFilter(value);
                  if (value !== "all") trackFilterApplied("status", value);
                }}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="success">Delivered</option>
                <option value="failed">Failed</option>
                <option value="retrying">Retrying</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {/* Severity Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Severity</label>
              <select
                value={severityFilter}
                onChange={(e) => {
                  const value = e.target.value as any;
                  setSeverityFilter(value);
                  if (value !== "all") trackFilterApplied("severity", value);
                }}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="warning">Warning</option>
                <option value="info">Info</option>
              </select>
            </div>

            {/* Export */}
            <div className="flex items-end">
              <Button
                onClick={handleExportLogs}
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredLogs.length}</span> of{" "}
              <span className="font-semibold text-foreground">{logs.length}</span> deliveries
            </p>
          </div>
        </Card>

        {/* Logs Table */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Deliveries</h2>
            {logCount > 0 && (
              <div className="text-sm text-accent font-medium">
                {logCount} new {logCount === 1 ? "delivery" : "deliveries"}
              </div>
            )}
          </div>
          <WebhookLogTable logs={filteredLogs} />
        </div>

        {/* Info Card */}
        <Card className="bg-accent/5 border border-accent/20 p-6">
          <h3 className="font-semibold text-foreground mb-2">💡 Debugging Tips</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Real-time streaming automatically displays new webhook deliveries</li>
            <li>• Pause streaming to review logs without new entries appearing</li>
            <li>• Click on any delivery to view detailed request/response payloads</li>
            <li>• Failed deliveries show error messages to help identify issues</li>
            <li>• Retrying deliveries will automatically attempt delivery up to 5 times</li>
            <li>• Use the search and filters to find specific alerts or webhooks</li>
            <li>• Export logs as CSV for further analysis or record-keeping</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
