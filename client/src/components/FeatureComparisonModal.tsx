import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Check } from "lucide-react";
import { useState } from "react";

/**
 * Feature Comparison Modal Component
 * Displays interactive comparison of AI observability platforms
 * Design: Data-driven elegance with clear visual hierarchy
 */

interface ComparisonFeature {
  category: string;
  feature: string;
  yourPlatform: string | boolean;
  arize: string | boolean;
  langsmith: string | boolean;
  langfuse: string | boolean;
  braintrust: string | boolean;
  description?: string;
}

const comparisonData: ComparisonFeature[] = [
  // Core Tracing & Observability
  {
    category: "Core Tracing",
    feature: "OpenTelemetry Support",
    yourPlatform: "Native",
    arize: "Native",
    langsmith: "Custom",
    langfuse: "Native",
    braintrust: "Native",
    description: "Support for industry-standard telemetry collection",
  },
  {
    category: "Core Tracing",
    feature: "Trace Retention",
    yourPlatform: "Configurable (7d-2yr)",
    arize: "Tiered",
    langsmith: "Tiered",
    langfuse: "Configurable",
    braintrust: "Tiered",
    description: "How long traces are stored and queryable",
  },
  {
    category: "Core Tracing",
    feature: "Real-time Streaming",
    yourPlatform: true,
    arize: true,
    langsmith: true,
    langfuse: true,
    braintrust: true,
    description: "Traces available for analysis as they arrive",
  },

  // Evaluation & Quality
  {
    category: "Evaluation & Quality",
    feature: "LLM-as-a-Judge",
    yourPlatform: "Built-in + Custom",
    arize: "Built-in",
    langsmith: "Limited",
    langfuse: "Limited",
    braintrust: "Built-in + Custom",
    description: "Automated scoring of LLM outputs for quality assessment",
  },
  {
    category: "Evaluation & Quality",
    feature: "Hallucination Detection",
    yourPlatform: true,
    arize: true,
    langsmith: false,
    langfuse: false,
    braintrust: true,
    description: "Automatic detection of false or unsupported claims",
  },
  {
    category: "Evaluation & Quality",
    feature: "Custom Evaluation Functions",
    yourPlatform: true,
    arize: true,
    langsmith: true,
    langfuse: false,
    braintrust: true,
    description: "Write custom Python/JS evaluation logic",
  },
  {
    category: "Evaluation & Quality",
    feature: "A/B Testing Framework",
    yourPlatform: "Integrated",
    arize: "Limited",
    langsmith: "Built-in",
    langfuse: "Manual",
    braintrust: "Built-in",
    description: "Statistical significance testing for prompt/model variants",
  },

  // Cost & Performance
  {
    category: "Cost & Performance",
    feature: "Cost Attribution",
    yourPlatform: "Per-user, per-feature",
    arize: "Per-model",
    langsmith: "Per-user",
    langfuse: "Per-trace",
    braintrust: "Per-user",
    description: "Granular cost breakdown and attribution",
  },
  {
    category: "Cost & Performance",
    feature: "Latency Tracking",
    yourPlatform: "Detailed breakdown",
    arize: "Basic",
    langsmith: "Basic",
    langfuse: "Basic",
    braintrust: "Detailed breakdown",
    description: "Identify bottlenecks in inference pipeline",
  },
  {
    category: "Cost & Performance",
    feature: "Query Performance",
    yourPlatform: "80x faster (proprietary DB)",
    arize: "Standard",
    langsmith: "Standard",
    langfuse: "Standard",
    braintrust: "80x faster (proprietary DB)",
    description: "Speed of querying millions of traces",
  },

  // Visualization & UX
  {
    category: "Visualization & UX",
    feature: "Context Graph Visualization",
    yourPlatform: "Interactive DAG",
    arize: "Interactive DAG",
    langsmith: "Limited",
    langfuse: "Limited",
    braintrust: "Interactive DAG",
    description: "Visualize agent decision flows and tool interactions",
  },
  {
    category: "Visualization & UX",
    feature: "Natural Language Search",
    yourPlatform: true,
    arize: true,
    langsmith: false,
    langfuse: false,
    braintrust: true,
    description: "Find traces using plain English queries",
  },
  {
    category: "Visualization & UX",
    feature: "Custom Dashboards",
    yourPlatform: true,
    arize: true,
    langsmith: true,
    langfuse: true,
    braintrust: true,
    description: "Build custom monitoring and analysis dashboards",
  },

  // Enterprise Features
  {
    category: "Enterprise Features",
    feature: "SAML/SSO",
    yourPlatform: true,
    arize: true,
    langsmith: true,
    langfuse: "Self-hosted only",
    braintrust: true,
    description: "Enterprise authentication and access control",
  },
  {
    category: "Enterprise Features",
    feature: "Audit Logs",
    yourPlatform: "Immutable",
    arize: "Basic",
    langsmith: "Basic",
    langfuse: "Self-hosted only",
    braintrust: "Immutable",
    description: "Compliance-ready audit trail of all actions",
  },
  {
    category: "Enterprise Features",
    feature: "Data Residency",
    yourPlatform: "Multi-region",
    arize: "Limited",
    langsmith: "US only",
    langfuse: "Self-hosted",
    braintrust: "Multi-region",
    description: "Store data in specific geographic regions",
  },
  {
    category: "Enterprise Features",
    feature: "PII Masking",
    yourPlatform: true,
    arize: false,
    langsmith: false,
    langfuse: false,
    braintrust: false,
    description: "Automatic redaction of sensitive personal data",
  },
  {
    category: "Enterprise Features",
    feature: "VPC/Private Deployment",
    yourPlatform: true,
    arize: true,
    langsmith: false,
    langfuse: "Self-hosted",
    braintrust: true,
    description: "Deploy within customer's private network",
  },

  // Integrations & Ecosystem
  {
    category: "Integrations & Ecosystem",
    feature: "LangChain Integration",
    yourPlatform: true,
    arize: true,
    langsmith: "Native",
    langfuse: true,
    braintrust: true,
    description: "Deep integration with LangChain framework",
  },
  {
    category: "Integrations & Ecosystem",
    feature: "CrewAI Support",
    yourPlatform: true,
    arize: true,
    langsmith: false,
    langfuse: false,
    braintrust: true,
    description: "Native support for CrewAI agent framework",
  },
  {
    category: "Integrations & Ecosystem",
    feature: "Open Source SDK",
    yourPlatform: true,
    arize: "Phoenix OSS",
    langsmith: false,
    langfuse: true,
    braintrust: false,
    description: "Open-source client libraries for transparency",
  },

  // Pricing & Deployment
  {
    category: "Pricing & Deployment",
    feature: "Free Tier",
    yourPlatform: "100k traces/mo",
    arize: "Limited",
    langsmith: "Limited",
    langfuse: "Unlimited (OSS)",
    braintrust: "Limited",
    description: "Generous free tier for developers",
  },
  {
    category: "Pricing & Deployment",
    feature: "Usage-Based Pricing",
    yourPlatform: "$0.50 per 1k traces",
    arize: "Custom",
    langsmith: "Seat-based",
    langfuse: "Pay-as-you-go",
    braintrust: "Usage-based",
    description: "Transparent, scalable pricing model",
  },
  {
    category: "Pricing & Deployment",
    feature: "Self-Hosting",
    yourPlatform: "Enterprise option",
    arize: "Phoenix OSS",
    langsmith: false,
    langfuse: "Full support",
    braintrust: "Enterprise option",
    description: "Option to deploy on your own infrastructure",
  },

  // Advanced Features
  {
    category: "Advanced Features",
    feature: "Multi-Agent Orchestration",
    yourPlatform: "Specialized views",
    arize: "Limited",
    langsmith: "Limited",
    langfuse: "Limited",
    braintrust: "Limited",
    description: "Visualize and debug multi-agent systems",
  },
  {
    category: "Advanced Features",
    feature: "Real-time Guardrailing",
    yourPlatform: "Built-in",
    arize: false,
    langsmith: false,
    langfuse: false,
    braintrust: false,
    description: "Block harmful outputs before they reach users",
  },
  {
    category: "Advanced Features",
    feature: "Regression Testing",
    yourPlatform: "One-click promotion",
    arize: "Manual",
    langsmith: "Manual",
    langfuse: "Manual",
    braintrust: "One-click promotion",
    description: "Turn production failures into automated test cases",
  },
];

