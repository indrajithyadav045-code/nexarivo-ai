import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X, Zap } from "lucide-react";
import { startLogin } from "@/const";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for exploring AI capabilities",
    features: [
      { text: "Up to 50 AI requests/month", included: true },
      { text: "GPT-3.5 Turbo only", included: true },
      { text: "1 project", included: true },
      { text: "Email support", included: true },
      { text: "100MB knowledge base", included: true },
      { text: "Basic analytics", included: true },
      { text: "File uploads (5 files max)", included: true },
      { text: "Community plugins", included: true },
      { text: "GPT-4 & Claude models", included: false },
      { text: "Advanced plugins", included: false },
      { text: "Team collaboration", included: false },
      { text: "Priority support", included: false },
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Starter",
    price: "$99",
    period: "/month",
    description: "For individual creators and developers",
    features: [
      { text: "Up to 500 AI requests/month", included: true },
      { text: "All AI models (GPT-4, Claude 3)", included: true },
      { text: "5 projects", included: true },
      { text: "Priority email support", included: true },
      { text: "10GB knowledge base", included: true },
      { text: "Advanced analytics", included: true },
      { text: "File uploads (50 files max)", included: true },
      { text: "All plugins + custom plugins", included: true },
      { text: "Team collaboration (2 members)", included: true },
      { text: "Streaming responses", included: true },
      { text: "Markdown rendering", included: true },
      { text: "API access", included: true },
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Professional",
    price: "$399",
    period: "/month",
    description: "For teams and power users",
    features: [
      { text: "Up to 5,000 AI requests/month", included: true },
      { text: "All AI models + custom models", included: true },
      { text: "Unlimited projects", included: true },
      { text: "24/7 priority support", included: true },
      { text: "100GB knowledge base", included: true },
      { text: "Advanced analytics & reporting", included: true },
      { text: "Unlimited file uploads", included: true },
      { text: "All plugins + enterprise plugins", included: true },
      { text: "Team collaboration (10 members)", included: true },
      { text: "Advanced security features", included: true },
      { text: "Webhook integrations", included: true },
      { text: "Custom branding", included: true },
    ],
    cta: "Start Free Trial",
    highlighted: false,
  },
  {
    name: "Enterprise",
    price: "$799",
    period: "/month",
    description: "For large organizations",
    features: [
      { text: "Unlimited AI requests", included: true },
      { text: "All AI models + dedicated models", included: true },
      { text: "Unlimited projects", included: true },
      { text: "24/7 dedicated support", included: true },
      { text: "Unlimited knowledge base", included: true },
      { text: "Custom analytics & dashboards", included: true },
      { text: "Unlimited file uploads", included: true },
      { text: "All plugins + priority development", included: true },
      { text: "Unlimited team members", included: true },
      { text: "Enterprise security & compliance", included: true },
      { text: "Advanced webhook integrations", included: true },
      { text: "White-label solution", included: true },
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 md:py-32 bg-gradient-to-b from-background via-card/10 to-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your needs. Always flexible to scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, idx) => (
            <Card
              key={idx}
              className={`relative flex flex-col transition-all duration-300 ${
                plan.highlighted
                  ? "border-2 border-accent bg-gradient-to-br from-background to-card shadow-2xl shadow-accent/20 lg:scale-105 lg:z-10"
                  : "border border-border hover:border-accent/50 hover:shadow-lg"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-purple-500 text-background text-sm font-bold">
                    <Zap size={16} />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>

                <div className="mb-8">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground text-sm">{plan.period}</span>}
                </div>

                <Button
                  onClick={() => startLogin()}
                  className={`w-full mb-8 font-semibold py-6 text-base transition-all duration-300 ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-yellow-400 to-purple-500 text-background hover:shadow-lg hover:shadow-purple-500/50"
                      : "border border-border hover:bg-card hover:border-accent/50"
                  }`}
                >
                  {plan.cta}
                </Button>

                <div className="space-y-3 flex-1">
                  {plan.features.map((feature, fidx) => (
                    <div key={fidx} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check size={18} className="text-accent flex-shrink-0 mt-0.5" />
                      ) : (
                        <X size={18} className="text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={`text-sm ${feature.included ? "text-foreground/80" : "text-muted-foreground/50 line-through"}`}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-6">All plans include:</p>
          <div className="flex flex-wrap items-center justify-center gap-8 max-w-4xl mx-auto">
            {[
              "Streaming Responses",
              "Markdown Rendering",
              "Chat History",
              "File Upload",
              "Plugins Support",
              "Analytics",
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Check size={18} className="text-accent" />
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
