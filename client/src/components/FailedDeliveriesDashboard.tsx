import { useState, useEffect } from "react";
import { trackFailedDeliveriesDashboardViewed, trackManualRetryInitiated, trackRetryAllInitiated, trackDeliveryDeleted, trackAutoRetryToggled, trackDashboardFiltered, trackDashboardSearched, trackDashboardRefreshed } from "@/lib/failedDeliveriesAnalytics";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, RefreshCw, Zap, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { FailedDeliveryCard } from "@/components/FailedDeliveryCard";
import {
  type FailedDelivery,
  type FailedDeliveryFilter,
  generateMockFailedDeliveries,
  filterFailedDeliveries,
} from "@/lib/failedDeliveryTypes";

/**
 * FailedDeliveriesDashboard Component
 * 
 * Comprehensive dashboard for monitoring failed webhook deliveries:
 * - Overview statistics
 * - Filtering by status, severity, reason
 * - Search functionality
 * - Manual retry controls
 * - Automatic retry scheduling
 * 
 * Design: Professional monitoring dashboard
 */

export function FailedDeliveriesDashboard() {
  const [deliveries, setDeliveries] = useState<FailedDelivery[]>([]);
  const [filter, setFilter] = useState<FailedDeliveryFilter>({
    status: undefined,
    severity: "all",
    reason: "all",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isAutoRetryEnabled, setIsAutoRetryEnabled] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialize with mock data
  useEffect(() => {
    const mockData = generateMockFailedDeliveries(12);
    setDeliveries(mockData);
    trackFailedDeliveriesDashboardViewed();
  }, []);

  // Apply filters
  const filteredDeliveries = filterFailedDeliveries(deliveries, {
    ...filter,
    searchQuery,
  });

  // Statistics
  const stats = {
    total: deliveries.length,
    pending: deliveries.filter((d) => d.retryStatus === "pending").length,
    retrying: deliveries.filter((d) => d.retryStatus === "retrying").length,
    failed: deliveries.filter((d) => d.retryStatus === "failed").length,
    succeeded: deliveries.filter((d) => d.retryStatus === "succeeded").length,
  };

  const handleRetry = (deliveryId: string) => {
    setDeliveries((prev) =>
      prev.map((d) =>
        d.id === deliveryId
          ? {
              ...d,
              retryStatus: "retrying" as const,
              retryCount: d.retryCount + 1,
              lastAttemptTime: new Date().toISOString(),
            }
          : d
      )
    );
    trackManualRetryInitiated(1);
    toast.success("Retry initiated!");
  };

  const handleDelete = (deliveryId: string) => {
    setDeliveries((prev) => prev.filter((d) => d.id !== deliveryId));
    trackDeliveryDeleted();
    toast.success("Delivery removed");
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    trackDashboardRefreshed();
    toast.success("Dashboard refreshed");
  };

  const handleRetryAll = () => {
    const pendingCount = stats.pending;
    if (pendingCount === 0) {
      toast.info("No pending deliveries to retry");
      return;
    }

    setDeliveries((prev) =>
      prev.map((d) =>
        d.retryStatus === "pending"
          ? {
              ...d,
              retryStatus: "retrying" as const,
              retryCount: d.retryCount + 1,
              lastAttemptTime: new Date().toISOString(),
            }
          : d
      )
    );
    trackRetryAllInitiated(pendingCount);
    toast.success(`Retrying ${pendingCount} deliveries...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-accent" />
          <div>
            <h2 className="text-2xl font-bold text-foreground">Failed Deliveries</h2>
            <p className="text-sm text-muted-foreground">
              Monitor and retry failed webhook deliveries
            </p>
          </div>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Total */}
        <Card className="bg-card border-border p-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">Total</p>
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
        </Card>

        {/* Pending */}
        <Card className="bg-yellow-500/10 border-yellow-500/30 p-4">
          <p className="text-xs font-medium text-yellow-400 mb-2">Pending</p>
          <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
        </Card>

        {/* Retrying */}
        <Card className="bg-blue-500/10 border-blue-500/30 p-4">
          <p className="text-xs font-medium text-blue-400 mb-2">Retrying</p>
          <p className="text-2xl font-bold text-blue-400">{stats.retrying}</p>
        </Card>

        {/* Failed */}
        <Card className="bg-red-500/10 border-red-500/30 p-4">
          <p className="text-xs font-medium text-red-400 mb-2">Failed</p>
          <p className="text-2xl font-bold text-red-400">{stats.failed}</p>
        </Card>

        {/* Succeeded */}
        <Card className="bg-green-500/10 border-green-500/30 p-4">
          <p className="text-xs font-medium text-green-400 mb-2">Succeeded</p>
          <p className="text-2xl font-bold text-green-400">{stats.succeeded}</p>
        </Card>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by alert title, URL, or error..."
          className="bg-background border-border"
        />

        {/* Status Filter */}
        <select
          value={filter.status || "all"}
          onChange={(e) =>
            setFilter({
              ...filter,
              status: e.target.value === "all" ? undefined : (e.target.value as any),
            })
          }
          className="px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="retrying">Retrying</option>
          <option value="succeeded">Succeeded</option>
          <option value="failed">Failed</option>
          <option value="abandoned">Abandoned</option>
        </select>

        {/* Severity Filter */}
        <select
          value={filter.severity || "all"}
          onChange={(e) =>
            setFilter({
              ...filter,
              severity: e.target.value as any,
            })
          }
          className="px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="all">All Severities</option>
          <option value="critical">Critical</option>
          <option value="warning">Warning</option>
          <option value="info">Info</option>
        </select>
      </div>

      {/* Auto-Retry Toggle */}
      <Card className="bg-card border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground mb-1">Automatic Retry</h3>
            <p className="text-sm text-muted-foreground">
              {isAutoRetryEnabled
                ? "Enabled - Failed deliveries will be retried automatically with exponential backoff"
                : "Disabled - Manual retry only"}
            </p>
          </div>
        <Button
          onClick={() => {
            setIsAutoRetryEnabled(!isAutoRetryEnabled);
            trackAutoRetryToggled(!isAutoRetryEnabled);
          }}
          variant={isAutoRetryEnabled ? "default" : "outline"}
          className="w-24"
        >
          {isAutoRetryEnabled ? "Enabled" : "Disabled"}
        </Button>
        </div>
      </Card>

      {/* Retry All Button */}
      {stats.pending > 0 && (
        <Button
          onClick={handleRetryAll}
          className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground hover:opacity-90"
        >
          <Zap className="w-5 h-5" />
          Retry All Pending ({stats.pending})
        </Button>
      )}

      {/* Deliveries List */}
      <div className="space-y-4">
        {filteredDeliveries.length > 0 ? (
          filteredDeliveries.map((delivery) => (
            <FailedDeliveryCard
              key={delivery.id}
              delivery={delivery}
              onRetry={handleRetry}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <Card className="bg-card border-border p-12 text-center">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No Failed Deliveries
            </h3>
            <p className="text-muted-foreground">
              {searchQuery || filter.status
                ? "No deliveries match your filters"
                : "All webhook deliveries are succeeding! Great job."}
            </p>
          </Card>
        )}
      </div>

      {/* Info Card */}
      <Card className="bg-accent/5 border border-accent/20 p-6">
        <h3 className="font-semibold text-foreground mb-3">💡 Retry Strategy</h3>
        <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
          <li>Failed deliveries are automatically retried with exponential backoff</li>
          <li>Maximum of 5 retry attempts per delivery</li>
          <li>Initial retry delay: 5 seconds, doubling with each attempt</li>
          <li>Maximum retry delay: 1 hour</li>
          <li>Manual retries bypass the automatic retry schedule</li>
          <li>Deliveries are abandoned after max retries are exhausted</li>
        </ul>
      </Card>
    </div>
  );
}
