import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, TrendingUp, Users, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { trackPageView, trackCTAClick, trackFeatureInteraction, trackModalOpen } from "@/lib/analytics";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { FeatureComparisonModal } from "@/components/FeatureComparisonModal";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { Footer } from "@/components/Footer";
import { InteractiveDemo } from "@/components/InteractiveDemo";
import { ROICalculator } from "@/components/ROICalculator";
import { NewsletterSignup } from "@/components/NewsletterSignup";

/**
 * Design Philosophy: Data-Driven Elegance
 * - Deep navy background with vibrant teal accents
 * - Asymmetric layout with alternating text/visualization
 * - Generous whitespace and micro-interactions
 * - Typography: Geist for headlines, Inter for body
 */

const marketData = [
  { year: 2024, value: 2.3, llm: 0.8, agent: 0.5, traditional: 1.0 },
  { year: 2025, value: 2.9, llm: 1.2, agent: 0.8, traditional: 0.9 },
  { year: 2026, value: 3.35, llm: 1.5, agent: 1.2, traditional: 0.65 },
];

const pricingData = [
  { tier: "Developer", price: "Free", users: "Individual", features: "Basic tracing" },
  { tier: "Professional", price: "$500-2K", users: "5-50 person", features: "Advanced features" },
  { tier: "Enterprise", price: "$10K+", users: "Large org", features: "Full suite" },
];

const competitiveData = [
  { name: "Arize", enterprise: 9, developer: 7, market: 35 },
  { name: "LangSmith", enterprise: 8, developer: 9, market: 25 },
  { name: "Langfuse", enterprise: 6, developer: 8, market: 20 },
  { name: "Braintrust", enterprise: 8, developer: 8, market: 20 },
];

const featureCategories = [
  {
    title: "Trace-Level Evaluation",
    description: "LLM-as-a-Judge scoring for hallucination detection, relevance, and safety assessment",
    icon: "🔍",
  },
  {
    title: "Context Graphs",
    description: "Visualize agent decision flows, tool interactions, and reasoning chains",
    icon: "🔗",
  },
  {
    title: "Cost Attribution",
    description: "Granular cost tracking per user, feature, and model with optimization recommendations",
    icon: "💰",
  },
  {
    title: "Prompt Management",
    description: "Version control, A/B testing, and integrated evaluation for production prompts",
    icon: "📝",
  },
  {
    title: "Real-time Guardrailing",
    description: "Block harmful outputs and prevent failures before they reach users",
    icon: "🛡️",
  },
  {
    title: "Privacy-First Architecture",
    description: "PII masking, local-first tracing, and compliance-ready audit trails",
    icon: "🔐",
  },
];

const roadmapPhases = [
  { quarter: "Q1", title: "MVP & Market Entry", items: ["Core tracing", "Basic evaluation", "Dashboards"] },
  { quarter: "Q2", title: "Developer Experience", items: ["SDKs", "Integrations", "Documentation"] },
  { quarter: "Q3", title: "Enterprise Features", items: ["SAML", "Audit logs", "Advanced alerting"] },
  { quarter: "Q4", title: "Differentiation", items: ["Real-time guardrailing", "Privacy features", "Multi-agent support"] },
];

function AnimatedCounter({ end, duration = 1500 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(end * progress));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return <span>{count}</span>;
}

