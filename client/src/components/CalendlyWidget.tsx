import { useEffect } from "react";

interface CalendlyWidgetProps {
  url?: string;
  prefillName?: string;
  prefillEmail?: string;
  hideEventTypeDetails?: boolean;
  pageSettings?: {
    backgroundColor?: string;
    hideGdprBanner?: boolean;
    hideLandingPageDetails?: boolean;
    textColor?: string;
  };
}

/**
 * Calendly Widget Component
 * 
 * Embeds a Calendly scheduling widget on the page.
 * Requires a valid Calendly URL (e.g., https://calendly.com/opsnexai/demo)
 * 
 * Note: Replace the default URL with your actual Calendly booking link
 */
export function CalendlyWidget({
  url = "https://calendly.com/phakhruddin/30-minute-demo",
  prefillName,
  prefillEmail,
  hideEventTypeDetails = false,
  pageSettings,
}: CalendlyWidgetProps) {
  useEffect(() => {
    // Load Calendly script
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Build Calendly URL with parameters
  const buildCalendlyUrl = () => {
    let calendlyUrl = url;
    const params = new URLSearchParams();

    if (hideEventTypeDetails) {
      params.append("hide_event_type_details", "1");
    }

    if (prefillName) {
      params.append("name", prefillName);
    }

    if (prefillEmail) {
      params.append("email", prefillEmail);
    }

    if (pageSettings?.backgroundColor) {
      params.append("background_color", pageSettings.backgroundColor);
    }

    if (pageSettings?.textColor) {
      params.append("text_color", pageSettings.textColor);
    }

    if (pageSettings?.hideGdprBanner) {
      params.append("hide_gdpr_banner", "1");
    }

    if (pageSettings?.hideLandingPageDetails) {
      params.append("hide_landing_page_details", "1");
    }

    const queryString = params.toString();
    return queryString ? `${calendlyUrl}?${queryString}` : calendlyUrl;
  };

  return (
    <div className="calendly-widget-wrapper">
      <div
        className="calendly-inline-widget"
        data-url={buildCalendlyUrl()}
        style={{
          minWidth: "320px",
          height: "650px",
          borderRadius: "0.65rem",
          overflow: "hidden",
        }}
      />
    </div>
  );
}
