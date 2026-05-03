import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Code, Zap, Shield, Clock } from "lucide-react";

/**
 * WebhookIntegrationGuide Component
 * 
 * Comprehensive guide for webhook integration:
 * - Setup steps
 * - Authentication options
 * - Payload format
 * - Best practices
 * - Troubleshooting
 * 
 * Design: Professional documentation with dark theme
 */

export function WebhookIntegrationGuide() {
  return (
    <div className="space-y-8">
      {/* Overview */}
      <Card className="bg-card border-border p-6">
        <h2 className="text-2xl font-bold text-foreground mb-4">Webhook Integration Guide</h2>
        <p className="text-muted-foreground mb-4">
          Webhooks allow OAAS to send alert notifications directly to your infrastructure via HTTP POST requests. 
          This provides a flexible, language-agnostic way to integrate alerts into your existing systems.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="flex gap-3">
            <Zap className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">Real-time Delivery</p>
              <p className="text-sm text-muted-foreground">Alerts sent instantly to your endpoint</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Shield className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">Secure</p>
              <p className="text-sm text-muted-foreground">Multiple auth methods supported</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Code className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">Flexible</p>
              <p className="text-sm text-muted-foreground">Works with any HTTP endpoint</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Setup Steps */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-accent" />
          Setup Steps
        </h3>
        <div className="space-y-6">
          {[
            {
              step: 1,
              title: "Prepare Your Endpoint",
              description: "Create an HTTP endpoint that can receive POST requests with JSON payloads",
              code: `# Example Python Flask endpoint
@app.route('/webhooks/alerts', methods=['POST'])
def handle_alert():
    data = request.json
    print(f"Alert: {data['title']}")
    return {'status': 'received'}, 200`,
            },
            {
              step: 2,
              title: "Configure Authentication",
              description: "Choose an authentication method (Bearer Token, API Key, or Basic Auth)",
              code: `# Bearer Token Example
Authorization: Bearer your-secret-token

# API Key Example
X-API-Key: your-api-key

# Basic Auth Example
Authorization: Basic base64(username:password)`,
            },
            {
              step: 3,
              title: "Add Webhook URL",
              description: "Enter your endpoint URL in the webhook configuration panel",
              code: `https://your-domain.com/webhooks/alerts`,
            },
            {
              step: 4,
              title: "Test the Connection",
              description: "Use the test button to verify your webhook is working correctly",
              code: `# Test sends a sample alert payload
POST /webhooks/alerts HTTP/1.1
Content-Type: application/json
Authorization: Bearer your-token

{
  "id": "alert-123",
  "severity": "warning",
  "title": "High CPU Usage",
  ...
}`,
            },
          ].map((item) => (
            <div key={item.step} className="border-l-2 border-accent/30 pl-6 pb-6 last:pb-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-accent font-bold">{item.step}</span>
                </div>
                <h4 className="font-semibold text-foreground">{item.title}</h4>
              </div>
              <p className="text-muted-foreground mb-3">{item.description}</p>
              <div className="bg-background rounded-lg p-4 overflow-x-auto">
                <pre className="text-xs text-muted-foreground font-mono">{item.code}</pre>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Payload Format */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-xl font-bold text-foreground mb-4">Alert Payload Format</h3>
        <p className="text-muted-foreground mb-4">
          Each webhook request contains a JSON payload with the following structure:
        </p>
        <div className="bg-background rounded-lg p-4 overflow-x-auto mb-4">
          <pre className="text-xs text-muted-foreground font-mono">{`{
  "id": "alert-1234567890",
  "timestamp": "2026-05-03T06:30:00.000Z",
  "severity": "warning",
  "title": "High CPU Usage Detected",
  "description": "CPU usage exceeded 85% threshold",
  "source": "prometheus",
  "tags": {
    "environment": "production",
    "service": "api-server",
    "region": "us-east-1"
  },
  "metadata": {
    "cpu_usage": 87.5,
    "threshold": 85,
    "instance": "prod-api-01",
    "duration": "5m"
  }
}`}</pre>
        </div>
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-foreground text-sm">Severity Levels:</p>
            <ul className="text-sm text-muted-foreground space-y-1 mt-2">
              <li>• <span className="text-red-400">critical</span> - Immediate action required</li>
              <li>• <span className="text-amber-400">warning</span> - Attention needed</li>
              <li>• <span className="text-blue-400">info</span> - Informational only</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Authentication Methods */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Shield className="w-6 h-6 text-accent" />
          Authentication Methods
        </h3>
        <div className="space-y-4">
          {[
            {
              name: "No Authentication",
              description: "Webhook is publicly accessible (not recommended for production)",
              example: "POST /webhooks/alerts HTTP/1.1",
            },
            {
              name: "Bearer Token",
              description: "Include a secret token in the Authorization header",
              example: "Authorization: Bearer your-secret-token-here",
            },
            {
              name: "API Key",
              description: "Send API key in a custom header",
              example: "X-API-Key: your-api-key-here",
            },
            {
              name: "Basic Auth",
              description: "HTTP Basic Authentication with username and password",
              example: "Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=",
            },
          ].map((auth, idx) => (
            <div key={idx} className="border border-border rounded-lg p-4">
              <p className="font-semibold text-foreground mb-2">{auth.name}</p>
              <p className="text-sm text-muted-foreground mb-3">{auth.description}</p>
              <div className="bg-background rounded p-2">
                <code className="text-xs text-accent font-mono">{auth.example}</code>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Best Practices */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-xl font-bold text-foreground mb-4">Best Practices</h3>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="text-accent font-bold">•</span>
            <span><strong className="text-foreground">Use HTTPS:</strong> Always use HTTPS endpoints to protect sensitive alert data</span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent font-bold">•</span>
            <span><strong className="text-foreground">Implement Retries:</strong> Your endpoint should handle retries gracefully</span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent font-bold">•</span>
            <span><strong className="text-foreground">Validate Signatures:</strong> Verify webhook authenticity when possible</span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent font-bold">•</span>
            <span><strong className="text-foreground">Handle Timeouts:</strong> Respond within 30 seconds to avoid timeout</span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent font-bold">•</span>
            <span><strong className="text-foreground">Log Everything:</strong> Keep detailed logs of all webhook requests</span>
          </li>
        </ul>
      </Card>

      {/* Troubleshooting */}
      <Card className="bg-accent/5 border border-accent/20 p-6">
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <AlertCircle className="w-6 h-6 text-accent" />
          Troubleshooting
        </h3>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-foreground text-sm mb-2">Webhook not receiving alerts?</p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>✓ Verify the endpoint URL is correct and accessible</li>
              <li>✓ Check that authentication credentials are valid</li>
              <li>✓ Ensure your endpoint returns a 2xx status code</li>
              <li>✓ Check firewall/network rules allow inbound traffic</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm mb-2">Authentication failing?</p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>✓ Double-check your token/key is correct</li>
              <li>✓ Verify header names match exactly (case-sensitive)</li>
              <li>✓ Test with the webhook test button to debug</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
