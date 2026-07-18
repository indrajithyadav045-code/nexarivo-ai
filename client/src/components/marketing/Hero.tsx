import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 pb-20">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Sparkles size={16} className="text-accent" />
          <span className="text-sm font-medium">Introducing Nexarivo AI Platform</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <span className="block mb-2">Your AI-Powered</span>
          <span className="gradient-text">Productivity Companion</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          Harness the power of advanced AI agents to research, code, create, and analyze. Transform your workflow with intelligent automation.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
          <Button
            size="lg"
            onClick={() => startLogin()}
            className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 group"
          >
            Start Free Trial
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="gap-2"
          >
            Watch Demo
          </Button>
        </div>

        {/* Trust Badge */}
        <div className="mt-12 pt-12 border-t border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
          <p className="text-sm text-muted-foreground mb-4">Trusted by innovative teams worldwide</p>
          <div className="flex items-center justify-center gap-8 flex-wrap opacity-60">
            {['OpenAI', 'Vercel', 'Linear', 'Notion', 'Perplexity', 'Cursor'].map((company) => (
              <div key={company} className="text-sm font-medium text-muted-foreground">
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
