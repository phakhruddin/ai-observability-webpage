/**
 * ROI Export Utilities
 * Handles PDF generation and email sharing for ROI calculator results
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

/**
 * Generate a PDF report of ROI calculator results
 * Uses html2canvas and jsPDF for client-side PDF generation
 */
export async function generateROIPDF(roi: ROIMetrics, userEmail?: string): Promise<void> {
  try {
    // Dynamically import PDF libraries
    const html2canvas = (await import("html2canvas")).default;
    const jsPDF = (await import("jspdf")).jsPDF;

    // Create a container for the PDF content
    const container = document.createElement("div");
    container.style.padding = "40px";
    container.style.backgroundColor = "#0f172a";
    container.style.color = "#f0f9ff";
    container.style.fontFamily = "Arial, sans-serif";
    container.style.width = "800px";
    container.style.position = "absolute";
    container.style.left = "-9999px";

    // Build HTML content
    const formatCurrency = (num: number) => `$${num.toLocaleString()}`;
    const formatNumber = (num: number) => {
      if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
      if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
      return num.toString();
    };

    container.innerHTML = `
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="font-size: 32px; margin: 0; color: #14b8a6;">OpsNexAI ROI Report</h1>
        <p style="color: #cbd5e1; margin-top: 10px;">AI Observability Platform</p>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">Generated on ${new Date().toLocaleDateString()}</p>
      </div>

      <div style="background: #1e293b; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h2 style="color: #14b8a6; margin-top: 0;">Your Configuration</h2>
        <p style="margin: 10px 0;">
          <strong>Monthly Trace Volume:</strong> ${formatNumber(roi.monthlyTraces)} traces
        </p>
        <p style="margin: 10px 0;">
          <strong>Current Tool Cost:</strong> ${formatCurrency(roi.currentToolCost)}/month
        </p>
        <p style="margin: 10px 0;">
          <strong>OpsNexAI Cost:</strong> ${formatCurrency(roi.opsnexaiCost)}/month
        </p>
      </div>

      <div style="background: #1e293b; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h2 style="color: #14b8a6; margin-top: 0;">Financial Impact</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">
          <div style="background: #0f172a; padding: 15px; border-radius: 6px; border-left: 4px solid #14b8a6;">
            <p style="color: #94a3b8; margin: 0 0 5px 0; font-size: 12px;">Monthly Savings</p>
            <p style="color: #14b8a6; margin: 0; font-size: 24px; font-weight: bold;">${formatCurrency(roi.monthlySavings)}</p>
          </div>
          <div style="background: #0f172a; padding: 15px; border-radius: 6px; border-left: 4px solid #10b981;">
            <p style="color: #94a3b8; margin: 0 0 5px 0; font-size: 12px;">Annual Savings</p>
            <p style="color: #10b981; margin: 0; font-size: 24px; font-weight: bold;">${formatCurrency(roi.annualSavings)}</p>
          </div>
        </div>
      </div>

      <div style="background: #1e293b; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h2 style="color: #14b8a6; margin-top: 0;">Key Metrics</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">
          <div style="background: #0f172a; padding: 15px; border-radius: 6px;">
            <p style="color: #94a3b8; margin: 0 0 5px 0; font-size: 12px;">Time to ROI</p>
            <p style="color: #3b82f6; margin: 0; font-size: 20px; font-weight: bold;">${roi.timeToROI === 0 ? "Immediate" : `${roi.timeToROI} months`}</p>
          </div>
          <div style="background: #0f172a; padding: 15px; border-radius: 6px;">
            <p style="color: #94a3b8; margin: 0 0 5px 0; font-size: 12px;">Productivity Gain</p>
            <p style="color: #a855f7; margin: 0; font-size: 20px; font-weight: bold;">${formatCurrency(roi.productivityGain)}</p>
          </div>
        </div>
      </div>

      <div style="background: #1e293b; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h2 style="color: #14b8a6; margin-top: 0;">Summary</h2>
        <ul style="color: #cbd5e1; line-height: 1.8; margin: 0; padding-left: 20px;">
          <li>Save ${formatCurrency(roi.monthlySavings)} per month on observability costs</li>
          <li>Gain ${formatCurrency(roi.productivityGain)} monthly from faster debugging</li>
          <li>Reach ROI in ${roi.timeToROI === 0 ? "the first month" : `${roi.timeToROI} months`}</li>
          <li>Total first-year value: ${formatCurrency(roi.annualSavings + roi.productivityGain * 12)}</li>
        </ul>
      </div>

      <div style="border-top: 1px solid #334155; padding-top: 20px; text-align: center; color: #94a3b8; font-size: 12px;">
        <p style="margin: 0;">
          Ready to get started? Visit <strong>https://aiobserve-gwgqcpim.manus.space</strong> to begin your free trial.
        </p>
        <p style="margin: 10px 0 0 0;">
          Questions? Contact us at <strong>info@opsnexai.com</strong> or call <strong>(425) 202-5790</strong>
        </p>
      </div>
    `;

    document.body.appendChild(container);

    // Convert HTML to canvas
    const canvas = await html2canvas(container, {
      backgroundColor: "#0f172a",
      scale: 2,
    });

    // Create PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgData = canvas.toDataURL("image/png");
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

    // Download PDF
    pdf.save(`OpsNexAI-ROI-Report-${new Date().toISOString().split("T")[0]}.pdf`);

    // Clean up
    document.body.removeChild(container);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF. Please try again.");
  }
}

