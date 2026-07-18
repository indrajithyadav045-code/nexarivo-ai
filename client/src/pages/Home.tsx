import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import Navbar from "@/components/marketing/Navbar";
import Hero from "@/components/marketing/Hero";
import Features from "@/components/marketing/Features";
import WorkspacePreview from "@/components/marketing/WorkspacePreview";
import AIAgents from "@/components/marketing/AIAgents";
import Integrations from "@/components/marketing/Integrations";
import Pricing from "@/components/marketing/Pricing";
import FAQ from "@/components/marketing/FAQ";
import CTA from "@/components/marketing/CTA";
import Footer from "@/components/marketing/Footer";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (isAuthenticated) {
    setLocation("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <Features />
      <WorkspacePreview />
      <AIAgents />
      <Integrations />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
