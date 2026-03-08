import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { TrendingUp, DollarSign, Clock, Zap } from "lucide-react";

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
  timeToROI: number;
  debuggingTimeSaved: number;
  productivityGain: number;
}

const PRICING_TIERS = {
  starter: { traces: 10000000, cost: 299 },
  growth: { traces: 100000000, cost: 999 },
  enterprise: { traces: 1000000000, cost: 4999 },
};

const calculateROI = (monthlyTraces: number): ROIMetrics => {
  // Estimate current tool cost (industry average: $0.50 per million traces)
  const currentToolCost = Math.max(299, (monthlyTraces / 1000000) * 0.5);

  // Determine OpsNexAI pricing tier
  let opsnexaiCost = 299;
  if (monthlyTraces > PRICING_TIERS.growth.traces) {
    opsnexaiCost = PRICING_TIERS.enterprise.cost;
  } else if (monthlyTraces > PRICING_TIERS.starter.traces) {
    opsnexaiCost = PRICING_TIERS.growth.cost;
  }

  const monthlySavings = currentToolCost - opsnexaiCost;
  const annualSavings = monthlySavings * 12;

  // Time to ROI (months to recover investment)
  const timeToROI = opsnexaiCost > 0 ? Math.ceil(opsnexaiCost / Math.max(monthlySavings, 1)) : 0;

  // Debugging time saved (estimate: 5 hours per week per engineer, 4 engineers)
  // OpsNexAI reduces debugging time by 60% on average
  const debuggingTimeSaved = 5 * 4 * 0.6 * 4.33; // weeks per month

  // Productivity gain (hours per month)
  const productivityGain = debuggingTimeSaved * 150; // $150/hour average engineer cost

  return {
    monthlyTraces,
    currentToolCost: Math.round(currentToolCost),
    opsnexaiCost,
    monthlySavings: Math.max(0, Math.round(monthlySavings)),
    annualSavings: Math.max(0, Math.round(annualSavings)),
    timeToROI: Math.max(0, timeToROI),
    debuggingTimeSaved: Math.round(debuggingTimeSaved),
    productivityGain: Math.round(productivityGain),
  };
};

export function ROICalculator() {
  const [monthlyTraces, setMonthlyTraces] = useState(50000000);
  const roi = useMemo(() => calculateROI(monthlyTraces), [monthlyTraces]);

  const handleSliderChange = (value: number[]) => {
    setMonthlyTraces(value[0]);
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
              <span className="text-2xl font-bold text-accent">
                {formatNumber(monthlyTraces)}
              </span>
            </div>

            <Slider
              value={[monthlyTraces]}
              onValueChange={handleSliderChange}
              min={1000000}
              max={1000000000}
              step={1000000}
              className="w-full"
            />

            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>1M</span>
              <span>1B</span>
            </div>

            {/* Quick Select Buttons */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              {[
                { label: "Starter", traces: 10000000 },
                { label: "Growth", traces: 100000000 },
                { label: "Enterprise", traces: 1000000000 },
              ].map((tier) => (
                <Button
                  key={tier.label}
                  variant={monthlyTraces === tier.traces ? "default" : "outline"}
                  onClick={() => setMonthlyTraces(tier.traces)}
                  className="text-sm"
                >
                  {tier.label}
                </Button>
              ))}
            </div>
          </div>

          {/* ROI Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 pt-8 border-t border-border">
            {/* Monthly Savings */}
            <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg p-6 border border-accent/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground font-medium">
                  Monthly Savings
                </span>
                <DollarSign className="h-5 w-5 text-accent" />
              </div>
              <div className="text-3xl font-bold text-accent">
                {formatCurrency(roi.monthlySavings)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                vs. current solution: {formatCurrency(roi.currentToolCost)}/mo
              </p>
            </div>

            {/* Annual Savings */}
            <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-lg p-6 border border-green-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground font-medium">
                  Annual Savings
                </span>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-green-500">
                {formatCurrency(roi.annualSavings)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                OpsNexAI pricing: {formatCurrency(roi.opsnexaiCost)}/mo
              </p>
            </div>

            {/* Time to ROI */}
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-lg p-6 border border-blue-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground font-medium">
                  Time to ROI
                </span>
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-blue-500">
                {roi.timeToROI === 0 ? "Immediate" : `${roi.timeToROI} months`}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Break-even point for implementation
              </p>
            </div>

            {/* Productivity Gain */}
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-lg p-6 border border-purple-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground font-medium">
                  Productivity Gain
                </span>
                <Zap className="h-5 w-5 text-purple-500" />
              </div>
              <div className="text-3xl font-bold text-purple-500">
                {formatCurrency(roi.productivityGain)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Monthly value from reduced debugging time
              </p>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-8 p-6 bg-secondary/30 rounded-lg border border-border">
            <h3 className="font-semibold text-foreground mb-3">Your ROI Summary</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full" />
                Save {formatCurrency(roi.monthlySavings)} per month on observability costs
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full" />
                Gain {formatCurrency(roi.productivityGain)} monthly from faster debugging
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full" />
                Reach ROI in {roi.timeToROI === 0 ? "the first month" : `${roi.timeToROI} months`}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full" />
                Total first-year value: {formatCurrency(roi.annualSavings + roi.productivityGain * 12)}
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="mt-8 flex gap-4">
            <Button className="flex-1 bg-accent text-accent-foreground hover:opacity-90">
              Start Free Trial
            </Button>
            <Button variant="outline" className="flex-1">
              Schedule Demo
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
