import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import OAAS from "./pages/OAAS";
import IntegrationGuides from "./pages/IntegrationGuides";
import { LiveChatWidget } from "./components/LiveChatWidget";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/oaas"} component={OAAS} />
      <Route path={"/integration-guides"} component={IntegrationGuides} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

// NOTE: LiveChatWidget
// - Provides real-time support and engagement for website visitors
// - Floating widget with minimizable chat interface
// - Automatically available on all pages

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
          <LiveChatWidget />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