/**
 * Share ROI results via email
 * Opens email client with pre-filled subject and body
 */
export function shareViaEmail(roi: ROIMetrics, userEmail?: string): void {
  const formatCurrency = (num: number) => `$${num.toLocaleString()}`;
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const subject = encodeURIComponent("My OpsNexAI ROI Analysis");
  const body = encodeURIComponent(`
Hi,

I calculated my potential ROI with OpsNexAI and wanted to share the results:

📊 Configuration:
• Monthly Trace Volume: ${formatNumber(roi.monthlyTraces)}
• Current Tool Cost: ${formatCurrency(roi.currentToolCost)}/month
• OpsNexAI Cost: ${formatCurrency(roi.opsnexaiCost)}/month

💰 Financial Impact:
• Monthly Savings: ${formatCurrency(roi.monthlySavings)}
• Annual Savings: ${formatCurrency(roi.annualSavings)}
• Time to ROI: ${roi.timeToROI === 0 ? "Immediate" : `${roi.timeToROI} months`}
• Productivity Gain: ${formatCurrency(roi.productivityGain)}/month

📈 First-Year Value: ${formatCurrency(roi.annualSavings + roi.productivityGain * 12)}

This analysis shows significant potential for cost savings and productivity improvements with OpsNexAI.

Learn more: https://aiobserve-gwgqcpim.manus.space

Best regards
  `.trim());

  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

/**
 * Copy ROI results to clipboard
 */
export function copyToClipboard(roi: ROIMetrics): Promise<void> {
  const formatCurrency = (num: number) => `$${num.toLocaleString()}`;
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const text = `
OpsNexAI ROI Analysis
=====================

Configuration:
• Monthly Trace Volume: ${formatNumber(roi.monthlyTraces)}
• Current Tool Cost: $${roi.currentToolCost}/month
• OpsNexAI Cost: $${roi.opsnexaiCost}/month

Financial Impact:
• Monthly Savings: ${formatCurrency(roi.monthlySavings)}
• Annual Savings: ${formatCurrency(roi.annualSavings)}
• Time to ROI: ${roi.timeToROI === 0 ? "Immediate" : `${roi.timeToROI} months`}
• Productivity Gain: ${formatCurrency(roi.productivityGain)}/month

First-Year Value: ${formatCurrency(roi.annualSavings + roi.productivityGain * 12)}

Learn more: https://aiobserve-gwgqcpim.manus.space
  `.trim();

  return navigator.clipboard.writeText(text);
}
