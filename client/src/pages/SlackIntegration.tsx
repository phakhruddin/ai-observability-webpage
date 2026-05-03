import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Slack, Download, ExternalLink, Video } from "lucide-react";
import { trackPageView } from "@/lib/analytics";
import { trackSlackGuideStart, trackSlackBotSetup } from "@/lib/guideAnalytics";
import { SlackIntegrationGuide } from "@/components/SlackIntegrationGuide";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Footer } from "@/components/Footer";

/**
 * Slack Integration Page
 * 
 * Comprehensive guide for connecting OAAS to Slack workspace:
 * - Step-by-step bot setup
 * - Channel configuration
 * - Notification customization
 * - Troubleshooting and best practices
 * 
 * Design: Professional documentation page with dark theme
 */

export default function SlackIntegration() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    trackPageView("Slack Integration", "/slack-integration");
    trackSlackGuideStart();
  }, []);

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
            </a>
          </Link>

          <nav className="hidden md:flex gap-8">
            <Link href="/">
              <a className="text-sm text-muted-foreground hover:text-accent transition-colors">Home</a>
            </Link>
            <Link href="/oaas">
              <a className="text-sm text-muted-foreground hover:text-accent transition-colors">OAAS</a>
            </Link>
            <Link href="/integration-guides">
              <a className="text-sm text-muted-foreground hover:text-accent transition-colors">Guides</a>
            </Link>
            <Link href="/contact">
              <a className="text-sm text-muted-foreground hover:text-accent transition-colors">Contact</a>
            </Link>
          </nav>

          <Button
            size="sm"
            className="bg-accent text-accent-foreground hover:opacity-90"
            onClick={() => setLocation("/free-trial")}
          >
            Start Free Trial
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <Link href="/integration-guides">
            <a className="flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Integration Guides
            </a>
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm text-foreground">Slack Integration</span>
        </div>

        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
              <Slack className="w-8 h-8 text-accent" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Slack Integration Guide</h1>
              <p className="text-lg text-muted-foreground">
                Connect OAAS to your Slack workspace for real-time alerts and notifications
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="p-4 rounded-lg bg-card border border-border">
              <p className="text-sm text-muted-foreground mb-1">Setup Time</p>
              <p className="text-2xl font-bold text-accent">5 min</p>
            </div>
            <div className="p-4 rounded-lg bg-card border border-border">
              <p className="text-sm text-muted-foreground mb-1">Difficulty</p>
              <p className="text-2xl font-bold text-accent">Easy</p>
            </div>
            <div className="p-4 rounded-lg bg-card border border-border">
              <p className="text-sm text-muted-foreground mb-1">Support</p>
              <p className="text-2xl font-bold text-accent">24/7</p>
            </div>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="mb-12 p-6 rounded-lg bg-card border border-border">
          <h2 className="text-lg font-bold text-foreground mb-4">What You'll Learn</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <span className="text-accent font-bold">1</span>
              <div>
                <h3 className="font-semibold text-foreground">Bot Setup</h3>
                <p className="text-sm text-muted-foreground">Create and configure your Slack bot</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-accent font-bold">2</span>
              <div>
                <h3 className="font-semibold text-foreground">Channel Configuration</h3>
                <p className="text-sm text-muted-foreground">Set up dedicated alert channels</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-accent font-bold">3</span>
              <div>
                <h3 className="font-semibold text-foreground">Notification Customization</h3>
                <p className="text-sm text-muted-foreground">Tailor alerts to your team's needs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Video Walkthrough */}
        <div className="mb-12 p-8 rounded-lg bg-card border border-border">
          <div className="flex items-center gap-3 mb-6">
            <Video className="w-6 h-6 text-accent" />
            <h2 className="text-2xl font-bold text-foreground">Video Walkthrough</h2>
          </div>
          <VideoPlayer
            videoUrl="/manus-storage/slack-integration-walkthrough_bfb8a226.mp4"
            title="Slack Integration Setup - 5 Minutes"
            description="Watch this step-by-step video to learn how to connect your Slack workspace to OAAS for real-time alerts and notifications."
            duration="5:00"
          />
        </div>

        {/* Integration Guide Component */}
        <SlackIntegrationGuide />

        {/* Next Steps */}
        <div className="mt-12 p-8 rounded-lg bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20">
          <h2 className="text-2xl font-bold text-foreground mb-4">Next Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Ready to Connect?</h3>
              <p className="text-muted-foreground mb-4">
                Follow the guide above to set up Slack integration in 5 minutes.
              </p>
              <Button
              className="bg-accent text-accent-foreground hover:opacity-90"
              onClick={() => trackSlackBotSetup()}
            >
              <Slack className="w-4 h-4 mr-2" />
              Start Setup
            </Button>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Need Help?</h3>
              <p className="text-muted-foreground mb-4">
                Our support team is available 24/7 to help you get set up.
              </p>
              <Button
                variant="outline"
                onClick={() => setLocation("/contact")}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-12 p-8 rounded-lg bg-card border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-6">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a
              href="https://api.slack.com/apps"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-lg bg-background/50 border border-border/50 hover:border-accent/50 transition-colors"
            >
              <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                Slack App Directory
                <ExternalLink className="w-4 h-4" />
              </h3>
              <p className="text-sm text-muted-foreground">
                Create and manage your Slack apps
              </p>
            </a>

            <a
              href="https://docs.oaas.io/slack"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-lg bg-background/50 border border-border/50 hover:border-accent/50 transition-colors"
            >
              <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                OAAS Documentation
                <ExternalLink className="w-4 h-4" />
              </h3>
              <p className="text-sm text-muted-foreground">
                Full API reference and examples
              </p>
            </a>

            <a
              href="#"
              className="p-4 rounded-lg bg-background/50 border border-border/50 hover:border-accent/50 transition-colors"
            >
              <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download PDF Guide
              </h3>
              <p className="text-sm text-muted-foreground">
                Save this guide for offline reference
              </p>
            </a>

            <a
              href="#"
              className="p-4 rounded-lg bg-background/50 border border-border/50 hover:border-accent/50 transition-colors"
            >
              <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                Video Tutorial
                <ExternalLink className="w-4 h-4" />
              </h3>
              <p className="text-sm text-muted-foreground">
                Watch a 5-minute setup walkthrough
              </p>
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
