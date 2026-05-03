import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { TrendingUp, DollarSign, Clock, Zap, Download, Mail, Copy, Check } from "lucide-react";
import { generateROIPDF, shareViaEmail, copyToClipboard } from "@/lib/roiExport";
import { toast } from "sonner";

/**
 * ROI Calculator Component
 * Allows users to input their trace volume and see projected savings
 * Design: Interactive calculator with real-time results
 */

interface ROIMetrics {
  monthlyTraces: number;
  currentToolCost: number;
  opsnexaiCost: number;
  monthlySavings: number;
  annualSavings: number;
}

export function ROICalculator() {
  const [monthlyTraces, setMonthlyTraces] = useState(1000000);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  const roi = useMemo(() => {
    const traces = monthlyTraces;
    // Assume $0.001 per trace for current tools (Datadog, Splunk, etc.)
    const timeToROI = currentToolCost > 0 ? Math.ceil(currentToolCost / monthlySavings) : 0;
    const debuggingTimeSaved = traces * 0.0001;
    const productivityGain = debuggingTimeSaved * 150;
    const currentToolCost = traces * 0.001;
    // Assume $0.0002 per trace for OpsNexAI
    const opsnexaiCost = traces * 0.0002;
    const monthlySavings = currentToolCost - opsnexaiCost;
    const annualSavings = monthlySavings * 12;

    return {
      monthlyTraces: traces,
      currentToolCost,
      timeToROI,
      debuggingTimeSaved,
      productivityGain,
      opsnexaiCost,
      monthlySavings,
      annualSavings,
    };
  }, [monthlyTraces]);

  const handleDownloadPDF = async () => {
    try {
      await generateROIPDF(roi);
      toast.success("ROI report downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download ROI report.");
    }
  };

  const handleShareViaEmail = async () => {
    try {
      await shareViaEmail(roi);
      toast.success("ROI results sent to your email!");
    } catch (error) {
      toast.error("Failed to send ROI results via email.");
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await copyToClipboard(roi);
      setCopiedToClipboard(true);
      toast.success("ROI results copied to clipboard!");
      setTimeout(() => setCopiedToClipboard(false), 2000);
    } catch (error) {
      toast.error("Failed to copy to clipboard.");
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatCurrency = (num: number) => {
    return `$${num.toLocaleString()}`;
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-secondary/5">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Calculate Your ROI
          </h2>
          <p className="text-lg text-muted-foreground">
            See how much you can save with OpsNexAI compared to your current observability solution
          </p>
        </div>

        {/* Calculator Card */}
        <Card className="p-8 bg-card border border-border shadow-lg">
          {/* Trace Volume Slider */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-foreground">
                Monthly Trace Volume
              </label>
              <span className="text-lg font-bold text-accent">
                {formatNumber(monthlyTraces)} traces/month
              </span>
            </div>
            <Slider
              value={[monthlyTraces]}
              onValueChange={(value) => setMonthlyTraces(value[0])}
              min={100000}
              max={100000000}
              step={100000}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Adjust the slider to match your organization's monthly trace volume
            </p>
          </div>

          {/* ROI Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Current Tool Cost */}
            <div className="p-6 rounded-lg bg-background/50 border border-border">
              <div className="flex items-center gap-3 mb-3">
                <DollarSign className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-semibold text-foreground">Current Tool Cost</h3>
              </div>
              <p className="text-3xl font-bold text-foreground mb-2">
                {formatCurrency(roi.currentToolCost)}
              </p>
              <p className="text-xs text-muted-foreground">per month</p>
            </div>

            {/* OpsNexAI Cost */}
            <div className="p-6 rounded-lg bg-background/50 border border-border">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-foreground">OpsNexAI Cost</h3>
              </div>
              <p className="text-3xl font-bold text-accent mb-2">
                {formatCurrency(roi.opsnexaiCost)}
              </p>
              <p className="text-xs text-muted-foreground">per month</p>
            </div>

            {/* Monthly Savings */}
            <div className="p-6 rounded-lg bg-accent/10 border border-accent/30">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-foreground">Monthly Savings</h3>
              </div>
              <p className="text-3xl font-bold text-accent mb-2">
                {formatCurrency(roi.monthlySavings)}
              </p>
              <p className="text-xs text-muted-foreground">per month</p>
            </div>

            {/* Annual Savings */}
            <div className="p-6 rounded-lg bg-accent/10 border border-accent/30">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-foreground">Annual Savings</h3>
              </div>
              <p className="text-3xl font-bold text-accent mb-2">
                {formatCurrency(roi.annualSavings)}
              </p>
              <p className="text-xs text-muted-foreground">per year</p>
            </div>
          </div>

          {/* Export Options */}
          <div className="border-t border-border pt-6 mb-6">
            <p className="text-sm font-semibold text-foreground mb-4">Share Your Results</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="flex items-center justify-center gap-2"
                onClick={handleDownloadPDF}
              >
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-center gap-2"
                onClick={handleShareViaEmail}
              >
                <Mail className="w-4 h-4" />
                Share via Email
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-center gap-2"
                onClick={handleCopyToClipboard}
              >
                {copiedToClipboard ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy to Clipboard
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* CTA */}
          <div className="flex gap-4">
            <ROICalculatorButton />
            <Button variant="outline" className="flex-1">
              View Pricing
            </Button>
          </div>
        </Card>

        {/* Footer Note */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          * ROI calculations are based on industry averages and typical use cases. Actual savings may vary based on your specific implementation and current tooling.
        </p>
      </div>
    </section>
  );
}

function ROICalculatorButton() {
  const [, setLocation] = useLocation();
  return (
    <Button className="flex-1 bg-accent text-accent-foreground hover:opacity-90" onClick={() => setLocation("/free-trial")}>
      Start Free Trial
    </Button>
  );
}
