import { Mail, Linkedin, Twitter, Github, MapPin, Phone } from "lucide-react";

/**
 * Professional Footer Component
 * Displays company information, social media links, and legal notices
 * Design: Data-driven elegance with clear information hierarchy
 */

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: Linkedin,
      href: "https://linkedin.com/company/opsnexai",
      label: "LinkedIn",
      color: "hover:text-blue-400",
    },
    {
      icon: Twitter,
      href: "https://twitter.com/opsnexai",
      label: "Twitter",
      color: "hover:text-sky-400",
    },
    {
      icon: Github,
      href: "https://github.com/opsnexai",
      label: "GitHub",
      color: "hover:text-gray-300",
    },
  ];

  const footerSections = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "Comparison", href: "#comparison" },
        { label: "Roadmap", href: "#" },
        { label: "Status", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Press Kit", href: "#" },
        { label: "Contact", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "#" },
        { label: "API Reference", href: "#" },
        { label: "SDKs", href: "#" },
        { label: "Community", href: "#" },
        { label: "Support", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Cookie Policy", href: "#" },
        { label: "Security", href: "#" },
        { label: "Compliance", href: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-card border-t border-border">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Company Info Section */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-foreground mb-4">OpsNexAI</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Enterprise-grade AI observability platform for building reliable, observable AI systems.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-accent mt-1 flex-shrink-0" />
                <a
                  href="mailto:info@opsnexai.com"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  info@opsnexai.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-accent mt-1 flex-shrink-0" />
                <a
                  href="tel:+1-425-298-6369"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  (425) 298-6369
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-accent mt-1 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  Seattle, WA 98101
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-muted-foreground transition-colors ${social.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-accent transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-border my-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Copyright */}
          <div className="text-sm text-muted-foreground">
            <p>© {currentYear} OpsNexAI, Inc. All rights reserved.</p>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded border border-accent/30 flex items-center justify-center">
                <span className="text-xs text-accent">✓</span>
              </div>
              <span>SOC 2 Type II Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded border border-accent/30 flex items-center justify-center">
                <span className="text-xs text-accent">✓</span>
              </div>
              <span>GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded border border-accent/30 flex items-center justify-center">
                <span className="text-xs text-accent">✓</span>
              </div>
              <span>99.9% Uptime SLA</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex gap-6 text-sm">
            <a
              href="#"
              className="text-muted-foreground hover:text-accent transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-accent transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-accent transition-colors"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>

      {/* Floating CTA Bar (Optional - appears on scroll) */}
      <div className="border-t border-border bg-secondary/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">Ready to get started?</p>
            <p className="text-xs text-muted-foreground">
              Join 500+ companies building reliable AI systems.
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="#"
              className="text-sm text-accent hover:text-accent/80 transition-colors font-semibold"
            >
              View Docs →
            </a>
            <a
              href="#"
              className="px-4 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Get Started Free
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
