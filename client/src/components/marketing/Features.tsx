import { Brain, Zap, FileText, Database, BarChart3, Workflow } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Research Agent",
    description: "Intelligent research with real-time data gathering and synthesis",
    span: "col-span-1 md:col-span-2",
  },
  {
    icon: Zap,
    title: "Code Generation",
    description: "Generate, debug, and optimize code across multiple languages",
    span: "col-span-1",
  },
  {
    icon: FileText,
    title: "Document Creation",
    description: "AI-assisted writing with smart suggestions and formatting",
    span: "col-span-1",
  },
  {
    icon: Database,
    title: "Knowledge Base",
    description: "Organize and retrieve information instantly",
    span: "col-span-1 md:col-span-2",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Track usage, performance, and insights",
    span: "col-span-1",
  },
  {
    icon: Workflow,
    title: "Workflow Automation",
    description: "Automate repetitive tasks and streamline processes",
    span: "col-span-1",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 md:py-32 bg-card/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to boost productivity with AI-powered tools
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className={`${feature.span} p-6 rounded-2xl bg-background border border-border hover:border-accent/50 hover:shadow-premium transition-all duration-300 group cursor-pointer`}
              >
                <div className="mb-4 inline-block p-3 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                  <Icon size={24} className="text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
