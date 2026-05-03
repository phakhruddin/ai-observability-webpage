import { Activity, Pause, Play, Trash2, AlertCircle, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { type StreamConnectionState } from "@/hooks/useWebhookStream";

/**
 * StreamStatusIndicator Component
 * 
 * Displays real-time streaming status and controls:
 * - Connection state (connected, connecting, disconnected, error)
 * - New log count badge
 * - Pause/resume controls
 * - Clear logs button
 * - Last update timestamp
 * 
 * Design: Professional status indicator with animations
 */

interface StreamStatusIndicatorProps {
  connectionState: StreamConnectionState;
  newLogCount: number;
  isPaused: boolean;
  lastUpdate: Date | null;
  onPause: () => void;
  onResume: () => void;
  onClear: () => void;
}

export function StreamStatusIndicator({
  connectionState,
  newLogCount,
  isPaused,
  lastUpdate,
  onPause,
  onResume,
  onClear,
}: StreamStatusIndicatorProps) {
  const getStatusColor = (state: StreamConnectionState) => {
    switch (state) {
      case "connected":
        return "text-green-400";
      case "connecting":
        return "text-amber-400";
      case "disconnected":
        return "text-gray-400";
      case "error":
        return "text-red-400";
    }
  };

  const getStatusLabel = (state: StreamConnectionState) => {
    switch (state) {
      case "connected":
        return "Live";
      case "connecting":
        return "Connecting...";
      case "disconnected":
        return "Disconnected";
      case "error":
        return "Error";
    }
  };

  const getStatusBgClass = (state: StreamConnectionState) => {
    switch (state) {
      case "connected":
        return "bg-green-500/10 border-green-500/30";
      case "connecting":
        return "bg-amber-500/10 border-amber-500/30";
      case "disconnected":
        return "bg-gray-500/10 border-gray-500/30";
      case "error":
        return "bg-red-500/10 border-red-500/30";
    }
  };

  return (
    <Card className={`border p-4 ${getStatusBgClass(connectionState)}`}>
      <div className="flex items-center justify-between gap-4">
        {/* Status Info */}
        <div className="flex items-center gap-3 flex-1">
          {/* Connection Icon */}
          <div className="flex items-center gap-2">
            {connectionState === "connected" ? (
              <div className="flex items-center gap-2">
                <Wifi className={`w-5 h-5 ${getStatusColor(connectionState)} animate-pulse`} />
                <Activity className={`w-5 h-5 ${getStatusColor(connectionState)}`} />
              </div>
            ) : (
              <WifiOff className={`w-5 h-5 ${getStatusColor(connectionState)}`} />
            )}
          </div>

          {/* Status Text */}
          <div className="flex-1">
            <p className={`text-sm font-semibold ${getStatusColor(connectionState)}`}>
              {getStatusLabel(connectionState)}
            </p>
            {lastUpdate && (
              <p className="text-xs text-muted-foreground">
                Last update: {lastUpdate.toLocaleTimeString()}
              </p>
            )}
          </div>

          {/* New Logs Badge */}
          {newLogCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30">
              <span className="text-sm font-semibold text-accent">{newLogCount}</span>
              <span className="text-xs text-accent/80">new</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Pause/Resume */}
          {connectionState === "connected" && (
            <Button
              onClick={isPaused ? onResume : onPause}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              title={isPaused ? "Resume streaming" : "Pause streaming"}
            >
              {isPaused ? (
                <>
                  <Play className="w-4 h-4" />
                  <span className="hidden sm:inline text-xs">Resume</span>
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4" />
                  <span className="hidden sm:inline text-xs">Pause</span>
                </>
              )}
            </Button>
          )}

          {/* Clear Logs */}
          {newLogCount > 0 && (
            <Button
              onClick={onClear}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              title="Clear new logs"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">Clear</span>
            </Button>
          )}

          {/* Error Icon */}
          {connectionState === "error" && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/30">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-xs text-red-400">Reconnecting...</span>
            </div>
          )}
        </div>
      </div>

      {/* Info Message */}
      {connectionState === "connected" && !isPaused && (
        <div className="mt-3 pt-3 border-t border-accent/20">
          <p className="text-xs text-muted-foreground">
            ✓ Real-time streaming active. New deliveries appear automatically.
          </p>
        </div>
      )}

      {isPaused && (
        <div className="mt-3 pt-3 border-t border-amber-500/20">
          <p className="text-xs text-amber-400">
            ⏸ Streaming paused. New deliveries are not being displayed.
          </p>
        </div>
      )}
    </Card>
  );
}
