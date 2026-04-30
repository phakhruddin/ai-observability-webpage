import { Card } from "@/components/ui/card";
import { Star, TrendingDown, Clock, DollarSign } from "lucide-react";

const oaasTestimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "DevOps Lead",
    company: "TechStartup Inc.",
    industry: "SaaS",
    quote: "OAAS reduced our alert fatigue by 85%. We went from 200+ daily alerts to just 15 actionable ones. Our team can finally focus on real incidents instead of noise.",
    metrics: {
      alertReduction: "85%",
      mttrImprovement: "60%",
      costSavings: "$45K/year"
    },
    avatar: "👩‍💼"
  },
  {
    id: 2,
    name: "Marcus Johnson",
    role: "Engineering Manager",
    company: "CloudScale Systems",
    industry: "Cloud Infrastructure",
    quote: "The Slack integration is a game-changer. Our team gets incident summaries directly in Slack with root cause suggestions. No more digging through dashboards at 3 AM.",
    metrics: {
      mttrImprovement: "70%",
      setupTime: "< 2 hours",
      teamAdoption: "100%"
    },
    avatar: "👨‍💼"
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "CTO",
    company: "DataFlow Analytics",
    industry: "Data Engineering",
    quote: "We replaced three expensive observability tools with OAAS. The AI-powered analysis is incredibly accurate, and our DevOps team loves the simplicity.",
    metrics: {
      costSavings: "$120K/year",
      toolsConsolidated: "3",
      setupComplexity: "Minimal"
    },
    avatar: "👩‍💻"
  },
  {
    id: 4,
    name: "David Park",
    role: "SRE",
    company: "FinTech Innovations",
    industry: "Financial Services",
    quote: "OAAS's pattern grouping is brilliant. It automatically correlates related errors across services, saving us hours of manual investigation every week.",
    metrics: {
      investigationTimeReduction: "75%",
      falsePositiveReduction: "90%",
      incidentResolution: "4x faster"
    },
    avatar: "👨‍🔬"
  }
];

export function OAASTestimonials() {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold mb-4">Trusted by Engineering Teams</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how teams are transforming their incident response with OAAS
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {oaasTestimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-8 border-border/50 hover:border-accent/50 transition-colors">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div>
                    <h3 className="font-semibold text-foreground">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-xs text-muted-foreground/70">{testimonial.company}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-accent text-accent" />
                  ))}
                </div>
              </div>

              {/* Quote */}
              <p className="text-foreground mb-6 italic">"{testimonial.quote}"</p>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border/30">
                {Object.entries(testimonial.metrics).map(([key, value]) => {
                  let icon = null;
                  let label = key.replace(/([A-Z])/g, ' $1').trim();
                  
                  if (key.includes('Reduction') || key.includes('Improvement') || key.includes('Savings')) {
                    icon = <TrendingDown size={16} className="text-accent" />;
                  } else if (key.includes('Time')) {
                    icon = <Clock size={16} className="text-accent" />;
                  } else if (key.includes('Cost')) {
                    icon = <DollarSign size={16} className="text-accent" />;
                  }

                  return (
                    <div key={key} className="flex items-start gap-2">
                      {icon && <div className="mt-1">{icon}</div>}
                      <div>
                        <p className="text-sm font-semibold text-accent">{value}</p>
                        <p className="text-xs text-muted-foreground">{label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="bg-card border border-border/50 rounded-lg p-12">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-accent mb-2">500+</p>
              <p className="text-muted-foreground">Active Teams</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-accent mb-2">99.9%</p>
              <p className="text-muted-foreground">Uptime SLA</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-accent mb-2">$2.5M</p>
              <p className="text-muted-foreground">Saved Annually</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-accent mb-2">4.8/5</p>
              <p className="text-muted-foreground">Average Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