interface FeatureComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function FeatureValue({ value }: { value: string | boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <div className="flex items-center justify-center">
        <Check className="h-5 w-5 text-accent" />
      </div>
    ) : (
      <div className="flex items-center justify-center">
        <X className="h-5 w-5 text-muted-foreground opacity-30" />
      </div>
    );
  }
  return <span className="text-sm">{value}</span>;
}

export function FeatureComparisonModal({ isOpen, onClose }: FeatureComparisonModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  const categories = Array.from(new Set(comparisonData.map((f) => f.category)));
  const filteredData = selectedCategory ? comparisonData.filter((f) => f.category === selectedCategory) : comparisonData;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-3xl">Feature Comparison Matrix</DialogTitle>
          <DialogDescription>
            Comprehensive comparison of AI observability platforms across 25+ key features
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="whitespace-nowrap"
            >
              All Categories
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className="whitespace-nowrap"
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto flex-1 border border-border rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary border-b border-border sticky top-0">
                  <th className="px-4 py-3 text-left font-semibold text-foreground w-64 sticky left-0 bg-secondary z-10">
                    Feature
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-accent min-w-32">Your Platform</th>
                  <th className="px-4 py-3 text-center font-semibold text-foreground min-w-32">Arize</th>
                  <th className="px-4 py-3 text-center font-semibold text-foreground min-w-32">LangSmith</th>
                  <th className="px-4 py-3 text-center font-semibold text-foreground min-w-32">Langfuse</th>
                  <th className="px-4 py-3 text-center font-semibold text-foreground min-w-32">Braintrust</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-border hover:bg-secondary/50 transition-colors"
                    onMouseEnter={() => setHoveredFeature(row.feature)}
                    onMouseLeave={() => setHoveredFeature(null)}
                  >
                    <td className="px-4 py-3 font-medium text-foreground w-64 sticky left-0 bg-card hover:bg-secondary/50 z-10">
                      <div>
                        <p className="font-semibold">{row.feature}</p>
                        <p className="text-xs text-muted-foreground mt-1">{row.description}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center bg-accent/10">
                      <FeatureValue value={row.yourPlatform} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <FeatureValue value={row.arize} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <FeatureValue value={row.langsmith} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <FeatureValue value={row.langfuse} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <FeatureValue value={row.braintrust} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="flex gap-6 text-sm text-muted-foreground pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-accent" />
              <span>Supported</span>
            </div>
            <div className="flex items-center gap-2">
              <X className="h-4 w-4 text-muted-foreground opacity-30" />
              <span>Not supported</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">Text</Badge>
              <span>Feature details</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button className="bg-accent text-accent-foreground hover:opacity-90">
            Download Comparison PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
