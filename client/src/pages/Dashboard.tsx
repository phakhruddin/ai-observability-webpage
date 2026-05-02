import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { LogOut, Settings, Bell, HelpCircle } from "lucide-react";
import { trackPageView } from "@/lib/analytics";
import { trackDashboardView, trackUpgradeClick } from "@/lib/dashboardAnalytics";
import { TrialDashboard } from "@/components/TrialDashboard";
import { Footer } from "@/components/Footer";

/**
 * Trial Dashboard Page
 * 
 * Displays comprehensive metrics for trial users:
 * - Real-time usage metrics
 * - Log volume and alert trends
 * - Integration status
 * - Trial progress
 * - Estimated value/savings
 * - Personalized recommendations
 * 
 * Design: Professional SaaS dashboard with dark theme and teal accents
 */

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [userName, setUserName] = useState("John Doe");
  const [userEmail, setUserEmail] = useState("john@example.com");

  useEffect(() => {
    trackPageView("Trial Dashboard", "/dashboard");
    trackDashboardView();
    
    // In production, fetch user data from backend
    // For now, we'll use localStorage or props
    const storedName = localStorage.getItem("trialUserName") || "John Doe";
    const storedEmail = localStorage.getItem("trialUserEmail") || "john@example.com";
    setUserName(storedName);
    setUserEmail(storedEmail);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("trialUserName");
    localStorage.removeItem("trialUserEmail");
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663368978606/GWgqcpimJSVMFDBDwVraz6/opsnexai-logo-HLgEBJHg8vYg8ucjYTDx3j.webp"
                alt="OpsNexAI Logo"
                className="h-10 w-auto"
              />
              <span className="font-semibold text-foreground hidden sm:inline">Dashboard</span>
            </a>
          </Link>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-background rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-background rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <HelpCircle className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-background rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <Settings className="w-5 h-5" />
            </button>
            <div className="h-8 w-px bg-border" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-foreground">{userName}</p>
                <p className="text-xs text-muted-foreground">{userEmail}</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Trial Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Monitor your OAAS usage and see the value in real-time
          </p>
        </div>

        {/* Dashboard Content */}
        <TrialDashboard />

        {/* CTA Section */}
        <div className="mt-12 p-8 rounded-lg bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">Ready to Go Live?</h3>
              <p className="text-muted-foreground">
                Your trial is demonstrating clear value. Upgrade to a paid plan to continue monitoring after day 14.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
            <Button
              variant="outline"
              onClick={() => {
                trackUpgradeClick("Talk to Sales");
                setLocation("/contact");
              }}
            >
              Talk to Sales
            </Button>
            <Button
              className="bg-accent text-accent-foreground hover:opacity-90"
              onClick={() => {
                trackUpgradeClick("View Pricing");
                setLocation("/pricing");
              }}
            >
              View Pricing
            </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
