import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Zap, AlertCircle, TrendingUp, MessageSquare, Clock, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";
import { OAASTestimonials } from "@/components/OAASTestimonials";

/**
 * OAAS Product Page
 * 
 * Showcases OAAS (Observability-as-a-Service) as a key product offering
 * within the OpsNexAI platform. Highlights AI-powered log analysis for SMBs.
 * 
 * Design: Dark theme with teal accents, professional tech aesthetic
 */
export default function OAAS() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 px-4">
        <div
          className="absolute inset-0 -z-10 opacity-20"
          style={{
            backgroundImage: `url('https://d2xsxph8kpxj0f.cloudfront.net/310519663368978606/GWgqcpimJSVMFDBDwVraz6/oaas-hero-background-gVu6NcGw5CuzdoLFeQpz6p.webp')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="container max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">AI-Powered Log Analysis</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            OAAS: AI DevOps Assistant
            <br />
            <span className="text-accent">That Explains Your Logs</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Stop drowning in logs. OAAS transforms chaotic log streams into actionable insights, 
            delivered directly to Slack. No dashboards. No complexity. Just answers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-background"
              onClick={() => setLocation("/contact")}
            >
              Schedule Demo <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                const element = document.getElementById("features");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Learn More
            </Button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-6 mt-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">80%</div>
              <p className="text-sm text-muted-foreground">Alert Noise Reduction</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">5min</div>
              <p className="text-sm text-muted-foreground">Time to Insight</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">$29/mo</div>
              <p className="text-sm text-muted-foreground">Starting Price</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 bg-card/50">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">The Problem SMBs Face</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6 border-border/50 bg-background/50">
              <AlertCircle className="w-8 h-8 text-accent mb-4" />
              <h3 className="text-lg font-semibold mb-2">Alert Fatigue</h3>
              <p className="text-muted-foreground">
                Hundreds of alerts daily, but you can't tell which ones matter. Your team spends hours triaging noise instead of fixing issues.
              </p>
            </Card>

            <Card className="p-6 border-border/50 bg-background/50">
              <Clock className="w-8 h-8 text-accent mb-4" />
              <h3 className="text-lg font-semibold mb-2">Slow Root Cause Analysis</h3>
              <p className="text-muted-foreground">
                When incidents happen, you're manually searching through thousands of log lines to understand what went wrong.
              </p>
            </Card>

            <Card className="p-6 border-border/50 bg-background/50">
              <TrendingUp className="w-8 h-8 text-accent mb-4" />
              <h3 className="text-lg font-semibold mb-2">Expensive Tools</h3>
              <p className="text-muted-foreground">
                Enterprise observability platforms cost thousands/month and require dedicated DevOps expertise to operate.
              </p>
            </Card>

            <Card className="p-6 border-border/50 bg-background/50">
              <MessageSquare className="w-8 h-8 text-accent mb-4" />
              <h3 className="text-lg font-semibold mb-2">Scattered Logs</h3>
              <p className="text-muted-foreground">
                Logs are spread across CloudWatch, Kubernetes, containers, and app services. No unified view of what's happening.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center">How OAAS Works</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            OAAS combines pattern recognition, anomaly detection, and AI analysis to transform raw logs into actionable insights.
          </p>

          {/* Feature Image */}
          <div className="mb-12 rounded-lg overflow-hidden border border-border/50">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663368978606/GWgqcpimJSVMFDBDwVraz6/oaas-log-analysis-3aWfYXdtMfAXnGLUU8YYTd.webp"
              alt="OAAS Log Analysis Workflow"
              className="w-full h-auto"
            />
          </div>

          {/* Core Features */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="p-6 border-border/50 bg-background/50">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">AI Log Summarization</h3>
                  <p className="text-sm text-muted-foreground">
                    Convert high-volume logs into short, readable incident summaries with context and severity.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-border/50 bg-background/50">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Alert Noise Reduction</h3>
                  <p className="text-sm text-muted-foreground">
                    Group repeated errors into single incidents. Reduce 500 alerts to 1 actionable notification.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-border/50 bg-background/50">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Root Cause Suggestions</h3>
                  <p className="text-sm text-muted-foreground">
                    AI-powered analysis with confidence levels, evidence, and suggested next steps.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-border/50 bg-background/50">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Slack-First Workflow</h3>
                  <p className="text-sm text-muted-foreground">
                    Incident alerts, daily digests, and insights delivered directly to Slack. No context switching.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-border/50 bg-background/50">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Daily Digest</h3>
                  <p className="text-sm text-muted-foreground">
                    Executive summary of incidents, trends, and recommended actions. Perfect for managers and founders.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-border/50 bg-background/50">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">CloudWatch Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect AWS CloudWatch logs in minutes. Kubernetes and container support coming soon.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Slack Integration Section */}
      <section className="py-20 px-4 bg-card/50">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Slack-First Incident Management</h2>

          <div className="rounded-lg overflow-hidden border border-border/50 mb-8">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663368978606/GWgqcpimJSVMFDBDwVraz6/oaas-slack-integration-a8c3RLdLWuJGqjUnXzyo3k.webp"
              alt="OAAS Slack Integration"
              className="w-full h-auto"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 border-border/50 bg-background/50">
              <h3 className="font-semibold mb-2">Real-Time Alerts</h3>
              <p className="text-sm text-muted-foreground">
                Get notified instantly when incidents occur. Severity levels help you prioritize.
              </p>
            </Card>

            <Card className="p-6 border-border/50 bg-background/50">
              <h3 className="font-semibold mb-2">Evidence-Based Insights</h3>
              <p className="text-sm text-muted-foreground">
                Each alert includes root cause suggestions backed by actual log patterns and metrics.
              </p>
            </Card>

            <Card className="p-6 border-border/50 bg-background/50">
              <h3 className="font-semibold mb-2">Actionable Next Steps</h3>
              <p className="text-sm text-muted-foreground">
                Clear recommendations on what to check first and how to resolve the issue.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center">Simple, Predictable Pricing</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            No surprise bills. No per-log charges. Just straightforward monthly pricing.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-8 border-border/50 bg-background/50">
              <h3 className="text-lg font-semibold mb-2">Starter</h3>
              <div className="text-3xl font-bold text-accent mb-4">$29<span className="text-sm text-muted-foreground">/mo</span></div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  1 AWS account
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Up to 100GB logs/month
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Daily digest
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Slack alerts
                </li>
              </ul>
              <Button className="w-full bg-accent hover:bg-accent/90 text-background">
                Get Started
              </Button>
            </Card>

            <Card className="p-8 border-accent/50 bg-accent/5 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-accent text-background text-xs font-semibold rounded-full">
                Most Popular
              </div>
              <h3 className="text-lg font-semibold mb-2">Growth</h3>
              <div className="text-3xl font-bold text-accent mb-4">$99<span className="text-sm text-muted-foreground">/mo</span></div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Unlimited accounts
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Up to 1TB logs/month
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Email digests
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  API access
                </li>
              </ul>
              <Button className="w-full bg-accent hover:bg-accent/90 text-background">
                Get Started
              </Button>
            </Card>

            <Card className="p-8 border-border/50 bg-background/50">
              <h3 className="text-lg font-semibold mb-2">Enterprise</h3>
              <div className="text-3xl font-bold text-accent mb-4">Custom</div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Unlimited everything
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Dedicated support
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Custom integrations
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  SLA guarantee
                </li>
              </ul>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => setLocation("/contact")}
              >
                Contact Sales
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <OAASTestimonials />

      {/* CTA Section */}
      <section className="py-20 px-4 bg-accent/10 border-t border-accent/20">
        <div className="container max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Reduce Alert Noise?</h2>
          <p className="text-muted-foreground mb-8">
            Start your free trial today. No credit card required. See how OAAS can transform your incident response.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-background"
              onClick={() => setLocation("/contact")}
            >
              Start Free Trial <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setLocation("/contact")}
            >
              Schedule Demo
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setLocation("/integration-guides")}
            >
              View Setup Guides
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
