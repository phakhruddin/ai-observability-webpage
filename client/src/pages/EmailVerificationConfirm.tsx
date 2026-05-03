import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import {
  getVerificationData,
  isTokenExpired,
  isValidTokenFormat,
  clearVerificationData,
  type VerificationUser,
} from "@/lib/emailVerificationTypes";
import { trackPageView } from "@/lib/analytics";

/**
 * Email Verification Confirmation Page
 * 
 * Handles verification token validation and redirects to dashboard
 * 
 * Design: Professional confirmation interface with dark theme
 */

type VerificationState = "loading" | "success" | "error" | "expired";

export default function EmailVerificationConfirm() {
  const [, setLocation] = useLocation();
  const [state, setState] = useState<VerificationState>("loading");
  const [userData, setUserData] = useState<VerificationUser | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  useEffect(() => {
    trackPageView("Email Verification Confirm", "/verify-email-confirm");
    verifyEmail();
  }, []);

  useEffect(() => {
    if (state === "success" && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (state === "success" && redirectCountdown === 0) {
      setLocation("/dashboard");
    }
  }, [state, redirectCountdown, setLocation]);

  const verifyEmail = async () => {
    try {
      // Get verification data from localStorage
      const data = getVerificationData();

      if (!data) {
        setState("error");
        toast.error("No pending verification found");
        return;
      }

      // Check if token is valid format
      if (!data.verificationToken || !isValidTokenFormat(data.verificationToken)) {
        setState("error");
        toast.error("Invalid verification token");
        return;
      }

      // Check if token is expired
      if (data.verificationExpiresAt && isTokenExpired(data.verificationExpiresAt)) {
        setState("expired");
        toast.error("Verification token has expired");
        return;
      }

      // Simulate verification process
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mark as verified
      const verifiedUser: VerificationUser = {
        ...data,
        isVerified: true,
        verifiedAt: new Date().toISOString(),
      };

      // Store verified user data
      localStorage.setItem("trialUser", JSON.stringify(verifiedUser));
      localStorage.setItem("trialUserName", verifiedUser.name);
      localStorage.setItem("trialUserEmail", verifiedUser.email);

      // Clear pending verification
      clearVerificationData();

      setUserData(verifiedUser);
      setState("success");
      toast.success("Email verified successfully!");
    } catch (error) {
      console.error("Verification error:", error);
      setState("error");
      toast.error("Verification failed. Please try again.");
    }
  };

  const handleRetry = () => {
    setState("loading");
    verifyEmail();
  };

  const handleGoToDashboard = () => {
    setLocation("/dashboard");
  };

  const handleResendEmail = () => {
    setLocation("/verify-email");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Loading State */}
        {state === "loading" && (
          <Card className="p-8 border-border bg-card text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-accent/20 animate-pulse">
                <Loader2 className="w-8 h-8 text-accent animate-spin" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Verifying Email</h1>
              <p className="text-muted-foreground">
                Please wait while we verify your email address...
              </p>
            </div>
          </Card>
        )}

        {/* Success State */}
        {state === "success" && userData && (
          <Card className="p-8 border-border bg-card text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-accent/20">
                <CheckCircle className="w-8 h-8 text-accent" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Email Verified!</h1>
              <p className="text-muted-foreground">
                Welcome to OAAS, <span className="font-semibold text-foreground">{userData.name}</span>!
              </p>
              <p className="text-sm text-muted-foreground">
                Your email has been successfully verified. Redirecting to your dashboard...
              </p>
            </div>

            <div className="pt-4 space-y-3">
              <div className="p-3 rounded-lg bg-background/50 border border-border">
                <p className="text-sm text-muted-foreground">
                  Redirecting in <span className="font-mono font-bold text-accent">{redirectCountdown}s</span>
                </p>
              </div>

              <Button
                onClick={handleGoToDashboard}
                className="w-full bg-accent text-accent-foreground hover:opacity-90 flex items-center justify-center gap-2"
              >
                Go to Dashboard Now
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Trial Info */}
            <div className="pt-4 border-t border-border space-y-3 text-left">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Trial Information</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Company:</span>
                  <span className="font-medium text-foreground">{userData.company}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Company Size:</span>
                  <span className="font-medium text-foreground">{userData.companySize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Log Volume:</span>
                  <span className="font-medium text-foreground">{userData.logVolume}</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Error State */}
        {state === "error" && (
          <Card className="p-8 border-border bg-card text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-destructive/20">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Verification Failed</h1>
              <p className="text-muted-foreground">
                We couldn't verify your email. Please try again or request a new verification code.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleRetry}
                className="w-full bg-accent text-accent-foreground hover:opacity-90"
              >
                Try Again
              </Button>
              <Button
                onClick={handleResendEmail}
                variant="outline"
                className="w-full"
              >
                Request New Code
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Having trouble? <a href="/contact" className="text-accent hover:underline">Contact support</a>
            </p>
          </Card>
        )}

        {/* Expired State */}
        {state === "expired" && (
          <Card className="p-8 border-border bg-card text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-destructive/20">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Verification Expired</h1>
              <p className="text-muted-foreground">
                Your verification code has expired. Please request a new one.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleResendEmail}
                className="w-full bg-accent text-accent-foreground hover:opacity-90"
              >
                Request New Code
              </Button>
              <Button
                onClick={() => setLocation("/")}
                variant="outline"
                className="w-full"
              >
                Back to Home
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Having trouble? <a href="/contact" className="text-accent hover:underline">Contact support</a>
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
