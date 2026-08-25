import { Toaster } from "@/components/ui/sonner";
import { lazy, Suspense } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useAuth } from "@/_core/hooks/useAuth";
import Home from "./pages/Home";
const Dashboard = lazy(() => import("./pages/Dashboard"));
const DashboardChat = lazy(() => import("./pages/dashboard/Chat"));
const DashboardProjects = lazy(() => import("./pages/dashboard/Projects"));
const DashboardDocuments = lazy(() => import("./pages/dashboard/Documents"));
const DashboardKnowledgeBase = lazy(() => import("./pages/dashboard/KnowledgeBase"));
const DashboardAgents = lazy(() => import("./pages/dashboard/Agents"));
const DashboardAnalytics = lazy(() => import("./pages/dashboard/Analytics"));
const DashboardSettings = lazy(() => import("./pages/dashboard/Settings"));

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = '/';
    return null;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/dashboard/chat" component={() => <ProtectedRoute component={DashboardChat} />} />
      <Route path="/dashboard/projects" component={() => <ProtectedRoute component={DashboardProjects} />} />
      <Route path="/dashboard/documents" component={() => <ProtectedRoute component={DashboardDocuments} />} />
      <Route path="/dashboard/knowledge-base" component={() => <ProtectedRoute component={DashboardKnowledgeBase} />} />
      <Route path="/dashboard/agents" component={() => <ProtectedRoute component={DashboardAgents} />} />
      <Route path="/dashboard/analytics" component={() => <ProtectedRoute component={DashboardAnalytics} />} />
      <Route path="/dashboard/settings" component={() => <ProtectedRoute component={DashboardSettings} />} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable>
        <TooltipProvider>
          <Toaster />
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">Loading workspace…</div>}>
            <Router />
          </Suspense>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
