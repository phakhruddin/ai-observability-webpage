/**
 * Webhook Signature Utilities
 * 
 * HMAC-SHA256 signature generation and verification for webhook security
 */

/**
 * Generate a random secret key for webhook signing
 * Returns a 32-byte hex string (256 bits)
 */
export function generateSecretKey(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * Generate HMAC-SHA256 signature for a payload
 * 
 * @param payload - The payload to sign (typically JSON string)
 * @param secret - The secret key for signing
 * @returns Hex-encoded HMAC-SHA256 signature
 */
export async function generateSignature(payload: string, secret: string): Promise<string> {
  try {
    // Convert secret to bytes
    const secretBytes = new TextEncoder().encode(secret);
    
    // Import the key
    const key = await crypto.subtle.importKey(
      "raw",
      secretBytes,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    // Sign the payload
    const payloadBytes = new TextEncoder().encode(payload);
    const signature = await crypto.subtle.sign("HMAC", key, payloadBytes);

    // Convert to hex string
    const signatureArray = Array.from(new Uint8Array(signature));
    return signatureArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch (error) {
    console.error("Error generating signature:", error);
    throw new Error("Failed to generate signature");
  }
}

/**
 * Verify HMAC-SHA256 signature
 * 
 * @param payload - The payload that was signed
 * @param signature - The signature to verify (hex string)
 * @param secret - The secret key used for signing
 * @returns true if signature is valid, false otherwise
 */
export async function verifySignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    const expectedSignature = await generateSignature(payload, secret);
    
    // Constant-time comparison to prevent timing attacks
    return constantTimeCompare(signature, expectedSignature);
  } catch (error) {
    console.error("Error verifying signature:", error);
    return false;
  }
}

/**
 * Constant-time string comparison
 * Prevents timing attacks by comparing all characters
 */
function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Format signature for display
 * Shows first 16 chars + ... + last 8 chars
 */
export function formatSignatureForDisplay(signature: string): string {
  if (signature.length <= 24) {
    return signature;
  }
  return `${signature.substring(0, 16)}...${signature.substring(signature.length - 8)}`;
}

/**
 * Generate example webhook payload
 */
export function generateExamplePayload(): string {
  return JSON.stringify(
    {
      id: "alert-1234567890",
      severity: "critical",
      timestamp: new Date().toISOString(),
      title: "High CPU Usage Detected",
      description: "CPU usage exceeded 90% threshold",
      service: "api-server",
      tags: ["production", "performance"],
    },
    null,
    2
  );
}

/**
 * Generate webhook header value
 * Format: "sha256=<signature>"
 */
export function generateWebhookHeader(signature: string): string {
  return `sha256=${signature}`;
}

/**
 * Parse webhook header
 * Extracts signature from "sha256=<signature>" format
 */
export function parseWebhookHeader(header: string): string | null {
  const match = header.match(/^sha256=(.+)$/);
  return match ? match[1] : null;
}

/**
 * Webhook signature configuration
 */
export interface WebhookSignatureConfig {
  enabled: boolean;
  secret: string;
  headerName: string;
  algorithm: "sha256";
}

/**
 * Default webhook signature configuration
 */
export const DEFAULT_WEBHOOK_SIGNATURE_CONFIG: WebhookSignatureConfig = {
  enabled: false,
  secret: "",
  headerName: "X-Webhook-Signature",
  algorithm: "sha256",
};
