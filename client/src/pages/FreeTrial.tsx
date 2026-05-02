import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Clock, Zap, Lock, BarChart3, Users } from "lucide-react";
import { trackPageView } from "@/lib/analytics";
import { FreeTrialForm } from "@/components/FreeTrialForm";
import { Footer } from "@/components/Footer";

/**
 * Free Trial Page
 * 
 * Design Philosophy: Data-Driven Elegance
 * - Deep navy background with vibrant teal accents
 * - Asymmetric layout with benefits showcase and form
 * - Generous whitespace and clear value proposition
 */

const benefits = [
  {
    icon: <Clock className="h-6 w-6 text-accent" />,
    title: "14-Day Free Trial",
    description: "Full access to all OAAS features. No credit card required.",
  },
  {
    icon: <Zap className="h-6 w-6 text-accent" />,
    title: "Instant Setup",
    description: "Connect your data sources in minutes with pre-built integrations.",
  },
  {
    icon: <BarChart3 className="h-6 w-6 text-accent" />,
    title: "Real-time Insights",
    description: "Start monitoring and analyzing logs immediately after setup.",
  },
  {
    icon: <Lock className="h-6 w-6 text-accent" />,
    title: "Enterprise Security",
    description: "SOC 2 Type II certified with end-to-end encryption.",
  },
  {
    icon: <Users className="h-6 w-6 text-accent" />,
    title: "Dedicated Support",
    description: "Access to our support team and onboarding specialists.",
  },
  {
    icon: <CheckCircle2 className="h-6 w-6 text-accent" />,
    title: "No Commitment",
    description: "Cancel anytime. Keep your data and insights.",
  },
];

const features = [
  "Unlimited log ingestion during trial period",
  "Real-time alerting and anomaly detection",
  "Custom dashboards and visualizations",
  "Integration with 50+ data sources",
  "Team collaboration and RBAC",
  "API access for automation",
];

export default function FreeTrial() {
  useEffect(() => {
    trackPageView("Free Trial", "/free-trial");
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Navigation */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <a href="/" className="flex items-center gap-2 font-bold text-xl text-accent">
            OpsNexAI
          </a>
          <nav className="hidden md:flex gap-8">
            <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Home
            </a>
            <a href="/oaas" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              OAAS
            </a>
            <a href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20 border-b border-border">
        <div className="container">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Start Observing AI Systems Today
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Get 14 days of free access to OpsNexAI's Observability-as-a-Service platform. No credit card required. 
              Full access to all features for SMBs and enterprises.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column: Benefits and Features */}
            <div className="lg:col-span-1 space-y-12">
              {/* Benefits Grid */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-foreground">What's Included</h2>
                <div className="space-y-4">
                  {benefits.map((benefit, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">{benefit.icon}</div>
                      <div>
                        <h3 className="font-semibold text-foreground text-sm">{benefit.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features List */}
              <div>
                <h3 className="text-lg font-bold mb-4 text-foreground">Trial Features</h3>
                <ul className="space-y-3">
                  {features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trust Indicators */}
              <Card className="bg-card border-border p-6">
                <h3 className="font-semibold text-foreground mb-4">Trusted by Teams</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Teams</p>
                    <p className="text-2xl font-bold text-accent">500+</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Uptime SLA</p>
                    <p className="text-2xl font-bold text-accent">99.9%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Customer Rating</p>
                    <p className="text-2xl font-bold text-accent">4.8/5</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column: Form */}
            <div className="lg:col-span-2">
              <Card className="bg-card border-border p-8">
                <h2 className="text-2xl font-bold mb-2 text-foreground">Start Your Free Trial</h2>
                <p className="text-muted-foreground mb-8">
                  Fill out the form below to get started. We'll help you set up your first data source.
                </p>
                <FreeTrialForm />
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-20 bg-card/50 border-t border-border">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8 text-foreground">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Do I need a credit card?</h3>
              <p className="text-sm text-muted-foreground">
                No, we don't require a credit card for the free trial. You can start immediately after signing up.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">How long is the trial?</h3>
              <p className="text-sm text-muted-foreground">
                Your free trial lasts 14 days with full access to all OAAS features. We'll remind you before it expires.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Can I extend the trial?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, contact our sales team to discuss your needs. We can often extend trials for qualified leads.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">What happens after the trial?</h3>
              <p className="text-sm text-muted-foreground">
                You can choose to upgrade to a paid plan or cancel. Your data remains accessible during the trial.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Is there a setup fee?</h3>
              <p className="text-sm text-muted-foreground">
                No setup fees. We provide guided onboarding to help you get started quickly.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Do you offer support?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, trial users get access to our support team and onboarding specialists.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 border-t border-border">
        <div className="container text-center">
          <h2 className="text-2xl font-bold mb-4 text-foreground">Ready to Transform Your Observability?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of teams already using OpsNexAI to monitor and optimize their AI systems.
          </p>
          <a
            href="#free-trial-form"
            className="inline-block px-8 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Start Free Trial Now
          </a>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
