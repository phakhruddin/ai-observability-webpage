import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mail, Clock, CheckCircle, AlertCircle, Loader2, Copy } from "lucide-react";
import { toast } from "sonner";
import {
  formatTimeRemaining,
  isTokenExpired,
  generateVerificationEmail,
  type VerificationUser,
} from "@/lib/emailVerificationTypes";

/**
 * EmailVerificationPending Component
 * 
 * Displays email verification status and allows:
 * - Viewing verification email
 * - Entering verification code
 * - Resending verification email
 * - Copying verification code
 * 
 * Design: Professional verification interface with dark theme
 */

interface EmailVerificationPendingProps {
  userData: VerificationUser;
  onVerificationSuccess?: () => void;
  onResendEmail?: () => void;
}

export function EmailVerificationPending({
  userData,
  onVerificationSuccess,
  onResendEmail,
}: EmailVerificationPendingProps) {
  const [verificationCode, setVerificationCode] = useState("");
  const [timeRemaining, setTimeRemaining] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [showVerificationCode, setShowVerificationCode] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [canResend, setCanResend] = useState(true);

  // Mock verification code for demo
  const mockVerificationCode = "123456";

  useEffect(() => {
    // Update time remaining every second
    const interval = setInterval(() => {
      if (userData.verificationExpiresAt) {
        setTimeRemaining(formatTimeRemaining(userData.verificationExpiresAt));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [userData.verificationExpiresAt]);

  useEffect(() => {
    // Disable resend button for 60 seconds after sending
    if (!canResend) {
      const timer = setTimeout(() => {
        setCanResend(true);
      }, 60000);
      return () => clearTimeout(timer);
    }
  }, [canResend]);

  const isExpired = userData.verificationExpiresAt && isTokenExpired(userData.verificationExpiresAt);

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      toast.error("Please enter verification code");
      return;
    }

    if (verificationCode !== mockVerificationCode) {
      toast.error("Invalid verification code");
      return;
    }

    setIsVerifying(true);
    try {
      // Simulate verification process
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Store verified user data
      const verifiedUser = {
        ...userData,
        isVerified: true,
        verifiedAt: new Date().toISOString(),
      };
      localStorage.setItem("trialUser", JSON.stringify(verifiedUser));
      localStorage.removeItem("pendingVerification");

      toast.success("Email verified successfully!");
      onVerificationSuccess?.();
    } catch (error) {
      toast.error("Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      // Simulate sending email
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setResendCount((prev) => prev + 1);
      setCanResend(false);
      toast.success("Verification email sent!");
      onResendEmail?.();
    } catch (error) {
      toast.error("Failed to resend email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const copyVerificationCode = () => {
    navigator.clipboard.writeText(mockVerificationCode);
    toast.success("Verification code copied!");
  };

  const maskEmail = (email: string) => {
    const [name, domain] = email.split("@");
    const maskedName = name.substring(0, 2) + "*".repeat(Math.max(0, name.length - 4)) + name.substring(name.length - 2);
    return `${maskedName}@${domain}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-accent/20">
              <Mail className="w-8 h-8 text-accent" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Verify Your Email</h1>
          <p className="text-muted-foreground">
            We've sent a verification code to <span className="font-semibold text-foreground">{maskEmail(userData.email)}</span>
          </p>
        </div>

        {/* Main Card */}
        <Card className="p-6 border-border bg-card space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-foreground">Time Remaining</span>
            </div>
            <span className={`text-sm font-mono ${isExpired ? "text-destructive" : "text-accent"}`}>
              {timeRemaining}
            </span>
          </div>

          {/* Verification Code Display */}
          {showVerificationCode && (
            <div className="p-4 rounded-lg bg-accent/10 border border-accent/30 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground">Your verification code:</p>
              <div className="flex items-center justify-between gap-2">
                <code className="text-2xl font-mono font-bold text-accent tracking-widest">
                  {mockVerificationCode}
                </code>
                <Button
                  onClick={copyVerificationCode}
                  variant="ghost"
                  size="sm"
                  className="flex-shrink-0"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Verification Code Input */}
          <div className="space-y-2">
            <label htmlFor="code" className="text-sm font-medium text-foreground">
              Enter Verification Code
            </label>
            <Input
              id="code"
              type="text"
              placeholder="000000"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              maxLength={6}
              className="bg-background border-border text-center text-2xl font-mono tracking-widest"
              disabled={isVerifying || !!isExpired}
            />
            <p className="text-xs text-muted-foreground">
              Enter the 6-digit code from your email
            </p>
          </div>

          {/* Toggle Show Code */}
          <Button
            onClick={() => setShowVerificationCode(!showVerificationCode)}
            variant="ghost"
            size="sm"
            className="w-full text-accent hover:text-accent/90"
          >
            {showVerificationCode ? "Hide" : "Show"} Verification Code
          </Button>

          {/* Verify Button */}
          <Button
            onClick={handleVerifyCode}
              disabled={isVerifying || !!isExpired || verificationCode.length !== 6}
            className="w-full bg-accent text-accent-foreground hover:opacity-90 flex items-center justify-center gap-2"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Verify Email
              </>
            )}
          </Button>

          {/* Resend Section */}
          <div className="pt-4 border-t border-border space-y-3">
            <p className="text-sm text-muted-foreground text-center">
              Didn't receive the code?
            </p>
            <Button
              onClick={handleResendEmail}
              disabled={isResending || !canResend || !!isExpired}
              variant="outline"
              className="w-full"
            >
              {isResending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Sending...
                </>
              ) : !canResend ? (
                "Resend in 60 seconds"
              ) : (
                "Resend Verification Code"
              )}
            </Button>
            {resendCount > 0 && (
              <p className="text-xs text-muted-foreground text-center">
                Code resent {resendCount} {resendCount === 1 ? "time" : "times"}
              </p>
            )}
          </div>

          {/* Error State */}
          {isExpired && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
              <div className="text-sm text-destructive">
                <p className="font-semibold">Verification code expired</p>
                <p className="text-xs mt-1">Please request a new code</p>
              </div>
            </div>
          )}
        </Card>

        {/* Help Text */}
        <div className="text-center text-xs text-muted-foreground space-y-2">
          <p>Check your spam folder if you don't see the email</p>
          <p>Having trouble? <a href="/contact" className="text-accent hover:underline">Contact support</a></p>
        </div>
      </div>
    </div>
  );
}
