import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Zap } from "lucide-react";
import { startLogin } from "@/const";

const plans = [
  {
    name: "Starter",
    price: "$29",
    description: "Perfect for individuals exploring AI",
    features: [
      "Up to 100 AI requests/month",
      "GPT-3.5 & Claude 3 Sonnet",
      "1 project",
      "Email support",
      "1GB knowledge base",
      "Basic analytics",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$99",
    description: "For teams and power users",
    features: [
      "Up to 1,000 AI requests/month",
      "All AI models (GPT-4, Claude 3 Opus)",
      "Unlimited projects",
      "Priority support",
      "100GB knowledge base",
      "Advanced analytics",
      "Team collaboration (3 members)",
      "Custom integrations",
      "Streaming responses",
      "Markdown rendering",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations",
    features: [
      "Unlimited AI requests",
      "All AI models + custom models",
      "Unlimited projects",
      "24/7 priority support",
      "Unlimited knowledge base",
      "Advanced analytics & reporting",
      "Unlimited team members",
      "SSO & advanced security",
      "Dedicated account manager",
      "Custom SLA",
      "On-premise deployment",
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <Card
              key={idx}
              className={`relative flex flex-col transition-all duration-300 ${
                plan.highlighted
                  ? "border-2 border-accent bg-gradient-to-br from-background to-card shadow-2xl shadow-accent/20 md:scale-105 md:z-10"
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

              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>

                <div className="mb-8">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-muted-foreground">/month</span>}
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

                <div className="space-y-4 flex-1">
                  {plan.features.map((feature, fidx) => (
                    <div key={fidx} className="flex items-start gap-3">
                      <Check size={20} className="text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground/80">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">All plans include:</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {["Streaming Responses", "Markdown Rendering", "Chat History", "Analytics", "Priority Support"].map(
              (item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Check size={18} className="text-accent" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
