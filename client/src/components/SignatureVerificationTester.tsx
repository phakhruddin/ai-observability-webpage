import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, Copy, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  verifySignature,
  parseWebhookHeader,
  generateExamplePayload,
} from "@/lib/webhookSignature";

/**
 * SignatureVerificationTester Component
 * 
 * Tests webhook signature verification:
 * - Paste webhook payload and signature
 * - Verify against secret key
 * - Shows verification result
 * 
 * Design: Professional testing interface
 */

interface SignatureVerificationTesterProps {
  secretKey?: string;
}

export function SignatureVerificationTester({ secretKey = "" }: SignatureVerificationTesterProps) {
  const [payload, setPayload] = useState(generateExamplePayload());
  const [headerValue, setHeaderValue] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    valid: boolean;
    message: string;
  } | null>(null);

  const handleVerify = async () => {
    if (!secretKey) {
      toast.error("Secret key is required");
      return;
    }

    if (!payload.trim()) {
      toast.error("Payload is required");
      return;
    }

    if (!headerValue.trim()) {
      toast.error("Header value is required");
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      // Parse the header value
      const signature = parseWebhookHeader(headerValue);
      if (!signature) {
        setVerificationResult({
          valid: false,
          message: "Invalid header format. Expected: sha256=<signature>",
        });
        return;
      }

      // Verify the signature
      const isValid = await verifySignature(payload, signature, secretKey);

      setVerificationResult({
        valid: isValid,
        message: isValid
          ? "✓ Signature is valid! This webhook came from a trusted source."
          : "✗ Signature is invalid. This webhook may not be authentic.",
      });
    } catch (error) {
      setVerificationResult({
        valid: false,
        message: "Error verifying signature. Please check your inputs.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClearAll = () => {
    setPayload("");
    setHeaderValue("");
    setVerificationResult(null);
  };

  return (
    <Card className="bg-card border-border p-6">
      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
        <AlertCircle className="w-4 h-4" />
        Verify Signature
      </h3>

      <div className="space-y-4">
        {/* Info */}
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
          <p className="text-xs text-blue-400">
            Use this tool to verify webhook signatures received from OAAS. Paste the webhook
            payload and the signature header to test verification.
          </p>
        </div>

        {/* Payload Input */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Webhook Payload
          </label>
          <textarea
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            placeholder='{"id": "alert-123", "severity": "critical", ...}'
            className="w-full h-32 p-3 rounded-lg bg-background border border-border text-xs font-mono text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Paste the exact webhook payload as received
          </p>
        </div>

        {/* Header Input */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            X-Webhook-Signature Header
          </label>
          <Input
            value={headerValue}
            onChange={(e) => setHeaderValue(e.target.value)}
            placeholder="sha256=abc123def456..."
            className="font-mono text-xs"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Paste the value from the X-Webhook-Signature header
          </p>
        </div>

        {/* Verification Result */}
        {verificationResult && (
          <div
            className={`p-4 rounded-lg border flex items-start gap-3 ${
              verificationResult.valid
                ? "bg-green-500/10 border-green-500/30"
                : "bg-red-500/10 border-red-500/30"
            }`}
          >
            {verificationResult.valid ? (
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            )}
            <p
              className={`text-sm ${
                verificationResult.valid ? "text-green-400" : "text-red-400"
              }`}
            >
              {verificationResult.message}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={handleVerify}
            disabled={isVerifying || !secretKey}
            className="flex-1 flex items-center justify-center gap-2"
          >
            {isVerifying ? (
              <>
                <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Verify Signature
              </>
            )}
          </Button>
          <Button
            onClick={handleClearAll}
            variant="outline"
            className="flex items-center justify-center gap-2"
          >
            Clear
          </Button>
        </div>

        {!secretKey && (
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <p className="text-xs text-amber-400">
              Generate a secret key in the Security Settings section to enable signature verification.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
