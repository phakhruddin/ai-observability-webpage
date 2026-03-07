import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useState, useEffect } from "react";

/**
 * Customer Testimonials Component
 * Displays rotating carousel of customer success stories
 * Design: Data-driven elegance with social proof emphasis
 */

interface Testimonial {
  id: number;
  name: string;
  title: string;
  company: string;
  quote: string;
  metric: string;
  metricValue: string;
  avatar: string;
  industry: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Chen",
    title: "VP of Engineering",
    company: "Acme AI Labs",
    quote:
      "We reduced our debugging time by 80% after switching to this platform. The context graphs made it trivial to understand why our agents were failing. What used to take hours now takes minutes.",
    metric: "Debugging Time Reduction",
    metricValue: "80%",
    avatar: "👩‍💼",
    industry: "AI/ML Startup",
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    title: "Head of AI Operations",
    company: "FinServe Corp",
    quote:
      "In regulated finance, compliance is everything. The PII masking and immutable audit logs gave us the confidence to deploy AI agents in production. No other platform offered this level of privacy-first design.",
    metric: "Compliance Score",
    metricValue: "100%",
    avatar: "👨‍💼",
    industry: "Financial Services",
  },
  {
    id: 3,
    name: "Dr. Priya Patel",
    title: "Director of ML",
    company: "HealthTech Innovations",
    quote:
      "The hallucination detection caught a critical error before it reached patients. This platform isn't just a nice-to-have—it's essential infrastructure for responsible AI deployment in healthcare.",
    metric: "Critical Issues Caught",
    metricValue: "47",
    avatar: "👩‍⚕️",
    industry: "Healthcare",
  },
  {
    id: 4,
    name: "James Wilson",
    title: "CTO",
    company: "Scale AI Consulting",
    quote:
      "Our clients love that we can show them exactly what their AI agents are doing at every step. The cost attribution by feature helped us identify which use cases are actually profitable. Game changer for our business model.",
    metric: "Cost Visibility",
    metricValue: "100%",
    avatar: "👨‍💻",
    industry: "Consulting",
  },
  {
    id: 5,
    name: "Elena Kowalski",
    title: "Product Manager",
    company: "E-Commerce Plus",
    quote:
      "We A/B tested 12 different prompt variations simultaneously. The statistical significance testing helped us identify the winner in days instead of weeks. Our customer satisfaction scores improved by 23%.",
    metric: "Satisfaction Improvement",
    metricValue: "+23%",
    avatar: "👩‍🔬",
    industry: "E-Commerce",
  },
  {
    id: 6,
    name: "David Thompson",
    title: "Engineering Lead",
    company: "Enterprise Software Co",
    quote:
      "The multi-agent orchestration views gave us visibility into how our agents collaborate. We caught a coordination bug that would have cost us thousands in wasted API calls. Invaluable for scaling AI systems.",
    metric: "API Cost Savings",
    metricValue: "$47K/mo",
    avatar: "👨‍🏫",
    industry: "Enterprise Software",
  },
];

interface TestimonialsSectionProps {
  className?: string;
}

export function TestimonialsSection({ className = "" }: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [autoPlay]);

  const goToPrevious = () => {
    setAutoPlay(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setAutoPlay(false);
    setCurrentIndex(index);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className={`py-20 bg-secondary ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Trusted by Leading AI Teams</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how companies across industries are using our platform to build reliable, observable AI systems.
          </p>
        </div>

        {/* Main Testimonial Card */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="bg-card border-border p-12 relative overflow-hidden">
            {/* Decorative accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16" />

            <div className="relative z-10">
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-2xl font-semibold mb-8 leading-relaxed text-foreground">
                "{currentTestimonial.quote}"
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{currentTestimonial.avatar}</div>
                  <div>
                    <p className="font-bold text-foreground">{currentTestimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{currentTestimonial.title}</p>
                    <p className="text-sm text-accent font-semibold">{currentTestimonial.company}</p>
                  </div>
                </div>

                {/* Metric Highlight */}
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">{currentTestimonial.metric}</p>
                  <p className="text-4xl font-bold text-accent">{currentTestimonial.metricValue}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPrevious}
            className="rounded-full border-border hover:bg-accent/10"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          {/* Dot Indicators */}
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-accent w-8"
                    : "bg-border hover:bg-muted-foreground w-2"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={goToNext}
            className="rounded-full border-border hover:bg-accent/10"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Testimonial Grid - Show all at once on desktop */}
        <div className="mt-16 pt-12 border-t border-border">
          <h3 className="text-2xl font-bold mb-8 text-center">More Customer Success Stories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.id}
                className="bg-card border-border p-6 hover:border-accent transition-colors"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>

                {/* Quote Preview */}
                <p className="text-sm text-foreground mb-4 line-clamp-3">"{testimonial.quote}"</p>

                {/* Author */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">{testimonial.avatar}</div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.company}</p>
                  </div>
                </div>

                {/* Metric */}
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">{testimonial.metric}</p>
                  <p className="text-lg font-bold text-accent">{testimonial.metricValue}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 pt-12 border-t border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-accent mb-2">500+</p>
              <p className="text-sm text-muted-foreground">Active Customers</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-accent mb-2">99.9%</p>
              <p className="text-sm text-muted-foreground">Uptime SLA</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-accent mb-2">2B+</p>
              <p className="text-sm text-muted-foreground">Traces Processed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-accent mb-2">4.9/5</p>
              <p className="text-sm text-muted-foreground">Customer Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
