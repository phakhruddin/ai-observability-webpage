import { useState, useEffect } from "react";
import { trackTesterOpened, trackTestSent, trackTestSuccess, trackTestError, trackPayloadTypeChanged, trackSignatureToggled, trackResponseCopied } from "@/lib/endpointTesterAnalytics";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, CheckCircle, Clock, Send, Copy, Loader2 } from "lucide-react";
import {
  type TestPayloadType,
  type TestResult,
  type TestStatus,
  getSamplePayload,
  getPayloadTypeDescription,
  getTestStatusColor,
  getStatusCodeColor,
  formatResponseTime,
  formatJson,
  validateEndpointUrl,
} from "@/lib/endpointTesterTypes";
import { generateSignature } from "@/lib/webhookSignature";
import { toast } from "sonner";

/**
 * WebhookEndpointTester Component
 * 
 * Allows users to test webhook endpoints:
 * - Select sample payload type or custom
 * - Enter endpoint URL
 * - Configure signature settings
 * - Send test request
 * - View response details
 * - Test history
 * 
 * Design: Professional testing interface with request/response tabs
 */

interface WebhookEndpointTesterProps {
  defaultEndpoint?: string;
  defaultSecret?: string;
  onTestComplete?: (result: TestResult) => void;
}

export function WebhookEndpointTester({
  defaultEndpoint = "",
  defaultSecret = "",
  onTestComplete,
}: WebhookEndpointTesterProps) {
  const [endpoint, setEndpoint] = useState(defaultEndpoint);
  const [secret, setSecret] = useState(defaultSecret);
  const [payloadType, setPayloadType] = useState<TestPayloadType>("alert");
  const [customPayload, setCustomPayload] = useState("");
  const [includeSignature, setIncludeSignature] = useState(true);
  const [testStatus, setTestStatus] = useState<TestStatus>("idle");
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [testHistory, setTestHistory] = useState<TestResult[]>([]);

  useEffect(() => {
    trackTesterOpened();
  }, []);

  const payload = customPayload ? JSON.parse(customPayload) : getSamplePayload(payloadType);

  const handlePayloadTypeChange = (type: TestPayloadType) => {
    setPayloadType(type);
    trackPayloadTypeChanged(type);
  };

  const handleSignatureToggle = (enabled: boolean) => {
    setIncludeSignature(enabled);
    trackSignatureToggled(enabled);
  };

  const handleCopyToClipboard = (text: string, section: string) => {
    copyToClipboard(text);
    trackResponseCopied(section);
  };

  const handleSendTest = async () => {
    if (!endpoint) {
      toast.error("Please enter endpoint URL");
      return;
    }

    if (!validateEndpointUrl(endpoint)) {
      toast.error("Invalid endpoint URL");
      return;
    }

    setTestStatus("loading");

    try {
      // Generate signature if enabled
      let signature: string | undefined;
      let signatureHeader: string | undefined;

      if (includeSignature && secret) {
        signature = await generateSignature(JSON.stringify(payload), secret);
        signatureHeader = `sha256=${signature}`;
      }

      // Simulate sending request (in real app, would call backend API)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock successful response
      const mockResponse = {
        id: `resp-${Date.now()}`,
        requestId: `req-${Date.now()}`,
        timestamp: new Date().toISOString(),
        statusCode: 200,
        statusText: "OK",
        headers: {
          "content-type": "application/json",
          "x-request-id": `req-${Date.now()}`,
        },
        body: JSON.stringify({ success: true, message: "Webhook received" }),
        responseTime: Math.random() * 500 + 100,
        success: true,
      };

      const result: TestResult = {
        request: {
          id: `req-${Date.now()}`,
          timestamp: new Date().toISOString(),
          endpoint,
          method: "POST",
          headers: {
            "content-type": "application/json",
            ...(signatureHeader && { "x-webhook-signature": signatureHeader }),
          },
          payload,
          signature,
          signatureHeader,
        },
        response: mockResponse,
        status: "success",
      };

      setTestResult(result);
      setTestHistory([result, ...testHistory.slice(0, 9)]);
      setTestStatus("success");
      trackTestSent(payloadType, includeSignature);
      trackTestSuccess(mockResponse.responseTime, mockResponse.statusCode);
      onTestComplete?.(result);
      toast.success("Test request sent successfully!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Test failed";
      setTestStatus("error");
      setTestResult({
        request: {
          id: `req-${Date.now()}`,
          timestamp: new Date().toISOString(),
          endpoint,
          method: "POST",
          headers: {},
          payload,
        },
        status: "error",
        error: errorMessage,
      });
      trackTestError(errorMessage);
      toast.error(`Test failed: ${errorMessage}`);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <Card className="p-6 border-border bg-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">Test Configuration</h3>

        <div className="space-y-4">
          {/* Endpoint URL */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Webhook Endpoint URL
            </label>
            <Input
              type="url"
              placeholder="https://your-endpoint.com/webhook"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              className="bg-background border-border"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter the URL where you want to receive test payloads
            </p>
          </div>

          {/* Payload Type */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Payload Type
            </label>
            <Select value={payloadType} onValueChange={(value) => handlePayloadTypeChange(value as TestPayloadType)}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alert">Alert Notification</SelectItem>
                <SelectItem value="metric">Metric Data</SelectItem>
                <SelectItem value="log">Log Entry</SelectItem>
                <SelectItem value="event">System Event</SelectItem>
                <SelectItem value="custom">Custom Payload</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Signature Settings */}
          <div className="flex items-center gap-4 p-3 rounded-lg bg-background border border-border">
            <input
              type="checkbox"
              id="include-signature"
              checked={includeSignature}
              onChange={(e) => handleSignatureToggle(e.target.checked)}
              className="w-4 h-4 rounded border-border"
            />
            <label htmlFor="include-signature" className="text-sm font-medium text-foreground flex-1">
              Include HMAC-SHA256 Signature
            </label>
          </div>

          {/* Secret Key */}
          {includeSignature && (
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Secret Key
              </label>
              <Input
                type="password"
                placeholder="Your webhook secret key"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="bg-background border-border"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Used to generate HMAC-SHA256 signature for request verification
              </p>
            </div>
          )}

          {/* Send Button */}
          <Button
            onClick={handleSendTest}
            disabled={testStatus === "loading" || !endpoint}
            className="w-full bg-accent text-accent-foreground hover:opacity-90 flex items-center justify-center gap-2"
          >
            {testStatus === "loading" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Test Request
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Test Result */}
      {testResult && (
        <Card className={`p-6 border-2 ${getTestStatusColor(testResult.status)}`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              {testResult.status === "success" && (
                <CheckCircle className="w-5 h-5 text-green-400" />
              )}
              {testResult.status === "error" && (
                <AlertCircle className="w-5 h-5 text-red-400" />
              )}
              {testResult.status === "loading" && (
                <Clock className="w-5 h-5 text-blue-400 animate-spin" />
              )}
              <h3 className="text-lg font-semibold">
                {testResult.status === "success" && "Test Successful"}
                {testResult.status === "error" && "Test Failed"}
                {testResult.status === "loading" && "Testing..."}
              </h3>
            </div>
            {testResult.response && (
              <span className={`text-sm font-mono font-semibold ${getStatusCodeColor(testResult.response.statusCode)}`}>
                {testResult.response.statusCode} {testResult.response.statusText}
              </span>
            )}
          </div>

          {testResult.error && (
            <div className="text-sm text-current/70 mb-4">
              <p className="font-mono">{testResult.error}</p>
            </div>
          )}

          {testResult.response && (
            <Tabs defaultValue="response" className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="request">Request</TabsTrigger>
                <TabsTrigger value="response">Response</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              {/* Request Tab */}
              <TabsContent value="request" className="space-y-3">
                <div className="bg-background/50 rounded p-3 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">URL</p>
                  <div className="flex items-center justify-between gap-2">
                    <code className="text-xs text-foreground/70 break-all">{testResult.request.endpoint}</code>
                    <Button
                      onClick={() => handleCopyToClipboard(testResult.request.endpoint, "endpoint")}
                      variant="ghost"
                      size="sm"
                      className="flex-shrink-0"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="bg-background/50 rounded p-3 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">Headers</p>
                  <pre className="text-xs bg-background rounded p-2 overflow-auto max-h-40">
                    {formatJson(testResult.request.headers)}
                  </pre>
                </div>

                <div className="bg-background/50 rounded p-3 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">Payload</p>
                  <pre className="text-xs bg-background rounded p-2 overflow-auto max-h-40">
                    {formatJson(testResult.request.payload)}
                  </pre>
                </div>
              </TabsContent>

              {/* Response Tab */}
              <TabsContent value="response" className="space-y-3">
                <div className="bg-background/50 rounded p-3 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">Status</p>
                  <p className="text-sm font-mono">
                    {testResult.response.statusCode} {testResult.response.statusText}
                  </p>
                </div>

                <div className="bg-background/50 rounded p-3 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">Headers</p>
                  <pre className="text-xs bg-background rounded p-2 overflow-auto max-h-40">
                    {formatJson(testResult.response.headers)}
                  </pre>
                </div>

                <div className="bg-background/50 rounded p-3 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">Body</p>
                  <pre className="text-xs bg-background rounded p-2 overflow-auto max-h-40">
                    {testResult.response.body}
                  </pre>
                </div>
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value="details" className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-background/50 rounded p-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Response Time</p>
                    <p className="text-sm font-mono">{formatResponseTime(testResult.response.responseTime)}</p>
                  </div>
                  <div className="bg-background/50 rounded p-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Timestamp</p>
                    <p className="text-xs font-mono">{new Date(testResult.response.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>

                {testResult.request.signatureHeader && (
                  <div className="bg-background/50 rounded p-3 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">Signature Header</p>
                    <div className="flex items-center justify-between gap-2">
                      <code className="text-xs text-foreground/70 break-all">{testResult.request.signatureHeader}</code>
                      <Button
                        onClick={() => handleCopyToClipboard(testResult.request.signatureHeader || "", "signature")}
                        variant="ghost"
                        size="sm"
                        className="flex-shrink-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </Card>
      )}

      {/* Test History */}
      {testHistory.length > 0 && (
        <Card className="p-6 border-border bg-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Test History</h3>
          <div className="space-y-2 max-h-64 overflow-auto">
            {testHistory.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded bg-background/50 border border-border/50">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {result.status === "success" && (
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  )}
                  {result.status === "error" && (
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-mono truncate">{result.request.endpoint}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(result.request.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                {result.response && (
                  <span className={`text-xs font-mono font-semibold flex-shrink-0 ${getStatusCodeColor(result.response.statusCode)}`}>
                    {result.response.statusCode}
                  </span>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
