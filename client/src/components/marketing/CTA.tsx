import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-purple-900/20 border-t border-b border-border">
      <div className="container max-w-3xl text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Ready to transform your productivity?
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Join thousands of professionals using Nexarivo to work smarter with AI.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={() => startLogin()}
            className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 group"
          >
            Start Your Free Trial
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button size="lg" variant="outline">
            Schedule a Demo
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mt-6">
          No credit card required. 14-day free trial.
        </p>
      </div>
    </section>
  );
}
