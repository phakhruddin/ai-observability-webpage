import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight, Play, Pause, RotateCcw } from "lucide-react";

/**
 * Interactive Product Demo Component
 * Showcases observability dashboard features with guided walkthrough
 * Design: Data-driven elegance with interactive exploration
 */

interface DemoStep {
  id: string;
  title: string;
  description: string;
  feature: string;
  highlight: string;
  metrics?: { label: string; value: string }[];
}

const demoSteps: DemoStep[] = [
  {
    id: "1",
    title: "Real-time Request Tracing",
    description:
      "Capture every AI request with sub-millisecond latency. See exactly what your models are doing in production.",
    feature: "Trace View",
    highlight: "trace-panel",
    metrics: [
      { label: "Latency", value: "45ms" },
      { label: "Tokens", value: "1,250" },
      { label: "Cost", value: "$0.08" },
    ],
  },
  {
    id: "2",
    title: "Multi-Agent Orchestration",
    description:
      "Visualize complex agent workflows and understand how multiple agents interact and coordinate.",
    feature: "Agent Graph",
    highlight: "agent-graph",
    metrics: [
      { label: "Agents", value: "5" },
      { label: "Steps", value: "12" },
      { label: "Duration", value: "2.3s" },
    ],
  },
  {
    id: "3",
    title: "Error Detection & Analysis",
    description:
      "Automatically detect failures, hallucinations, and anomalies. Drill down to root cause in seconds.",
    feature: "Error Analysis",
    highlight: "error-panel",
    metrics: [
      { label: "Errors", value: "3" },
      { label: "Severity", value: "High" },
      { label: "Impact", value: "2.1%" },
    ],
  },
  {
    id: "4",
    title: "PII Detection & Masking",
    description:
      "Automatically identify and mask sensitive data across all traces. Stay compliant without manual effort.",
    feature: "Security",
    highlight: "security-panel",
    metrics: [
      { label: "PII Found", value: "8" },
      { label: "Masked", value: "100%" },
      { label: "Compliance", value: "✓" },
    ],
  },
  {
    id: "5",
    title: "Performance Analytics",
    description:
      "Track key metrics over time. Identify trends, optimize performance, and measure improvements.",
    feature: "Analytics",
    highlight: "analytics-panel",
    metrics: [
      { label: "Avg Latency", value: "52ms" },
      { label: "Success Rate", value: "99.8%" },
      { label: "Throughput", value: "1.2K/min" },
    ],
  },
];

export function InteractiveDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  const step = demoSteps[currentStep];

  const handleNext = () => {
    setCurrentStep((prev) => (prev + 1) % demoSteps.length);
  };

  const handlePrev = () => {
    setCurrentStep((prev) => (prev - 1 + demoSteps.length) % demoSteps.length);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsAutoPlay(false);
  };

  // Auto-play effect
  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % demoSteps.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlay]);

  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-4">Interactive Product Demo</h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Explore the OpsNexAI dashboard and see how it brings visibility to your AI systems. No signup required.
          </p>
        </div>

        {/* Demo Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Demo Visualization */}
          <div className="lg:col-span-2">
            <Card className="bg-card overflow-hidden border-2 border-accent/20 hover:border-accent/40 transition-colors">
              {/* Dashboard Mockup */}
              <div className="bg-gradient-to-br from-background to-card p-8 aspect-video flex flex-col items-center justify-center relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-10 left-10 w-32 h-32 bg-accent rounded-full blur-3xl animate-pulse" />
                  <div className="absolute bottom-10 right-10 w-40 h-40 bg-accent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
                </div>

                {/* Content */}
                <div className="relative z-10 text-center">
                  <div className="mb-6">
                    <div className="inline-block px-4 py-2 bg-accent/20 rounded-full border border-accent/40 mb-4">
                      <span className="text-accent font-semibold text-sm">{step.feature}</span>
                    </div>
                  </div>

                  {/* Feature Visualization */}
                  <div className="mb-8">
                    <div className="text-6xl mb-4 animate-bounce">{getFeatureIcon(step.id)}</div>
                    <h3 className="text-3xl font-bold text-foreground mb-2">{step.title}</h3>
                    <p className="text-muted-foreground max-w-lg">{step.description}</p>
                  </div>

                  {/* Metrics Display */}
                  {step.metrics && (
                    <div className="grid grid-cols-3 gap-4">
                      {step.metrics.map((metric) => (
                        <div
                          key={metric.label}
                          className="p-4 bg-card/50 border border-border rounded-lg hover:border-accent/50 transition-colors cursor-pointer"
                          onMouseEnter={() => setHoveredMetric(metric.label)}
                          onMouseLeave={() => setHoveredMetric(null)}
                        >
                          <div className="text-sm text-muted-foreground mb-1">{metric.label}</div>
                          <div
                            className={`text-2xl font-bold transition-colors ${
                              hoveredMetric === metric.label ? "text-accent" : "text-foreground"
                            }`}
                          >
                            {metric.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="bg-card border-t border-border p-6 flex items-center justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePrev}
                    className="hover:bg-accent/10"
                  >
                    <ChevronRight className="h-4 w-4 rotate-180" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsAutoPlay(!isAutoPlay)}
                    className="hover:bg-accent/10"
                  >
                    {isAutoPlay ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleReset}
                    className="hover:bg-accent/10"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNext}
                    className="hover:bg-accent/10"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Progress Indicators */}
                <div className="flex gap-2">
                  {demoSteps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentStep(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentStep
                          ? "bg-accent w-8"
                          : "bg-border w-2 hover:bg-muted-foreground"
                      }`}
                      aria-label={`Go to step ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Step Navigation Sidebar */}
          <div className="space-y-4">
            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Features
            </div>
            {demoSteps.map((s, index) => (
              <button
                key={s.id}
                onClick={() => {
                  setCurrentStep(index);
                  setIsAutoPlay(false);
                }}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  index === currentStep
                    ? "bg-accent/10 border-accent"
                    : "bg-card border-border hover:border-accent/50"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-foreground">{s.title}</h4>
                  {index === currentStep && (
                    <span className="inline-block w-2 h-2 bg-accent rounded-full mt-1" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {s.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to see it in action?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Get hands-on access to the full OpsNexAI platform. Start monitoring your AI systems in minutes.
          </p>
          <div className="flex gap-4 justify-center">
            <InteractiveDemoButton />
            <Button variant="outline">
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function InteractiveDemoButton() {
  const [, setLocation] = useLocation();
  return (
    <Button 
      className="bg-accent text-accent-foreground hover:opacity-90"
      onClick={() => setLocation("/free-trial")}
    >
      Start Free Trial
    </Button>
  );
}

// Helper function to get feature icon
function getFeatureIcon(stepId: string): string {
  const icons: Record<string, string> = {
    "1": "⚡",
    "2": "🤖",
    "3": "🔍",
    "4": "🛡️",
    "5": "📊",
  };
  return icons[stepId] || "✨";
}
