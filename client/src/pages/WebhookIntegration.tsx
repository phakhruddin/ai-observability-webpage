import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Webhook } from "lucide-react";
import { WebhookIntegrationGuide } from "@/components/WebhookIntegrationGuide";
import { WebhookConfig } from "@/components/WebhookConfig";
import { WebhookSecuritySettings } from "@/components/WebhookSecuritySettings";
import { SignatureVerificationTester } from "@/components/SignatureVerificationTester";
import { WebhookEndpointTester } from "@/components/WebhookEndpointTester";
import { type WebhookConfig as WebhookConfigType } from "@/lib/webhookTypes";

/**
 * WebhookIntegration Page
 * 
 * Comprehensive webhook integration management:
 * - Setup guide and documentation
 * - Webhook configuration
 * - Webhook management
 * 
 * Design: Professional integration page with dark theme
 */

export default function WebhookIntegration() {
  const [webhooks, setWebhooks] = useState<WebhookConfigType[]>([]);
  const [showNewConfig, setShowNewConfig] = useState<boolean | string>(false);

  const handleSaveWebhook = (config: WebhookConfigType) => {
    setWebhooks((prev) => {
      const existing = prev.findIndex((w) => w.id === config.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = config;
        return updated;
      }
      return [...prev, config];
    });
    setShowNewConfig(false);
  };

  const handleDeleteWebhook = (id: string) => {
    setWebhooks((prev) => prev.filter((w) => w.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-b from-accent/10 to-background border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-accent/20">
              <Webhook className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Webhook Integration</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Send alert notifications directly to your infrastructure via HTTP webhooks. 
            Flexible, secure, and language-agnostic integration for your alert delivery.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Tabs defaultValue="guide" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-5">
            <TabsTrigger value="guide">Setup Guide</TabsTrigger>
            <TabsTrigger value="configure">Configure</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="test">Test</TabsTrigger>
            <TabsTrigger value="endpoint">Endpoint Tester</TabsTrigger>
          </TabsList>

          {/* Guide Tab */}
          <TabsContent value="guide" className="space-y-6">
            <WebhookIntegrationGuide />
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <WebhookSecuritySettings webhookId="webhook-1" />
          </TabsContent>

          {/* Test Tab */}
          <TabsContent value="test" className="space-y-6">
            <div className="space-y-6">
              <Card className="bg-card border-border p-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">Signature Verification</h2>
                <p className="text-muted-foreground mb-6">
                  Test webhook signature verification before deploying to production.
                </p>
              </Card>
              <SignatureVerificationTester secretKey="" />
            </div>
          </TabsContent>

          {/* Endpoint Tester Tab */}
          <TabsContent value="endpoint" className="space-y-6">
            <div className="space-y-6">
              <Card className="bg-card border-border p-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">Endpoint Tester</h2>
                <p className="text-muted-foreground mb-6">
                  Send test payloads to your webhook endpoint with valid signatures to verify integration.
                </p>
              </Card>
              <WebhookEndpointTester />
            </div>
          </TabsContent>

          {/* Configure Tab */}
          <TabsContent value="configure" className="space-y-6">
            {/* Active Webhooks */}
            {webhooks.length > 0 && (
              <Card className="bg-card border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Active Webhooks</h3>
                <div className="space-y-3">
                  {webhooks.map((webhook) => (
                    <div key={webhook.id} className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                      <div className="flex-1">
                        <p className="font-medium text-foreground truncate">{webhook.url}</p>
                        <p className="text-sm text-muted-foreground">
                          {webhook.enabled ? "✓ Enabled" : "✗ Disabled"} • Auth: {webhook.authType}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setShowNewConfig(true)}
                          variant="outline"
                          size="sm"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteWebhook(webhook.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* New Webhook Configuration */}
            {!showNewConfig ? (
              <Button
                onClick={() => setShowNewConfig(true)}
                className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground hover:opacity-90"
              >
                <Plus className="w-5 h-5" />
                Add New Webhook
              </Button>
            ) : (
              <Card className="bg-card border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-foreground">New Webhook Configuration</h3>
                  <Button
                    onClick={() => setShowNewConfig(false)}
                    variant="ghost"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
                <WebhookConfig
                  onSave={(config) => {
                    handleSaveWebhook(config);
                  }}
                />
              </Card>
            )}

            {/* Info Card */}
            <Card className="bg-accent/5 border border-accent/20 p-6">
              <h4 className="font-semibold text-foreground mb-2">💡 Webhook Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Use HTTPS endpoints for production deployments</li>
                <li>• Your endpoint should respond within 30 seconds</li>
                <li>• Implement proper error handling and logging</li>
                <li>• Test your webhook before enabling in production</li>
                <li>• Multiple webhooks can be configured for redundancy</li>
              </ul>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
