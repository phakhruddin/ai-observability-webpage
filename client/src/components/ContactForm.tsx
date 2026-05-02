import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MapPin, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trackFormSubmission } from "@/lib/analytics";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    inquiryType: "demo",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company name is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      trackFormSubmission('Contact Form', false);
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call (in production, send to backend)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Log form data (in production, send to backend/email service)
      console.log("Contact form submitted:", formData);

      setIsSuccess(true);
      trackFormSubmission('Contact Form', true);
      toast.success("Thank you! We'll be in touch soon.");

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          company: "",
          phone: "",
          inquiryType: "demo",
          message: "",
        });
        setIsSuccess(false);
      }, 3000);
    } catch (err) {
      toast.error("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, inquiryType: value }));
  };

  if (isSuccess) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-accent" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Thank You!</h3>
        <p className="text-muted-foreground mb-4">
          We've received your inquiry and will get back to you within 24 hours at <span className="font-semibold text-foreground">{formData.email}</span>.
        </p>
        <p className="text-sm text-muted-foreground">
          In the meantime, feel free to explore our platform or check out our resources.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
          Full Name *
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
          className={`bg-background border-border text-foreground placeholder:text-muted-foreground ${
            errors.name ? "border-destructive" : ""
          }`}
          disabled={isSubmitting}
        />
        {errors.name && (
          <div className="flex items-center gap-2 mt-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {errors.name}
          </div>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
          Email Address *
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          className={`bg-background border-border text-foreground placeholder:text-muted-foreground ${
            errors.email ? "border-destructive" : ""
          }`}
          disabled={isSubmitting}
        />
        {errors.email && (
          <div className="flex items-center gap-2 mt-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {errors.email}
          </div>
        )}
      </div>

      {/* Company Field */}
      <div>
        <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
          Company Name *
        </label>
        <Input
          id="company"
          name="company"
          type="text"
          placeholder="Your Company"
          value={formData.company}
          onChange={handleChange}
          className={`bg-background border-border text-foreground placeholder:text-muted-foreground ${
            errors.company ? "border-destructive" : ""
          }`}
          disabled={isSubmitting}
        />
        {errors.company && (
          <div className="flex items-center gap-2 mt-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {errors.company}
          </div>
        )}
      </div>

      {/* Phone Field (Optional) */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
          Phone Number (Optional)
        </label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="(425) 202-5790"
          value={formData.phone}
          onChange={handleChange}
          className="bg-background border-border text-foreground placeholder:text-muted-foreground"
          disabled={isSubmitting}
        />
      </div>

      {/* Inquiry Type */}
      <div>
        <label htmlFor="inquiryType" className="block text-sm font-medium text-foreground mb-2">
          What are you interested in? *
        </label>
        <Select value={formData.inquiryType} onValueChange={handleSelectChange} disabled={isSubmitting}>
          <SelectTrigger className="bg-background border-border text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="demo">Schedule a Demo</SelectItem>
            <SelectItem value="pricing">Pricing Information</SelectItem>
            <SelectItem value="integration">Integration Inquiry</SelectItem>
            <SelectItem value="partnership">Partnership Opportunity</SelectItem>
            <SelectItem value="support">Technical Support</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Message Field */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
          Message *
        </label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us about your observability needs and how we can help..."
          value={formData.message}
          onChange={handleChange}
          rows={5}
          className={`bg-background border-border text-foreground placeholder:text-muted-foreground resize-none ${
            errors.message ? "border-destructive" : ""
          }`}
          disabled={isSubmitting}
        />
        {errors.message && (
          <div className="flex items-center gap-2 mt-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {errors.message}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full bg-accent text-accent-foreground hover:opacity-90"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        We'll respond to your inquiry within 24 hours. For urgent matters, call us at (425) 202-5790.
      </p>
    </form>
  );
}
