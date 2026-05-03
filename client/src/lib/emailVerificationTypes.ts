/**
 * Email Verification Types and Utilities
 * 
 * Manages email verification tokens, status, and user data
 */

export type VerificationStatus = 
  | "pending"
  | "verified"
  | "expired"
  | "invalid";

export interface VerificationToken {
  token: string;
  email: string;
  expiresAt: string;
  createdAt: string;
}

export interface VerificationUser {
  id: string;
  email: string;
  name: string;
  company: string;
  companySize: string;
  logVolume: string;
  observabilityTools: string[];
  verificationToken?: string;
  verificationExpiresAt?: string;
  isVerified: boolean;
  verifiedAt?: string;
  createdAt: string;
}

export interface VerificationEmail {
  to: string;
  subject: string;
  verificationLink: string;
  verificationCode: string;
  expiresIn: string;
}

/**
 * Generate verification token
 */
export function generateVerificationToken(): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 32; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
}

/**
 * Generate verification code (6 digits)
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Calculate token expiration time (24 hours from now)
 */
export function calculateTokenExpiration(): string {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);
  return expiresAt.toISOString();
}

/**
 * Check if token is expired
 */
export function isTokenExpired(expiresAt: string): boolean {
  return new Date(expiresAt) < new Date();
}

/**
 * Generate verification email content
 */
export function generateVerificationEmail(
  email: string,
  verificationToken: string,
  baseUrl: string = window.location.origin
): VerificationEmail {
  const verificationCode = generateVerificationCode();
  const verificationLink = `${baseUrl}/verify-email?token=${verificationToken}`;

  return {
    to: email,
    subject: "Verify Your Email - OAAS Free Trial",
    verificationLink,
    verificationCode,
    expiresIn: "24 hours",
  };
}

/**
 * Format verification email HTML
 */
export function formatVerificationEmailHTML(
  email: VerificationEmail,
  userName: string
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: #00d9ff; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { background: #f5f5f5; padding: 30px; border-radius: 0 0 8px 8px; }
          .verification-code { background: #00d9ff; color: #1a1a2e; padding: 15px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; border-radius: 8px; margin: 20px 0; font-family: 'Courier New', monospace; }
          .button { display: inline-block; background: #00d9ff; color: #1a1a2e; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; }
          .expires { color: #ff6b6b; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Verify Your Email</h1>
          </div>
          <div class="content">
            <p>Hi ${userName},</p>
            <p>Thank you for signing up for OAAS! To complete your free trial setup, please verify your email address.</p>
            
            <p><strong>Your verification code:</strong></p>
            <div class="verification-code">${email.verificationCode}</div>
            
            <p>Or click the button below to verify:</p>
            <div style="text-align: center;">
              <a href="${email.verificationLink}" class="button">Verify Email</a>
            </div>
            
            <p>This link will expire in <span class="expires">${email.expiresIn}</span>.</p>
            
            <p>If you didn't sign up for OAAS, you can safely ignore this email.</p>
            
            <div class="footer">
              <p>© 2026 OAAS. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Format verification email plain text
 */
export function formatVerificationEmailPlainText(
  email: VerificationEmail,
  userName: string
): string {
  return `
Hi ${userName},

Thank you for signing up for OAAS! To complete your free trial setup, please verify your email address.

Your verification code: ${email.verificationCode}

Or visit this link to verify:
${email.verificationLink}

This link will expire in ${email.expiresIn}.

If you didn't sign up for OAAS, you can safely ignore this email.

---
© 2026 OAAS. All rights reserved.
This is an automated message, please do not reply to this email.
  `.trim();
}

/**
 * Store verification data in localStorage
 */
export function storeVerificationData(userData: VerificationUser, token: string): void {
  const verificationData = {
    ...userData,
    verificationToken: token,
    verificationExpiresAt: calculateTokenExpiration(),
  };
  localStorage.setItem("pendingVerification", JSON.stringify(verificationData));
}

/**
 * Retrieve verification data from localStorage
 */
export function getVerificationData(): VerificationUser | null {
  const data = localStorage.getItem("pendingVerification");
  return data ? JSON.parse(data) : null;
}

/**
 * Clear verification data from localStorage
 */
export function clearVerificationData(): void {
  localStorage.removeItem("pendingVerification");
}

/**
 * Get verification status
 */
export function getVerificationStatus(userData: VerificationUser): VerificationStatus {
  if (!userData.verificationToken) {
    return "invalid";
  }

  if (userData.isVerified) {
    return "verified";
  }

  if (userData.verificationExpiresAt && isTokenExpired(userData.verificationExpiresAt)) {
    return "expired";
  }

  return "pending";
}

/**
 * Format time remaining for verification
 */
export function formatTimeRemaining(expiresAt: string): string {
  const now = new Date();
  const expires = new Date(expiresAt);
  const diff = expires.getTime() - now.getTime();

  if (diff <= 0) {
    return "Expired";
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  }

  return `${minutes}m remaining`;
}

/**
 * Validate verification token format
 */
export function isValidTokenFormat(token: string): boolean {
  return token.length === 32 && /^[a-zA-Z0-9]+$/.test(token);
}

/**
 * Validate verification code format
 */
export function isValidCodeFormat(code: string): boolean {
  return /^\d{6}$/.test(code);
}
