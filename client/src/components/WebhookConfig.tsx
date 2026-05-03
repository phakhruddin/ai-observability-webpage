import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, Eye, EyeOff, Zap, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  validateWebhookUrl,
  buildAuthHeaders,
  getAuthTypeLabel,
  generateSamplePayload,
  type WebhookConfig,
  type WebhookAuthType,
} from "@/lib/webhookTypes";
import {
  trackWebhookConfigured,
  trackWebhookTested,
  trackPayloadCopied,
  trackAuthMethodChanged,
} from "@/lib/webhookAnalytics";

/**
 * WebhookConfig Component
 * 
 * Allows users to configure webhook endpoints with:
 * - URL input and validation
 * - Multiple authentication methods
 * - Payload preview
 * - Test webhook functionality
 * 
 * Design: Professional configuration panel with dark theme
 */

interface WebhookConfigProps {
  onSave?: (config: WebhookConfig) => void;
  initialConfig?: WebhookConfig;
}

export function WebhookConfig({ onSave, initialConfig }: WebhookConfigProps) {
  const [url, setUrl] = useState(initialConfig?.url || "");
  const [authType, setAuthType] = useState<WebhookAuthType>(initialConfig?.authType || "none");
  const [authToken, setAuthToken] = useState(initialConfig?.authToken || "");
  const [apiKeyHeader, setApiKeyHeader] = useState(initialConfig?.apiKeyHeader || "X-API-Key");
  const [apiKeyValue, setApiKeyValue] = useState(initialConfig?.apiKeyValue || "");
  const [basicUsername, setBasicUsername] = useState(initialConfig?.basicUsername || "");
  const [basicPassword, setBasicPassword] = useState(initialConfig?.basicPassword || "");
  const [enabled, setEnabled] = useState(initialConfig?.enabled ?? true);
  const [showPayload, setShowPayload] = useState(false);
  const [showAuthToken, setShowAuthToken] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testStatus, setTestStatus] = useState<"idle" | "success" | "failed">("idle");

  const urlValidation = validateWebhookUrl(url);
  const isValid = urlValidation.valid && url.length > 0;

  const handleTestWebhook = async () => {
    if (!isValid) {
      toast.error("Please enter a valid webhook URL");
      return;
    }

    setIsTesting(true);
    try {
      // Simulate webhook test
      const payload = generateSamplePayload();
      const headers = {
        "Content-Type": "application/json",
        ...buildAuthHeaders(authType, authToken, apiKeyHeader, apiKeyValue, basicUsername, basicPassword),
      };

      // In production, this would call a backend endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setTestStatus("success");
      trackWebhookTested(true, authType);
      toast.success("Webhook test successful! (Simulated)");
    } catch (error) {
      setTestStatus("failed");
      trackWebhookTested(false, authType);
      toast.error("Webhook test failed");
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    if (!isValid) {
      toast.error("Please enter a valid webhook URL");
      return;
    }

    const config: WebhookConfig = {
      id: initialConfig?.id || `webhook-${Date.now()}`,
      url,
      authType,
      authToken: authType === "bearer" ? authToken : undefined,
      apiKeyHeader: authType === "api_key" ? apiKeyHeader : undefined,
      apiKeyValue: authType === "api_key" ? apiKeyValue : undefined,
      basicUsername: authType === "basic" ? basicUsername : undefined,
      basicPassword: authType === "basic" ? basicPassword : undefined,
      enabled,
      createdAt: initialConfig?.createdAt || new Date().toISOString(),
    };

    trackWebhookConfigured(authType);
    onSave?.(config);
    toast.success("Webhook configuration saved!");
  };

  const handleCopyPayload = () => {
    const payload = generateSamplePayload();
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    trackPayloadCopied();
    toast.success("Payload copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      {/* Webhook URL */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Webhook Endpoint</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Webhook URL
            </label>
            <div className="relative">
              <Input
                type="url"
                placeholder="https://your-domain.com/webhooks/alerts"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pr-10"
              />
              {url && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {urlValidation.valid ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              )}
            </div>
            {!urlValidation.valid && url && (
              <p className="text-xs text-red-400 mt-1">{urlValidation.error}</p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              OAAS will send POST requests with alert data to this URL
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              id="webhook-enabled"
              checked={enabled}
              onCheckedChange={(checked) => setEnabled(checked as boolean)}
            />
            <label htmlFor="webhook-enabled" className="text-sm text-foreground cursor-pointer">
              Enable this webhook
            </label>
          </div>
        </div>
      </Card>

      {/* Authentication */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Authentication</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Authentication Method
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {(["none", "bearer", "api_key", "basic"] as WebhookAuthType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    if (authType !== type) {
                      trackAuthMethodChanged(authType, type);
                    }
                    setAuthType(type);
                  }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    authType === type
                      ? "bg-accent text-accent-foreground"
                      : "bg-card border border-border text-foreground hover:border-accent"
                  }`}
                >
                  {getAuthTypeLabel(type)}
                </button>
              ))}
            </div>
          </div>

          {/* Bearer Token */}
          {authType === "bearer" && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Bearer Token
              </label>
              <div className="relative">
                <Input
                  type={showAuthToken ? "text" : "password"}
                  placeholder="your-secret-token"
                  value={authToken}
                  onChange={(e) => setAuthToken(e.target.value)}
                  className="pr-10"
                />
                <button
                  onClick={() => setShowAuthToken(!showAuthToken)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showAuthToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* API Key */}
          {authType === "api_key" && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Header Name
                </label>
                <Input
                  type="text"
                  placeholder="X-API-Key"
                  value={apiKeyHeader}
                  onChange={(e) => setApiKeyHeader(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  API Key Value
                </label>
                <div className="relative">
                  <Input
                    type={showApiKey ? "text" : "password"}
                    placeholder="your-api-key"
                    value={apiKeyValue}
                    onChange={(e) => setApiKeyValue(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Basic Auth */}
          {authType === "basic" && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Username
                </label>
                <Input
                  type="text"
                  placeholder="username"
                  value={basicUsername}
                  onChange={(e) => setBasicUsername(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="password"
                    value={basicPassword}
                    onChange={(e) => setBasicPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Payload Preview */}
      <Card className="bg-card border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Sample Payload</h3>
          <Button
            onClick={handleCopyPayload}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy
          </Button>
        </div>
        <div className="bg-background rounded-lg p-4 overflow-x-auto">
          <pre className="text-xs text-muted-foreground font-mono">
            {JSON.stringify(generateSamplePayload(), null, 2)}
          </pre>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          onClick={handleTestWebhook}
          disabled={!isValid || isTesting}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Zap className="w-4 h-4" />
          {isTesting ? "Testing..." : "Test Webhook"}
        </Button>
        <Button
          onClick={handleSave}
          disabled={!isValid}
          className="flex-1 bg-accent text-accent-foreground hover:opacity-90"
        >
          Save Configuration
        </Button>
      </div>

      {testStatus !== "idle" && (
        <div
          className={`p-4 rounded-lg border ${
            testStatus === "success"
              ? "bg-green-500/10 border-green-500/30 text-green-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          {testStatus === "success"
            ? "✓ Webhook test successful!"
            : "✗ Webhook test failed. Check your URL and authentication."}
        </div>
      )}
    </div>
  );
}
