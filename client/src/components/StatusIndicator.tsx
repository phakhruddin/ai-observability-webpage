import { AlertCircle, CheckCircle, Clock, Zap } from "lucide-react";

/**
 * Status Indicator Components
 * 
 * Reusable components for displaying:
 * - Connection health status
 * - Metric values with trends
 * - Alert badges
 * - Status badges
 * 
 * Design: Dark theme with color-coded status indicators
 */

export type HealthStatus = "healthy" | "warning" | "error" | "unknown";

interface StatusBadgeProps {
  status: HealthStatus;
  label: string;
  message?: string;
}

export function StatusBadge({ status, label, message }: StatusBadgeProps) {
  const statusConfig = {
    healthy: {
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
      textColor: "text-green-400",
      icon: CheckCircle,
    },
    warning: {
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30",
      textColor: "text-yellow-400",
      icon: Clock,
    },
    error: {
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
      textColor: "text-red-400",
      icon: AlertCircle,
    },
    unknown: {
      bgColor: "bg-gray-500/10",
      borderColor: "border-gray-500/30",
      textColor: "text-gray-400",
      icon: AlertCircle,
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`${config.bgColor} border ${config.borderColor} rounded-lg p-3 flex items-start gap-3`}>
      <Icon className={`w-5 h-5 ${config.textColor} flex-shrink-0 mt-0.5`} />
      <div className="flex-1">
        <p className={`font-semibold ${config.textColor}`}>{label}</p>
        {message && <p className="text-sm text-muted-foreground mt-1">{message}</p>}
      </div>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  icon?: React.ReactNode;
}

export function MetricCard({ label, value, unit, trend, trendValue, icon }: MetricCardProps) {
  const trendConfig = {
    up: "text-green-400",
    down: "text-red-400",
    stable: "text-gray-400",
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm text-muted-foreground">{label}</p>
        {icon && <div className="text-accent">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
      {trend && trendValue && (
        <p className={`text-xs mt-2 ${trendConfig[trend]}`}>
          {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
        </p>
      )}
    </div>
  );
}

interface HealthIndicatorProps {
  status: HealthStatus;
  size?: "sm" | "md" | "lg";
}

export function HealthIndicator({ status, size = "md" }: HealthIndicatorProps) {
  const sizeConfig = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const statusConfig = {
    healthy: "bg-green-500 animate-pulse",
    warning: "bg-yellow-500 animate-pulse",
    error: "bg-red-500 animate-pulse",
    unknown: "bg-gray-500",
  };

  return (
    <div className={`${sizeConfig[size]} ${statusConfig[status]} rounded-full`} />
  );
}

interface ConnectionStatusProps {
  isConnected: boolean;
  lastConnected?: string;
  connectionDetails?: {
    workspace?: string;
    channels?: number;
    botStatus?: string;
  };
}

export function ConnectionStatus({ isConnected, lastConnected, connectionDetails }: ConnectionStatusProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center gap-3 mb-4">
        <HealthIndicator status={isConnected ? "healthy" : "error"} size="lg" />
        <div>
          <p className="font-semibold text-foreground">
            {isConnected ? "Connected" : "Disconnected"}
          </p>
          {lastConnected && (
            <p className="text-xs text-muted-foreground">
              Last connected: {lastConnected}
            </p>
          )}
        </div>
      </div>

      {connectionDetails && (
        <div className="space-y-2 text-sm">
          {connectionDetails.workspace && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Workspace:</span>
              <span className="text-foreground font-mono">{connectionDetails.workspace}</span>
            </div>
          )}
          {connectionDetails.channels !== undefined && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Channels:</span>
              <span className="text-foreground">{connectionDetails.channels}</span>
            </div>
          )}
          {connectionDetails.botStatus && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bot Status:</span>
              <span className="text-foreground font-mono">{connectionDetails.botStatus}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface DiagnosticItemProps {
  name: string;
  status: HealthStatus;
  details?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function DiagnosticItem({ name, status, details, action }: DiagnosticItemProps) {
  const statusConfig = {
    healthy: { color: "text-green-400", label: "Pass" },
    warning: { color: "text-yellow-400", label: "Warning" },
    error: { color: "text-red-400", label: "Failed" },
    unknown: { color: "text-gray-400", label: "Unknown" },
  };

  const config = statusConfig[status];

  return (
    <div className="border-b border-border last:border-b-0 py-3 last:py-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="font-medium text-foreground">{name}</p>
          {details && <p className="text-xs text-muted-foreground mt-1">{details}</p>}
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-semibold ${config.color}`}>{config.label}</span>
          {action && (
            <button
              onClick={action.onClick}
              className="text-xs px-2 py-1 rounded bg-accent/10 hover:bg-accent/20 text-accent transition-colors"
            >
              {action.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
