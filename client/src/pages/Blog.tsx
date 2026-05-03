import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, User, TrendingUp, Clock, AlertCircle, DollarSign, Home } from "lucide-react";
import { useLocation } from "wouter";

/**
 * OAAS Blog & Case Studies
 * 
 * Detailed case studies showcasing real SMB challenges, OAAS solutions,
 * and quantified business results.
 * 
 * Design: Dark theme with teal accents, content-focused aesthetic
 */

interface CaseStudyProps {
  title: string;
  company: string;
  industry: string;
  date: string;
  author: string;
  challenge: string;
  solution: string;
  results: Array<{
    metric: string;
    value: string;
    icon: React.ReactNode;
  }>;
  details: string[];
  quote: string;
  quoteAuthor: string;
  quoteRole: string;
}

function CaseStudyCard({ study }: { study: CaseStudyProps }) {
  const [, setLocation] = useLocation();

  return (
    <article className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {study.date}
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            {study.author}
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold">{study.title}</h1>

        <div className="flex flex-wrap gap-3">
          <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm">
            {study.company}
          </span>
          <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm">
            {study.industry}
          </span>
        </div>
      </div>

      {/* Challenge Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-accent" />
          The Challenge
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed">{study.challenge}</p>
      </div>

      {/* Solution Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-accent" />
          The Solution
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed">{study.solution}</p>

        <div className="space-y-3 mt-6">
          {study.details.map((detail, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center mt-1">
                <div className="w-2 h-2 rounded-full bg-accent" />
              </div>
              <p className="text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <DollarSign className="w-6 h-6 text-accent" />
          The Results
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          {study.results.map((result, idx) => (
            <Card key={idx} className="p-6 bg-card border-accent/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-accent">{result.icon}</div>
                <span className="text-sm text-muted-foreground">{result.metric}</span>
              </div>
              <div className="text-3xl font-bold text-accent">{result.value}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Quote Section */}
      <Card className="p-8 bg-accent/5 border-accent/20">
        <blockquote className="space-y-4">
          <p className="text-xl text-foreground italic">"{study.quote}"</p>
          <footer className="space-y-1">
            <p className="font-semibold">{study.quoteAuthor}</p>
            <p className="text-sm text-muted-foreground">{study.quoteRole}</p>
          </footer>
        </blockquote>
      </Card>

      {/* CTA */}
      <div className="pt-8 border-t border-accent/10">
        <Button
          size="lg"
          className="bg-accent hover:bg-accent/90 text-background"
          onClick={() => window.location.href = "/contact"}
        >
          Start Your Free Trial <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </article>
  );
}

