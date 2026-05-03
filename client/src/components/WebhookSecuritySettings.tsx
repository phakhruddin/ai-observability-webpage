import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Eye, EyeOff, RefreshCw, Shield, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import {
  generateSecretKey,
  generateSignature,
  formatSignatureForDisplay,
  generateExamplePayload,
  generateWebhookHeader,
  type WebhookSignatureConfig,
  DEFAULT_WEBHOOK_SIGNATURE_CONFIG,
} from "@/lib/webhookSignature";

/**
 * WebhookSecuritySettings Component
 * 
 * Manages webhook signature security:
 * - Generate and manage secret keys
 * - Display signature configuration
 * - Test signature generation
 * - Copy configuration for implementation
 * 
 * Design: Professional security settings panel
 */

interface WebhookSecuritySettingsProps {
  webhookId?: string;
  onConfigChange?: (config: WebhookSignatureConfig) => void;
}

export function WebhookSecuritySettings({
  webhookId = "webhook-1",
  onConfigChange,
}: WebhookSecuritySettingsProps) {
  const [config, setConfig] = useState<WebhookSignatureConfig>(DEFAULT_WEBHOOK_SIGNATURE_CONFIG);
  const [showSecret, setShowSecret] = useState(false);
  const [showTestSignature, setShowTestSignature] = useState(false);
  const [testPayload, setTestPayload] = useState(generateExamplePayload());
  const [testSignature, setTestSignature] = useState("");
  const [isGeneratingSignature, setIsGeneratingSignature] = useState(false);

  const handleGenerateSecret = () => {
    const newSecret = generateSecretKey();
    const newConfig = { ...config, secret: newSecret, enabled: true };
    setConfig(newConfig);
    onConfigChange?.(newConfig);
    toast.success("New secret key generated!");
  };

  const handleCopySecret = () => {
    navigator.clipboard.writeText(config.secret);
    toast.success("Secret key copied to clipboard!");
  };

  const handleCopyHeader = () => {
    const headerValue = generateWebhookHeader(testSignature || "sha256=...");
    navigator.clipboard.writeText(headerValue);
    toast.success("Header value copied to clipboard!");
  };

  const handleGenerateTestSignature = async () => {
    if (!config.secret) {
      toast.error("Please generate a secret key first");
      return;
    }

    setIsGeneratingSignature(true);
    try {
      const signature = await generateSignature(testPayload, config.secret);
      setTestSignature(signature);
      toast.success("Test signature generated!");
    } catch (error) {
      toast.error("Failed to generate signature");
    } finally {
      setIsGeneratingSignature(false);
    }
  };

  const handleToggleEnabled = () => {
    const newConfig = { ...config, enabled: !config.enabled };
    setConfig(newConfig);
    onConfigChange?.(newConfig);
  };

  const handleResetSecret = () => {
    if (confirm("Are you sure? This will invalidate all existing signatures.")) {
      handleGenerateSecret();
    }
  };

  useEffect(() => {
    // Track when component mounts
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Shield className="w-6 h-6 text-accent" />
        <div>
          <h2 className="text-2xl font-bold text-foreground">Webhook Security</h2>
          <p className="text-sm text-muted-foreground">
            Secure your webhook endpoints with HMAC-SHA256 signatures
          </p>
        </div>
      </div>

      {/* Enable/Disable Toggle */}
      <Card className="bg-card border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground mb-1">Signature Verification</h3>
            <p className="text-sm text-muted-foreground">
              {config.enabled
                ? "Enabled - All webhooks will be signed"
                : "Disabled - Webhooks will not be signed"}
            </p>
          </div>
          <Button
            onClick={handleToggleEnabled}
            variant={config.enabled ? "default" : "outline"}
            className="w-24"
          >
            {config.enabled ? "Enabled" : "Disabled"}
          </Button>
        </div>
      </Card>

      {/* Secret Key Management */}
      <Card className="bg-card border-border p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Secret Key
        </h3>

        {config.secret ? (
          <div className="space-y-4">
            {/* Secret Display */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-background border border-border">
              <code className="flex-1 text-xs font-mono text-muted-foreground break-all">
                {showSecret ? config.secret : "•".repeat(config.secret.length)}
              </code>
              <Button
                onClick={() => setShowSecret(!showSecret)}
                variant="ghost"
                size="sm"
                title={showSecret ? "Hide secret" : "Show secret"}
              >
                {showSecret ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
              <Button
                onClick={handleCopySecret}
                variant="ghost"
                size="sm"
                title="Copy secret"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>

            {/* Info */}
            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-400">
                Keep this secret safe. Anyone with this key can generate valid signatures.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                onClick={handleResetSecret}
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Rotate Secret
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Generate a secret key to enable webhook signing. This key will be used to create
              HMAC-SHA256 signatures for all webhook deliveries.
            </p>
            <Button
              onClick={handleGenerateSecret}
              className="w-full flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Generate Secret Key
            </Button>
          </div>
        )}
      </Card>

      {/* Configuration Details */}
      {config.secret && (
        <Card className="bg-card border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Configuration</h3>

          <div className="space-y-4">
            {/* Algorithm */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Algorithm
              </label>
              <div className="p-3 rounded-lg bg-background border border-border">
                <code className="text-sm font-mono text-muted-foreground">
                  HMAC-SHA256
                </code>
              </div>
            </div>

            {/* Header Name */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Header Name
              </label>
              <div className="flex items-center gap-2">
                <Input
                  value={config.headerName}
                  readOnly
                  className="flex-1"
                />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(config.headerName);
                    toast.success("Header name copied!");
                  }}
                  variant="outline"
                  size="sm"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Include this header in all webhook requests with the signature value
              </p>
            </div>

            {/* Webhook ID */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Webhook ID
              </label>
              <div className="p-3 rounded-lg bg-background border border-border">
                <code className="text-sm font-mono text-muted-foreground">{webhookId}</code>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Test Signature Generation */}
      {config.secret && (
        <Card className="bg-card border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Test Signature</h3>

          <div className="space-y-4">
            {/* Test Payload */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Test Payload
              </label>
              <textarea
                value={testPayload}
                onChange={(e) => setTestPayload(e.target.value)}
                className="w-full h-32 p-3 rounded-lg bg-background border border-border text-xs font-mono text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerateTestSignature}
              disabled={isGeneratingSignature}
              className="w-full flex items-center justify-center gap-2"
            >
              {isGeneratingSignature ? (
                <>
                  <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Generate Signature
                </>
              )}
            </Button>

            {/* Generated Signature */}
            {testSignature && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <p className="text-xs text-green-400">Signature generated successfully</p>
                </div>

                {/* Signature Value */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">
                    Signature (hex)
                  </label>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-background border border-border">
                    <code className="flex-1 text-xs font-mono text-muted-foreground break-all">
                      {showTestSignature ? testSignature : formatSignatureForDisplay(testSignature)}
                    </code>
                    <Button
                      onClick={() => setShowTestSignature(!showTestSignature)}
                      variant="ghost"
                      size="sm"
                    >
                      {showTestSignature ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(testSignature);
                        toast.success("Signature copied!");
                      }}
                      variant="ghost"
                      size="sm"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Header Format */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">
                    Header Format
                  </label>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-background border border-border">
                    <code className="flex-1 text-xs font-mono text-muted-foreground break-all">
                      {generateWebhookHeader(testSignature)}
                    </code>
                    <Button
                      onClick={handleCopyHeader}
                      variant="ghost"
                      size="sm"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Implementation Guide */}
      <Card className="bg-accent/5 border border-accent/20 p-6">
        <h3 className="font-semibold text-foreground mb-3">💡 Implementation Guide</h3>
        <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
          <li>Generate a secret key above</li>
          <li>Store the secret securely in your environment variables</li>
          <li>For each webhook delivery, compute HMAC-SHA256(payload, secret)</li>
          <li>Include the signature in the X-Webhook-Signature header</li>
          <li>On your endpoint, verify the signature using the same secret</li>
          <li>Reject requests with invalid or missing signatures</li>
        </ol>
      </Card>
    </div>
  );
}
