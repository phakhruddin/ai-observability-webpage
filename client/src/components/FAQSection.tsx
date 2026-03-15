import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    id: "1",
    question: "What is OpsNexAI and how does it differ from other observability platforms?",
    answer:
      "OpsNexAI is an AI-native observability platform designed specifically for production AI systems. Unlike traditional observability tools, we provide real-time monitoring, PII detection and masking, multi-agent orchestration tracking, and AI-specific guardrailing. Our platform is optimized for LLM applications, autonomous agents, and complex AI workflows with 80x faster query performance compared to competitors.",
  },
  {
    id: "2",
    question: "How long does it take to implement OpsNexAI?",
    answer:
      "Implementation typically takes 2-4 weeks depending on your infrastructure complexity. We provide a quick-start guide that gets you collecting traces in under 30 minutes. Our onboarding team handles integration with your existing systems, and we offer 24/7 support during the implementation phase. Most customers see immediate value within the first week.",
  },
  {
    id: "3",
    question: "What is the pricing model for OpsNexAI?",
    answer:
      "We offer flexible pricing based on trace volume. Our Starter plan begins at $500/month for up to 1M traces, Growth plan at $2,000/month for 10M traces, and Enterprise plans with custom pricing for higher volumes. All plans include core features like real-time tracing, PII masking, and basic analytics. Premium features like advanced guardrailing and multi-agent orchestration are available in Growth and Enterprise tiers.",
  },
  {
    id: "4",
    question: "Does OpsNexAI support multi-agent systems?",
    answer:
      "Yes! OpsNexAI has specialized support for multi-agent orchestration. We provide dedicated views for tracking agent interactions, decision trees, and communication patterns. You can monitor multiple agents working together, track their state changes, and debug complex agent workflows. This is one of our key differentiators in the market.",
  },
  {
    id: "5",
    question: "How does OpsNexAI handle data privacy and security?",
    answer:
      "Data security is core to our platform. We offer PII detection and automatic masking to protect sensitive information before it's stored. All data is encrypted in transit and at rest using industry-standard protocols. We're SOC 2 Type II compliant and GDPR certified. Enterprise customers can deploy OpsNexAI on-premises or in their own VPC for complete data control.",
  },
  {
    id: "6",
    question: "Can I integrate OpsNexAI with my existing tools?",
    answer:
      "Absolutely! OpsNexAI integrates with popular frameworks like LangChain, LlamaIndex, and OpenAI SDK out of the box. We also support custom integrations via our REST API and Python SDK. Our platform works with existing monitoring tools like Datadog, New Relic, and Splunk. We have pre-built connectors for major cloud providers (AWS, GCP, Azure).",
  },
  {
    id: "7",
    question: "What support options are available?",
    answer:
      "We offer 24/7 email support for all plans, with live chat available for Growth and Enterprise customers. Dedicated support engineers are assigned to Enterprise accounts. We also provide comprehensive documentation, video tutorials, and a community Slack channel. Premium support includes quarterly business reviews and proactive optimization recommendations.",
  },
  {
    id: "8",
    question: "Is there a free trial available?",
    answer:
      "Yes! We offer a 14-day free trial with full access to all features. No credit card required to get started. During your trial, you can ingest up to 1M traces and explore all core features. After the trial, you can choose a plan that fits your needs or continue with our free tier for up to 100K traces per month.",
  },
];

export function FAQSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {faqItems.map((item) => (
        <div
          key={item.id}
          className="bg-card border border-border rounded-lg overflow-hidden transition-all duration-200"
        >
          <button
            onClick={() => toggleExpand(item.id)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-accent/5 transition-colors text-left"
          >
            <h3 className="font-semibold text-foreground pr-4">{item.question}</h3>
            <ChevronDown
              className={`h-5 w-5 text-accent flex-shrink-0 transition-transform duration-200 ${
                expandedId === item.id ? "transform rotate-180" : ""
              }`}
            />
          </button>

          {expandedId === item.id && (
            <div className="px-6 py-4 border-t border-border bg-background/50">
              <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
