import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trackFormSubmission } from "@/lib/analytics";

/**
 * Free Trial Form Component
 * 
 * Captures lead qualification data:
 * - Company size
 * - Log volume
 * - Current observability tools
 * 
 * Design: Follows dark theme with teal accents, consistent with OpsNexAI branding
 */

const companySizeOptions = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "500+", label: "500+ employees" },
];

const logVolumeOptions = [
  { value: "low", label: "< 1 GB/day" },
  { value: "medium", label: "1-10 GB/day" },
  { value: "high", label: "10-100 GB/day" },
  { value: "very-high", label: "100+ GB/day" },
];

const observabilityTools = [
  { id: "datadog", label: "Datadog" },
  { id: "splunk", label: "Splunk" },
  { id: "prometheus", label: "Prometheus" },
  { id: "grafana", label: "Grafana" },
  { id: "elastic", label: "Elastic Stack" },
  { id: "newrelic", label: "New Relic" },
  { id: "cloudwatch", label: "AWS CloudWatch" },
  { id: "stackdriver", label: "Google Cloud Logging" },
  { id: "dynatrace", label: "Dynatrace" },
  { id: "sumologic", label: "Sumo Logic" },
  { id: "none", label: "None / Just Starting" },
  { id: "other", label: "Other" },
];

export function FreeTrialForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    companySize: "",
    logVolume: "",
    currentTools: [] as string[],
    useCase: "",
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

    if (!formData.companySize) {
      newErrors.companySize = "Company size is required";
    }

    if (!formData.logVolume) {
      newErrors.logVolume = "Log volume is required";
    }

    if (formData.currentTools.length === 0) {
      newErrors.currentTools = "Please select at least one option";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      trackFormSubmission("Free Trial Form", false);
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call (in production, send to backend)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Log form data (in production, send to backend/email service)
      console.log("Free trial form submitted:", formData);

      setIsSuccess(true);
      trackFormSubmission("Free Trial Form", true);
      
      // Store user data in localStorage
      localStorage.setItem("trialUserName", formData.name);
      localStorage.setItem("trialUserEmail", formData.email);
      localStorage.setItem("trialCompany", formData.company);
      localStorage.setItem("trialCompanySize", formData.companySize);
      localStorage.setItem("trialLogVolume", formData.logVolume);
      localStorage.setItem("trialStartDate", new Date().toISOString());
      
      toast.success("Welcome! Redirecting to your dashboard...");

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
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

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleToolToggle = (toolId: string) => {
    setFormData((prev) => {
      const updated = prev.currentTools.includes(toolId)
        ? prev.currentTools.filter((id) => id !== toolId)
        : [...prev.currentTools, toolId];
      return { ...prev, currentTools: updated };
    });
    if (errors.currentTools) {
      setErrors((prev) => ({ ...prev, currentTools: "" }));
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-accent" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Welcome to OpsNexAI!</h3>
        <p className="text-muted-foreground mb-4">
          Your trial account has been created. Redirecting to your dashboard...
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          You will receive a confirmation email at <span className="font-semibold text-foreground">{formData.email}</span>.
        </p>
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 text-left">
          <p className="text-sm text-foreground font-medium mb-2">Your trial includes:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>✓ 14 days of full access to all OAAS features</li>
            <li>✓ Unlimited log ingestion and analysis</li>
            <li>✓ Real-time alerting and anomaly detection</li>
            <li>✓ Dedicated onboarding support</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Contact Information Section */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Contact Information</h3>
        <div className="space-y-4">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
              Full Name *
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Sarah Martinez"
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
        </div>
      </div>

      {/* Company Profile Section */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Company Profile</h3>
        <div className="space-y-4">
          {/* Company Size */}
          <div>
            <label htmlFor="companySize" className="block text-sm font-medium text-foreground mb-2">
              Company Size *
            </label>
            <Select
              value={formData.companySize}
              onValueChange={(value) => handleSelectChange("companySize", value)}
              disabled={isSubmitting}
            >
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue placeholder="Select company size" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {companySizeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.companySize && (
              <div className="flex items-center gap-2 mt-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {errors.companySize}
              </div>
            )}
          </div>

          {/* Log Volume */}
          <div>
            <label htmlFor="logVolume" className="block text-sm font-medium text-foreground mb-2">
              Daily Log Volume *
            </label>
            <Select
              value={formData.logVolume}
              onValueChange={(value) => handleSelectChange("logVolume", value)}
              disabled={isSubmitting}
            >
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue placeholder="Select log volume" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {logVolumeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.logVolume && (
              <div className="flex items-center gap-2 mt-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {errors.logVolume}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Observability Tools Section */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Current Observability Tools *</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Which tools are you currently using? (Select all that apply)
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {observabilityTools.map((tool) => (
            <div key={tool.id} className="flex items-center space-x-3">
              <Checkbox
                id={tool.id}
                checked={formData.currentTools.includes(tool.id)}
                onCheckedChange={() => handleToolToggle(tool.id)}
                disabled={isSubmitting}
                className="border-border"
              />
              <label
                htmlFor={tool.id}
                className="text-sm font-medium text-foreground cursor-pointer hover:text-accent transition-colors"
              >
                {tool.label}
              </label>
            </div>
          ))}
        </div>
        {errors.currentTools && (
          <div className="flex items-center gap-2 mt-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {errors.currentTools}
          </div>
        )}
      </div>

      {/* Use Case */}
      <div>
        <label htmlFor="useCase" className="block text-sm font-medium text-foreground mb-2">
          What's your primary use case? (Optional)
        </label>
        <Input
          id="useCase"
          name="useCase"
          type="text"
          placeholder="e.g., Real-time alerting, Cost optimization, Compliance tracking"
          value={formData.useCase}
          onChange={handleChange}
          className="bg-background border-border text-foreground placeholder:text-muted-foreground"
          disabled={isSubmitting}
        />
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
            Starting Free Trial...
          </>
        ) : (
          "Start Free Trial"
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        No credit card required. 14-day free trial with full access to OAAS features.
      </p>
    </form>
  );
}
