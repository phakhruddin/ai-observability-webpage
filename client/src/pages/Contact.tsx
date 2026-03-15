import { ContactForm } from "@/components/ContactForm";
import { CalendlyWidget } from "@/components/CalendlyWidget";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

/**
 * Design Philosophy: Data-Driven Elegance
 * Contact page maintains consistent dark theme with teal accents
 * Professional layout with form on left, contact info on right
 */

export default function Contact() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header with Logo */}
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
            <Link href="/#features">
              <a className="text-sm text-muted-foreground hover:text-accent transition-colors">Features</a>
            </Link>
            <Link href="/#comparison">
              <a className="text-sm text-muted-foreground hover:text-accent transition-colors">Comparison</a>
            </Link>
            <Link href="/#testimonials">
              <a className="text-sm text-muted-foreground hover:text-accent transition-colors">Testimonials</a>
            </Link>
            <Link href="/#pricing">
              <a className="text-sm text-muted-foreground hover:text-accent transition-colors">Pricing</a>
            </Link>
          </nav>
          <Link href="/">
            <Button size="sm" className="bg-accent text-accent-foreground hover:opacity-90">
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Have questions about OpsNexAI? Want to schedule a demo? We're here to help. Reach out and let's start a conversation.
          </p>
        </div>
      </section>

      {/* Scheduling Section */}
      <section className="py-20 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Schedule a Demo</h2>
            <p className="text-lg text-muted-foreground mb-12">
              Pick a time that works best for you. Our team will walk you through OpsNexAI's features and answer any questions.
            </p>
            <div className="bg-background border border-border rounded-lg p-8">
              <CalendlyWidget
                url="https://calendly.com/opsnexai/demo"
                hideEventTypeDetails={false}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-8">Send us a Message</h2>
                <ContactForm />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Email */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Mail className="h-6 w-6 text-accent mt-1" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Email</h3>
                    <a href="mailto:info@opsnexai.com" className="text-accent hover:underline">
                      info@opsnexai.com
                    </a>
                    <p className="text-sm text-muted-foreground mt-2">
                      We'll respond within 24 hours
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Phone className="h-6 w-6 text-accent mt-1" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Phone</h3>
                    <a href="tel:+14252025790" className="text-accent hover:underline">
                      (425) 202-5790
                    </a>
                    <p className="text-sm text-muted-foreground mt-2">
                      Mon-Fri, 9am-5pm PST
                    </p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <MapPin className="h-6 w-6 text-accent mt-1" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Address</h3>
                    <p className="text-muted-foreground">
                      Seattle, WA 98101<br />
                      United States
                    </p>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Clock className="h-6 w-6 text-accent mt-1" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Business Hours</h3>
                    <p className="text-sm text-muted-foreground">
                      Monday - Friday<br />
                      9:00 AM - 5:00 PM PST<br />
                      <br />
                      Closed on weekends and holidays
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
                <div className="space-y-2">
                  <Link href="/#features">
                    <a className="block text-sm text-accent hover:underline">View Features</a>
                  </Link>
                  <Link href="/#pricing">
                    <a className="block text-sm text-accent hover:underline">View Pricing</a>
                  </Link>
                  <a href="https://github.com/phakhruddin/ai-observability-docs" className="block text-sm text-accent hover:underline">
                    Documentation
                  </a>
                  <Link href="/">
                    <a className="block text-sm text-accent hover:underline">Back to Home</a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground mb-12">
              Find answers to common questions about OpsNexAI's features, pricing, implementation, and support.
            </p>
            <FAQSection />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-card border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Prefer to Schedule a Demo?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let's set up a personalized walkthrough of OpsNexAI tailored to your specific observability needs.
          </p>
          <Button size="lg" className="bg-accent text-accent-foreground hover:opacity-90">
            Schedule a Demo
          </Button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
