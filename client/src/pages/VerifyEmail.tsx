import { useEffect } from "react";
import { useLocation } from "wouter";
import { EmailVerificationPending } from "@/components/EmailVerificationPending";
import { getVerificationData } from "@/lib/emailVerificationTypes";
import { trackPageView } from "@/lib/analytics";
import { trackVerificationPageView } from "@/lib/emailVerificationAnalytics";

/**
 * Verify Email Page
 * 
 * Displays email verification interface for users
 * 
 * Design: Professional verification page with dark theme
 */

export default function VerifyEmail() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    trackPageView("Email Verification", "/verify-email");
    trackVerificationPageView("pending");

    // Check if user has pending verification
    const userData = getVerificationData();
    if (!userData) {
      // Redirect to free trial if no pending verification
      setLocation("/free-trial");
    }
  }, [setLocation]);

  const userData = getVerificationData();

  if (!userData) {
    return null;
  }

  const handleVerificationSuccess = () => {
    // Redirect to dashboard after successful verification
    setLocation("/dashboard");
  };

  const handleResendEmail = () => {
    // In production, this would call the backend to resend the email
    console.log("Resending verification email to:", userData.email);
  };

  return (
    <EmailVerificationPending
      userData={userData}
      onVerificationSuccess={handleVerificationSuccess}
      onResendEmail={handleResendEmail}
    />
  );
}
