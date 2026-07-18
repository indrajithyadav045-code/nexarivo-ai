import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { ArrowRight, Sparkles, Zap } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 pb-20">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      <div className="container max-w-5xl mx-auto px-4 text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent/20 to-purple-500/20 border border-accent/30 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Sparkles size={16} className="text-accent animate-spin" style={{ animationDuration: "3s" }} />
          <span className="text-sm font-semibold bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
            Introducing NEXARIVO-AI
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <span className="block mb-2 text-foreground">Your AI-Powered</span>
          <span className="block bg-gradient-to-r from-yellow-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            Productivity Companion
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 leading-relaxed">
          Harness the power of advanced AI agents from OpenAI and Anthropic. Research, code, create, and analyze with intelligent automation. Transform your workflow with streaming responses, markdown rendering, and seamless integrations.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
          <Button
            size="lg"
            onClick={() => startLogin()}
            className="bg-gradient-to-r from-yellow-400 to-purple-500 text-background hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 font-semibold gap-2 group px-8 py-6 text-lg"
          >
            Start Free Trial
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="gap-2 border-border hover:bg-card px-8 py-6 text-lg"
          >
            <Zap size={20} />
            Watch Demo
          </Button>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 pt-16 border-t border-border/30 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
          <p className="text-sm font-semibold text-muted-foreground mb-6">Powered by Industry Leaders</p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔵</span>
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Powered by</p>
                <p className="font-semibold">OpenAI</p>
              </div>
            </div>
            <div className="w-px h-8 bg-border/30"></div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🟠</span>
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Powered by</p>
                <p className="font-semibold">Anthropic</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-3 gap-6 max-w-2xl mx-auto">
          {[
            { label: "AI Models", value: "4+" },
            { label: "Response Time", value: "<2s" },
            { label: "Uptime", value: "99.9%" },
          ].map((stat, idx) => (
            <div key={idx} className="p-4 rounded-lg bg-card/50 border border-border/30">
              <p className="text-2xl font-bold text-accent">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
