import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, Copy, Eye } from "lucide-react";
import { toast } from "sonner";
import {
  getStatusBadgeClass,
  getStatusLabel,
  getSeverityColor,
  formatResponseTime,
  formatTimestamp,
  type WebhookDeliveryLog,
} from "@/lib/webhookLogTypes";
import {
  trackLogExpanded,
  trackPayloadCopied,
} from "@/lib/webhookLogsAnalytics";

/**
 * WebhookLogTable Component
 * 
 * Displays webhook delivery logs in a table format with:
 * - Status indicators
 * - Response times
 * - Retry information
 * - Expandable details
 * 
 * Design: Professional monitoring table with dark theme
 */

interface WebhookLogTableProps {
  logs: WebhookDeliveryLog[];
  isLoading?: boolean;
}

export function WebhookLogTable({ logs, isLoading = false }: WebhookLogTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleCopyPayload = (payload: Record<string, any>, type: "request" | "response" = "request") => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    trackPayloadCopied(type);
    toast.success("Payload copied to clipboard!");
  };

  if (isLoading) {
    return (
      <Card className="bg-card border-border p-6">
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-background rounded animate-pulse" />
          ))}
        </div>
      </Card>
    );
  }

  if (logs.length === 0) {
    return (
      <Card className="bg-card border-border p-12 text-center">
        <p className="text-muted-foreground">No webhook deliveries found</p>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {logs.map((log) => (
        <div key={log.id}>
          <button
            onClick={() => {
              if (expandedId !== log.id) {
                trackLogExpanded(log.status);
              }
              setExpandedId(expandedId === log.id ? null : log.id);
            }}
            className="w-full text-left"
          >
            <Card className="bg-card border-border hover:border-accent/50 transition-colors cursor-pointer p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Status Badge */}
                  <div className={`px-2 py-1 rounded text-xs font-semibold border whitespace-nowrap ${getStatusBadgeClass(log.status)}`}>
                    {getStatusLabel(log.status)}
                  </div>

                  {/* Alert Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{log.alertTitle}</p>
                    <p className="text-xs text-muted-foreground truncate">{log.webhookUrl}</p>
                  </div>

                  {/* Severity */}
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getSeverityColor(log.severity) }}
                    />
                    <span className="text-xs font-medium text-muted-foreground capitalize">{log.severity}</span>
                  </div>

                  {/* Response Time */}
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{formatResponseTime(log.responseTime)}</p>
                    {log.statusCode && (
                      <p className={`text-xs ${log.statusCode >= 200 && log.statusCode < 300 ? "text-green-400" : "text-red-400"}`}>
                        {log.statusCode}
                      </p>
                    )}
                  </div>

                  {/* Timestamp */}
                  <div className="text-right whitespace-nowrap">
                    <p className="text-sm text-muted-foreground">{formatTimestamp(log.timestamp)}</p>
                  </div>

                  {/* Expand Icon */}
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition-transform ${expandedId === log.id ? "rotate-180" : ""}`}
                  />
                </div>
              </div>
            </Card>
          </button>

          {/* Expanded Details */}
          {expandedId === log.id && (
            <Card className="bg-background border-border border-t-0 rounded-t-none p-6 space-y-6">
              {/* Retry Information */}
              {log.retryCount > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Retry Attempts</p>
                    <p className="text-lg font-semibold text-foreground">
                      {log.retryCount} / {log.maxRetries}
                    </p>
                  </div>
                  {log.nextRetryAt && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Next Retry</p>
                      <p className="text-lg font-semibold text-foreground">{formatTimestamp(log.nextRetryAt)}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Error Message */}
              {log.errorMessage && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="text-xs text-red-400 font-semibold mb-1">Error</p>
                  <p className="text-sm text-red-300">{log.errorMessage}</p>
                </div>
              )}

              {/* Request Payload */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-foreground">Request Payload</p>
                  <Button
                    onClick={() => handleCopyPayload(log.requestPayload, "request")}
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <div className="bg-background rounded-lg p-4 overflow-x-auto border border-border">
                  <pre className="text-xs text-muted-foreground font-mono">
                    {JSON.stringify(log.requestPayload, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Response Payload */}
              {log.responsePayload && (
                <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-foreground">Response Payload</p>
                  <Button
                    onClick={() => handleCopyPayload(log.responsePayload!, "response")}
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                </div>
                  <div className="bg-background rounded-lg p-4 overflow-x-auto border border-border">
                    <pre className="text-xs text-muted-foreground font-mono">
                      {JSON.stringify(log.responsePayload, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Delivery ID</p>
                  <p className="text-xs font-mono text-foreground truncate">{log.id}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Alert ID</p>
                  <p className="text-xs font-mono text-foreground truncate">{log.alertId}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Webhook ID</p>
                  <p className="text-xs font-mono text-foreground truncate">{log.webhookId}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Timestamp</p>
                  <p className="text-xs text-foreground">{new Date(log.timestamp).toLocaleString()}</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      ))}
    </div>
  );
}
