import { FailedDeliveriesDashboard } from "@/components/FailedDeliveriesDashboard";

/**
 * FailedDeliveries Page
 * 
 * Displays the failed webhook deliveries dashboard
 * 
 * Design: Professional monitoring page with dark theme
 */

export default function FailedDeliveries() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-b from-accent/10 to-background border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Failed Webhook Deliveries
          </h1>
          <p className="text-lg text-muted-foreground">
            Monitor, troubleshoot, and retry failed webhook deliveries with automatic retry scheduling
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <FailedDeliveriesDashboard />
      </div>
    </div>
  );
}
