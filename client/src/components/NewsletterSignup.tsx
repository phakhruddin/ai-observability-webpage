import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Download, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface NewsletterSignupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewsletterSignup({ isOpen, onClose }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  // Email validation regex
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate email
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call (in production, this would send to your backend)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Store email (in production, send to backend/email service)
      console.log("Newsletter signup:", email);

      setIsSuccess(true);
      toast.success("Welcome to OpsNexAI! Check your email for resources.");

      // Reset form after 3 seconds
      setTimeout(() => {
        setEmail("");
        setIsSuccess(false);
        onClose();
      }, 3000);
    } catch (err) {
      setError("Failed to sign up. Please try again.");
      toast.error("Failed to sign up. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadResource = (resourceName: string, fileName: string) => {
    // In production, these would be actual file URLs
    const resourceUrls: Record<string, string> = {
      strategy: "/resources/STRATEGY.pdf",
      competitive: "/resources/COMPETITIVE_MATRIX.pdf",
      pricing: "/resources/PRICING_GUIDE.pdf",
    };

    const url = resourceUrls[resourceName];
    if (url) {
      // Create a temporary link and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`${fileName} downloaded!`);
    } else {
      toast.error("Resource not available");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Join the OpsNexAI Community
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-2">
            Get exclusive insights on AI observability trends, best practices, and product updates.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {!isSuccess ? (
            <>
              {/* Email Input Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground"
                      disabled={isSubmitting}
                    />
                  </div>
                  {error && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-accent text-accent-foreground hover:opacity-90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing up..." : "Get Free Resources"}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">Instant Access to</span>
                </div>
              </div>

              {/* Resource Downloads */}
              <div className="space-y-3">
                <div className="bg-background rounded-lg p-4 border border-border hover:border-accent transition-colors cursor-pointer"
                  onClick={() => downloadResource("strategy", "AI_Observability_Strategy.pdf")}
                >
                  <div className="flex items-start gap-3">
                    <Download className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">AI Observability Strategy</h4>
                      <p className="text-sm text-muted-foreground">Market analysis & competitive positioning</p>
                    </div>
                  </div>
                </div>

                <div className="bg-background rounded-lg p-4 border border-border hover:border-accent transition-colors cursor-pointer"
                  onClick={() => downloadResource("competitive", "Competitive_Matrix.pdf")}
                >
                  <div className="flex items-start gap-3">
                    <Download className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">Competitive Matrix</h4>
                      <p className="text-sm text-muted-foreground">Feature comparison across 5 platforms</p>
                    </div>
                  </div>
                </div>

                <div className="bg-background rounded-lg p-4 border border-border hover:border-accent transition-colors cursor-pointer"
                  onClick={() => downloadResource("pricing", "Pricing_Guide.pdf")}
                >
                  <div className="flex items-start gap-3">
                    <Download className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">Pricing & ROI Guide</h4>
                      <p className="text-sm text-muted-foreground">Cost analysis & financial projections</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Privacy Notice */}
              <p className="text-xs text-muted-foreground text-center">
                We respect your privacy. Unsubscribe anytime. See our{" "}
                <a href="#" className="text-accent hover:underline">
                  Privacy Policy
                </a>
              </p>
            </>
          ) : (
            /* Success State */
            <div className="text-center space-y-4 py-8">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Welcome to OpsNexAI!</h3>
                <p className="text-muted-foreground">
                  Check your email at <span className="font-semibold text-foreground">{email}</span> for your resources and first newsletter.
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                You'll receive weekly insights on AI observability, best practices, and product updates.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