export default function Blog() {
  const [, setLocation] = useLocation();

  const caseStudies: CaseStudyProps[] = [
    {
      title: "How TechStartup Reduced Alert Fatigue by 85%",
      company: "TechStartup Inc.",
      industry: "SaaS",
      date: "May 2026",
      author: "Sarah Chen",
      challenge: "TechStartup, a Series B SaaS company with 35 engineers, was drowning in CloudWatch alerts. Their DevOps team received an average of 400+ alerts daily across 15 microservices. The signal-to-noise ratio was catastrophic: only 5-10% of alerts indicated actual problems. The team spent 60% of their time triaging false positives instead of building features or improving infrastructure. This alert fatigue led to alert fatigue burnout, missed critical incidents, and delayed incident response times averaging 45 minutes.",
      solution: "TechStartup deployed OAAS to their AWS environment, connecting all CloudWatch log groups from their Lambda functions, ECS services, and RDS databases. OAAS immediately began correlating related errors, grouping repeated failures into single incidents, and using AI to suggest root causes. Within the first week, OAAS reduced alert volume by 75% by intelligently deduplicating and grouping related errors. The team configured Slack integration to receive AI-powered summaries of incidents directly in their #incidents channel, with suggested remediation steps.",
      results: [
        {
          metric: "Alert Reduction",
          value: "85%",
          icon: <AlertCircle className="w-6 h-6" />,
        },
        {
          metric: "MTTR Improvement",
          value: "70%",
          icon: <Clock className="w-6 h-6" />,
        },
        {
          metric: "Cost Savings",
          value: "$45K/year",
          icon: <DollarSign className="w-6 h-6" />,
        },
      ],
      details: [
        "Integrated OAAS with 15 CloudWatch log groups across Lambda, ECS, and RDS",
        "Configured Slack notifications with AI-powered incident summaries and root cause suggestions",
        "Set up daily digest emails for engineering leadership with trend analysis",
        "Reduced false positive alerts from 90% to 15% through intelligent grouping",
        "Improved incident response time from 45 minutes to 13 minutes average",
        "Freed up 25+ hours per week of DevOps team time for feature development",
      ],
      quote: "OAAS transformed our incident response. We went from drowning in alerts to actually understanding what's happening in production. Our team is happier, incidents are resolved faster, and we're shipping features again instead of fighting fires.",
      quoteAuthor: "Marcus Rodriguez",
      quoteRole: "VP Engineering, TechStartup Inc.",
    },
    {
      title: "DataFlow Analytics: From 2-Hour Outages to 5-Minute Resolution",
      company: "DataFlow Analytics",
      industry: "Data Engineering",
      date: "April 2026",
      author: "James Mitchell",
      challenge: "DataFlow Analytics, a 20-person data engineering startup, operated a complex Kubernetes cluster processing 500GB+ of data daily. Their observability stack was fragmented: logs scattered across CloudWatch, Kubernetes, and Datadog. When production issues occurred, engineers had to manually search through logs across three different systems, losing 30-45 minutes just gathering context. During a recent incident, a database connection pool leak went undetected for 2 hours, causing a complete service outage affecting 50+ customers. The incident response was chaotic, with no clear root cause analysis and no way to prevent similar issues.",
      solution: "DataFlow deployed OAAS with their Kubernetes cluster using the DaemonSet approach, collecting logs from all pods across their 10-node cluster. They also connected their CloudWatch logs for AWS-managed services. OAAS immediately began correlating errors across services, identifying patterns that humans would miss. When the database connection pool issue occurred again (in testing), OAAS detected the anomaly within 2 minutes, correlated it with increased database connection timeouts, and suggested the root cause with 95% confidence. The team received an AI-powered summary in Slack with the exact service, error pattern, and suggested fix.",
      results: [
        {
          metric: "MTTR",
          value: "5 min",
          icon: <Clock className="w-6 h-6" />,
        },
        {
          metric: "Incident Detection",
          value: "2 min",
          icon: <AlertCircle className="w-6 h-6" />,
        },
        {
          metric: "Annual Savings",
          value: "$120K",
          icon: <DollarSign className="w-6 h-6" />,
        },
      ],
      details: [
        "Deployed OAAS DaemonSet across 10-node Kubernetes cluster",
        "Integrated CloudWatch logs for RDS, ElastiCache, and Lambda functions",
        "Set up Slack alerts with AI-powered root cause analysis",
        "Configured daily digest with trend analysis and anomaly detection",
        "Reduced incident detection time from 45 minutes to 2 minutes",
        "Prevented estimated $120K in customer churn from reduced outages",
      ],
      quote: "Before OAAS, we were flying blind. Now we have AI helping us understand what's happening in production before it becomes a crisis. The 2-minute detection time has been a game-changer for our reliability.",
      quoteAuthor: "Priya Patel",
      quoteRole: "CTO, DataFlow Analytics",
    },
    {
      title: "FinTech Platform: Achieving 99.95% SLA with OAAS",
      company: "PaymentFlow",
      industry: "FinTech",
      date: "March 2026",
      author: "Elena Rodriguez",
      challenge: "PaymentFlow, a Series A fintech startup processing $50M+ in daily transactions, faced regulatory pressure to maintain 99.95% uptime SLA. Their observability setup relied on manual log reviews and reactive incident response. During peak trading hours, their API gateway and payment processing services generated 100,000+ log entries per minute. The team had no way to identify issues before they impacted customers. A single missed error pattern could result in transaction failures, regulatory violations, and customer trust erosion. The company needed proactive anomaly detection and sub-minute incident response.",
      solution: "PaymentFlow implemented OAAS across their entire payment processing infrastructure, connecting logs from API Gateway, payment processors, fraud detection services, and settlement engines. OAAS was configured with aggressive anomaly detection to flag unusual patterns in transaction failures, latency spikes, or error rate increases. Within the first week, OAAS detected a subtle increase in transaction timeout errors that would have gone unnoticed by manual monitoring. The AI identified the root cause as a database connection pool exhaustion in the settlement service. The team fixed it proactively, preventing a potential outage.",
      results: [
        {
          metric: "SLA Achievement",
          value: "99.97%",
          icon: <TrendingUp className="w-6 h-6" />,
        },
        {
          metric: "Proactive Detection",
          value: "95%",
          icon: <AlertCircle className="w-6 h-6" />,
        },
        {
          metric: "Prevented Losses",
          value: "$500K+",
          icon: <DollarSign className="w-6 h-6" />,
        },
      ],
      details: [
        "Integrated OAAS with payment processing, fraud detection, and settlement services",
        "Configured real-time anomaly detection for transaction failures and latency",
        "Set up Slack alerts with AI-powered root cause analysis for financial transactions",
        "Implemented daily compliance reports for regulatory requirements",
        "Achieved 95% proactive issue detection before customer impact",
        "Prevented estimated $500K+ in transaction failures and regulatory fines",
      ],
      quote: "In fintech, every second of downtime costs money and erodes customer trust. OAAS gives us the visibility and speed we need to maintain our SLA while scaling. The proactive detection has been invaluable.",
      quoteAuthor: "David Chen",
      quoteRole: "VP Operations, PaymentFlow",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-foreground">Blog</h1>
          <Button
            onClick={() => setLocation("/")}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Home
          </Button>
        </div>
      </div>

      {/* Header */}
      <section className="pt-32 pb-12 px-4 border-b border-accent/10">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Case Studies & Blog</h1>
          <p className="text-xl text-muted-foreground">
            Real stories from real SMBs. See how OAAS transformed their incident response and reduced operational costs.
          </p>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-16 px-4">
        <div className="container max-w-4xl mx-auto space-y-24">
          {caseStudies.map((study, idx) => (
            <div key={idx} className="scroll-mt-32" id={`case-study-${idx}`}>
              <CaseStudyCard study={study} />
              {idx < caseStudies.length - 1 && (
                <div className="mt-24 pt-24 border-t border-accent/10" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-accent/5 border-t border-accent/10">
        <div className="container max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Write Your Success Story?</h2>
          <p className="text-muted-foreground mb-8">
            Join hundreds of SMBs already using OAAS to reduce alert fatigue, improve MTTR, and cut operational costs.
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
              onClick={() => setLocation("/oaas")}
            >
              Learn About OAAS
            </Button>
          </div>
        </div>
      </section>

      {/* Blog Navigation */}
      <section className="py-12 px-4 border-t border-accent/10">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Quick Navigation</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {caseStudies.map((study, idx) => (
              <button
                key={idx}
                onClick={() => {
                  const element = document.getElementById(`case-study-${idx}`);
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
                className="p-4 rounded-lg border border-accent/20 hover:border-accent/40 hover:bg-accent/5 transition-colors text-left"
              >
                <h3 className="font-semibold text-sm mb-2">{study.company}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{study.title}</p>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
