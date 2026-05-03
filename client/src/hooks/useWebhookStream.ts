import { useEffect, useRef, useState, useCallback } from "react";
import { type WebhookDeliveryLog } from "@/lib/webhookLogTypes";
import {
  trackStreamingConnected,
  trackStreamingDisconnected,
  trackStreamingPaused,
  trackStreamingResumed,
  trackStreamingError,
  trackNewLogsReceived,
  trackStreamingCleared,
} from "@/lib/streamingAnalytics";

/**
 * WebSocket Connection States
 */
export type StreamConnectionState = "connecting" | "connected" | "disconnected" | "error";

/**
 * WebSocket Message Types
 */
interface WebhookStreamMessage {
  type: "delivery" | "heartbeat" | "error";
  data?: WebhookDeliveryLog;
  error?: string;
  timestamp?: string;
}

/**
 * useWebhookStream Hook
 * 
 * Manages WebSocket connection for real-time webhook delivery streaming
 * - Auto-reconnect with exponential backoff
 * - Heartbeat monitoring
 * - Error handling and recovery
 * - Pause/resume functionality
 */

export function useWebhookStream() {
  const [connectionState, setConnectionState] = useState<StreamConnectionState>("disconnected");
  const [newLogs, setNewLogs] = useState<WebhookDeliveryLog[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [logCount, setLogCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const heartbeatTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxReconnectAttemptsRef = useRef(5);
  const reconnectDelayRef = useRef(1000);

  /**
   * Connect to WebSocket stream
   */
  const connect = useCallback(() => {
    // Prevent multiple connections
    if (wsRef.current?.readyState === WebSocket.OPEN || connectionState === "connecting") {
      return;
    }

    setConnectionState("connecting");

    try {
      // In production, this would connect to your actual WebSocket server
      // For now, we'll simulate the connection
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/api/webhook-stream`;

      // Simulate WebSocket connection (in production, use actual WebSocket)
      // const ws = new WebSocket(wsUrl);
      
      // For demonstration, we'll use a simulated connection
      simulateWebSocketConnection();
    } catch (error) {
      console.error("WebSocket connection error:", error);
      setConnectionState("error");
      scheduleReconnect();
    }
  }, [connectionState]);

  /**
   * Simulate WebSocket connection with mock data
   */
  const simulateWebSocketConnection = () => {
    setConnectionState("connected");
    reconnectAttemptsRef.current = 0;
    trackStreamingConnected();

    // Simulate receiving new logs every 3-5 seconds
    const simulationInterval = setInterval(() => {
      if (!isPaused) {
        // Generate a mock delivery log
        const mockLog: WebhookDeliveryLog = {
          id: `delivery-${Date.now()}`,
          webhookId: `webhook-${Math.floor(Math.random() * 3) + 1}`,
          webhookUrl: `https://api.example.com/webhooks/alerts-${Math.floor(Math.random() * 3) + 1}`,
          alertId: `alert-${Date.now()}`,
          alertTitle: [
            "High CPU Usage Detected",
            "Memory Threshold Exceeded",
            "Database Connection Failed",
            "API Response Time Degraded",
            "Disk Space Low",
          ][Math.floor(Math.random() * 5)],
          severity: ["critical", "warning", "info"][Math.floor(Math.random() * 3)] as any,
          timestamp: new Date().toISOString(),
          status: Math.random() > 0.1 ? "success" : "failed",
          statusCode: Math.random() > 0.1 ? 200 : 500,
          responseTime: Math.floor(Math.random() * 5000) + 100,
          retryCount: 0,
          maxRetries: 5,
          requestPayload: {
            id: `alert-${Date.now()}`,
            severity: "warning",
            timestamp: new Date().toISOString(),
          },
          responsePayload: Math.random() > 0.1 ? { status: "received" } : undefined,
        };

        setNewLogs((prev) => [mockLog, ...prev]);
        setLogCount((prev) => prev + 1);
        setLastUpdate(new Date());
        trackNewLogsReceived(1);
      }
    }, 3000 + Math.random() * 2000);

    // Store interval ID for cleanup
    wsRef.current = { readyState: WebSocket.OPEN } as any;
    (wsRef.current as any).simulationInterval = simulationInterval;

    // Setup heartbeat
    setupHeartbeat();
  };

  /**
   * Setup heartbeat monitoring
   */
  const setupHeartbeat = () => {
    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current);
    }

    heartbeatTimeoutRef.current = setTimeout(() => {
      // Heartbeat timeout - attempt reconnection
      trackStreamingError("heartbeat_timeout");
      disconnect();
      scheduleReconnect();
    }, 30000); // 30 second timeout
  };

  /**
   * Schedule reconnection with exponential backoff
   */
  const scheduleReconnect = () => {
    if (reconnectAttemptsRef.current >= maxReconnectAttemptsRef.current) {
      setConnectionState("error");
      return;
    }

    reconnectAttemptsRef.current += 1;
    const delay = Math.min(reconnectDelayRef.current * Math.pow(2, reconnectAttemptsRef.current - 1), 30000);

    setTimeout(() => {
      connect();
    }, delay);
  };

  /**
   * Disconnect from WebSocket
   */
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      if ((wsRef.current as any).simulationInterval) {
        clearInterval((wsRef.current as any).simulationInterval);
      }
      wsRef.current = null;
    }

    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current);
    }

    trackStreamingDisconnected();
    setConnectionState("disconnected");
  }, []);

  /**
   * Pause log streaming
   */
  const pause = useCallback(() => {
    trackStreamingPaused();
    setIsPaused(true);
  }, []);

  /**
   * Resume log streaming
   */
  const resume = useCallback(() => {
    trackStreamingResumed();
    setIsPaused(false);
  }, []);

  /**
   * Clear new logs
   */
  const clearNewLogs = useCallback(() => {
    trackStreamingCleared(logCount);
    setNewLogs([]);
    setLogCount(0);
  }, [logCount]);

  /**
   * Auto-connect on mount
   */
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    connectionState,
    newLogs,
    isPaused,
    logCount,
    lastUpdate,
    connect,
    disconnect,
    pause,
    resume,
    clearNewLogs,
  };
}