export default function Home() {
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header with Logo */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663368978606/GWgqcpimJSVMFDBDwVraz6/opsnexai-logo-HLgEBJHg8vYg8ucjYTDx3j.webp"
              alt="OpsNexAI Logo"
              className="h-10 w-auto"
            />
          </div>
          <nav className="hidden md:flex gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-accent transition-colors">Features</a>
            <a href="#comparison" className="text-sm text-muted-foreground hover:text-accent transition-colors">Comparison</a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-accent transition-colors">Testimonials</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-accent transition-colors">Pricing</a>
            <a href="/oaas" className="text-sm text-muted-foreground hover:text-accent transition-colors">OAAS</a>
            <a href="/blog" className="text-sm text-muted-foreground hover:text-accent transition-colors">Blog</a>
            <a href="/free-trial" className="text-sm text-muted-foreground hover:text-accent transition-colors">Free Trial</a>
            <a href="/contact" className="text-sm text-muted-foreground hover:text-accent transition-colors">Contact</a>
          </nav>
          <Button
            size="sm"
            className="bg-accent text-accent-foreground hover:opacity-90"
            onClick={() => {
              trackCTAClick('Get Started Button', '/contact');
              const contactPage = document.querySelector('a[href="/contact"]') as HTMLAnchorElement;
              if (contactPage) {
                window.location.href = '/contact';
              }
            }}
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url('https://d2xsxph8kpxj0f.cloudfront.net/310519663368978606/GWgqcpimJSVMFDBDwVraz6/hero-background-WWrwgMERF55zewg286Z5bu.webp')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-6xl font-bold mb-6 leading-tight">
              The AI Observability Platform
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              As organizations transition from experimental AI deployments to production agentic systems, the demand for sophisticated observability tools is accelerating. The market is poised for rapid growth, with significant opportunities for differentiated platforms.
            </p>
            <div className="flex gap-4">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:opacity-90"
                onClick={() => {
                  trackCTAClick('Explore Strategy Button', '#comparison');
                  const comparisonSection = document.getElementById('comparison');
                  if (comparisonSection) {
                    comparisonSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Explore Strategy <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  trackCTAClick('View Market Data Button', '#market-data');
                  const marketSection = document.getElementById('market-data');
                  if (marketSection) {
                    marketSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                View Market Data
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="market-data" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-secondary p-8 border-border">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-muted-foreground text-sm mb-2">Market Size (2025)</p>
                  <p className="text-4xl font-bold text-accent">$2.9B</p>
                </div>
                <TrendingUp className="h-8 w-8 text-accent opacity-20" />
              </div>
              <p className="text-sm text-muted-foreground">Growing at 11.5% CAGR</p>
            </Card>

            <Card className="bg-secondary p-8 border-border">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-muted-foreground text-sm mb-2">Projected (2026)</p>
                  <p className="text-4xl font-bold text-accent">$3.35B</p>
                </div>
                <Zap className="h-8 w-8 text-accent opacity-20" />
              </div>
              <p className="text-sm text-muted-foreground">+15% year-over-year</p>
            </Card>

            <Card className="bg-secondary p-8 border-border">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-muted-foreground text-sm mb-2">Market Opportunity</p>
                  <p className="text-4xl font-bold text-accent">$150-330M</p>
                </div>
                <Users className="h-8 w-8 text-accent opacity-20" />
              </div>
              <p className="text-sm text-muted-foreground">5-10% market capture potential</p>
            </Card>
          </div>

          <div className="bg-secondary rounded-lg p-8 border border-border">
            <h2 className="text-3xl font-bold mb-8">Market Growth Trajectory</h2>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={marketData}>
                <defs>
                  <linearGradient id="colorLLM" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-chart-3)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-chart-3)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAgent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-chart-4)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-chart-4)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorTraditional" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-chart-5)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-chart-5)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="year" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" label={{ value: "Market Size ($B)", angle: -90, position: "insideLeft" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "0.5rem",
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="llm" stackId="1" stroke="var(--color-chart-3)" fillOpacity={1} fill="url(#colorLLM)" name="LLM Observability" />
                <Area type="monotone" dataKey="agent" stackId="1" stroke="var(--color-chart-4)" fillOpacity={1} fill="url(#colorAgent)" name="Agent Observability" />
                <Area type="monotone" dataKey="traditional" stackId="1" stroke="var(--color-chart-5)" fillOpacity={1} fill="url(#colorTraditional)" name="Traditional Observability" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Competitive Landscape */}
      <section id="comparison" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4">Competitive Landscape</h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
            The market features four major players with distinct positioning. Each has strengths, but significant gaps remain for differentiation.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-card rounded-lg p-8 border border-border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Platform Comparison</h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsComparisonModalOpen(true)}
                  className="text-accent border-accent hover:bg-accent/10"
                >
                  View Full Matrix
                </Button>
              </div>
              <div className="space-y-4">
                {[
                  { name: "Arize", focus: "Enterprise ML/CV + LLM", strength: "Context graphs, ADB" },
                  { name: "LangSmith", focus: "LangChain Ecosystem", strength: "Native integration" },
                  { name: "Langfuse", focus: "Open-source, Self-hostable", strength: "Lightweight, transparent" },
                  { name: "Braintrust", focus: "Performance-first", strength: "80x faster queries" },
                ].map((platform) => (
                  <div key={platform.name} className="border-l-2 border-accent pl-4 py-2">
                    <p className="font-semibold text-foreground">{platform.name}</p>
                    <p className="text-sm text-muted-foreground">{platform.focus}</p>
                    <p className="text-sm text-accent">✓ {platform.strength}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-lg p-8 border border-border">
              <h3 className="text-2xl font-bold mb-6">Strategic Gaps</h3>
              <div className="space-y-4">
                {[
                  "Real-time guardrailing & output filtering",
                  "Privacy-first architecture with PII masking",
                  "Multi-agent orchestration & coordination",
                  "Granular cost attribution & optimization",
                  "Integrated prompt A/B testing",
                ].map((gap, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-accent text-xs font-bold">{idx + 1}</span>
                    </div>
                    <p className="text-foreground">{gap}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Product Demo */}
      {/* ROI Calculator Section */}
      <ROICalculator />

      {/* Interactive Demo Section */}
      <InteractiveDemo />

      {/* Testimonials Section */}
      <div id="testimonials">
        <TestimonialsSection />
      </div>

      {/* Core Platform Features */}
      <section id="features" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4">Core Platform Features</h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
            A competitive AI observability platform must combine developer-friendly experience with enterprise-grade capabilities.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCategories.map((feature, idx) => (
              <Card key={idx} className="bg-secondary p-6 border-border hover:border-accent transition-colors">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Strategy */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4">Business Model & Pricing</h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
            Usage-based pricing with tiered tiers enables land-and-expand growth while maintaining profitability.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {pricingData.map((tier, idx) => (
              <Card key={idx} className="bg-card border-border p-8">
                <h3 className="text-2xl font-bold mb-2">{tier.tier}</h3>
                <p className="text-4xl font-bold text-accent mb-4">{tier.price}</p>
                <p className="text-sm text-muted-foreground mb-4">For: {tier.users}</p>
                <p className="text-sm">{tier.features}</p>
              </Card>
            ))}
          </div>

          <Card className="bg-secondary p-8 border-border">
            <h3 className="text-2xl font-bold mb-6">Revenue Projections</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Year 1 (Conservative)</p>
                <p className="text-3xl font-bold text-accent mb-2">$12M ARR</p>
                <p className="text-sm text-muted-foreground">500 customers, 70% gross margin</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm mb-2">Year 3 (Optimistic)</p>
                <p className="text-3xl font-bold text-accent mb-2">$180M ARR</p>
                <p className="text-sm text-muted-foreground">5,000 customers, 75% gross margin</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Implementation Roadmap */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4">12-Month Implementation Roadmap</h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
            A phased approach to market entry, developer adoption, enterprise expansion, and differentiation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roadmapPhases.map((phase, idx) => (
              <Card key={idx} className="bg-secondary border-border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
                    <span className="font-bold text-accent-foreground">{idx + 1}</span>
                  </div>
                  <h3 className="text-lg font-bold">{phase.quarter}</h3>
                </div>
                <p className="font-semibold mb-3">{phase.title}</p>
                <ul className="space-y-2">
                  {phase.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Insights */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12">Key Strategic Insights</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-card border-border p-8">
              <h3 className="text-2xl font-bold mb-4">Market Shift</h3>
              <p className="text-muted-foreground mb-4">
                The industry is transitioning from "Chatbot Era" (single input/output monitoring) to "Agent Era" (multi-step reasoning, tool orchestration, autonomous decision-making).
              </p>
              <p className="text-sm text-accent font-semibold">This creates massive opportunity for purpose-built tools.</p>
            </Card>

            <Card className="bg-card border-border p-8">
              <h3 className="text-2xl font-bold mb-4">Developer-First Wins</h3>
              <p className="text-muted-foreground mb-4">
                Platforms that prioritize developer experience (free tier, great SDKs, clear docs) achieve faster adoption and stronger community loyalty.
              </p>
              <p className="text-sm text-accent font-semibold">Land with developers, expand to enterprise.</p>
            </Card>

            <Card className="bg-card border-border p-8">
              <h3 className="text-2xl font-bold mb-4">Data as Moat</h3>
              <p className="text-muted-foreground mb-4">
                Platforms that retain traces as durable business assets (not ephemeral logs) enable continuous improvement through feedback loops.
              </p>
              <p className="text-sm text-accent font-semibold">Context graphs become competitive advantage.</p>
            </Card>

            <Card className="bg-card border-border p-8">
              <h3 className="text-2xl font-bold mb-4">Compliance Opportunity</h3>
              <p className="text-muted-foreground mb-4">
                Regulated industries (healthcare, finance) need privacy-first observability with PII masking and compliance audit trails.
              </p>
              <p className="text-sm text-accent font-semibold">Underserved segment with premium pricing.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Build the Future of AI Observability?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            The market is ready. The opportunity is clear. The time to act is now.
          </p>
            <div className="flex gap-4 justify-center flex-wrap">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:opacity-90"
                  onClick={() => {
                    trackModalOpen('Feature Comparison Modal');
                    setIsComparisonModalOpen(true);
                  }}
                >
                  View Feature Comparison
            </Button>
            <Button size="lg" variant="outline">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup CTA Section */}
      <section className="py-20 bg-card border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Stay Updated on AI Observability</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get exclusive insights, market trends, and product updates delivered to your inbox.
          </p>
          <Button
            size="lg"
            className="bg-accent text-accent-foreground hover:opacity-90"
            onClick={() => {
              trackModalOpen('Newsletter Signup Modal');
              setIsNewsletterOpen(true);
            }}
          >
            Get Free Resources <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Feature Comparison Modal */}
      <FeatureComparisonModal isOpen={isComparisonModalOpen} onClose={() => setIsComparisonModalOpen(false)} />

      {/* Newsletter Signup Modal */}
      <NewsletterSignup isOpen={isNewsletterOpen} onClose={() => setIsNewsletterOpen(false)} />

      {/* Professional Footer */}
      <Footer />
    </div>
  );
}
