import { Card } from "@/components/ui/card";

const integrations = [
  { name: "OpenAI", icon: "🤖" },
  { name: "Google", icon: "🔍" },
  { name: "Slack", icon: "💬" },
  { name: "GitHub", icon: "🐙" },
  { name: "Notion", icon: "📝" },
  { name: "Zapier", icon: "⚡" },
  { name: "Stripe", icon: "💳" },
  { name: "Salesforce", icon: "☁️" },
];

export default function Integrations() {
  return (
    <section className="py-20 md:py-32">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Integrations</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with your favorite tools and services
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {integrations.map((integration, idx) => (
            <Card
              key={idx}
              className="p-6 flex flex-col items-center justify-center text-center bg-background border-border hover:border-accent/50 hover:shadow-premium transition-all duration-300 cursor-pointer group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{integration.icon}</div>
              <h3 className="font-semibold text-sm">{integration.name}</h3>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
