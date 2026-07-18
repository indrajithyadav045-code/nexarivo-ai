import { Brain, Zap, FileText, Database, BarChart3, Workflow, Sparkles } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Research Agent",
    description: "Intelligent research with real-time data gathering, synthesis, and analysis powered by Claude and ChatGPT",
    span: "col-span-1 md:col-span-2",
    gradient: "from-blue-500/20 to-purple-500/20",
  },
  {
    icon: Zap,
    title: "Code Generation",
    description: "Generate, debug, and optimize code across multiple languages with AI assistance",
    span: "col-span-1",
    gradient: "from-yellow-500/20 to-orange-500/20",
  },
  {
    icon: FileText,
    title: "Document Creation",
    description: "AI-assisted writing with smart suggestions, formatting, and markdown support",
    span: "col-span-1",
    gradient: "from-pink-500/20 to-red-500/20",
  },
  {
    icon: Database,
    title: "Knowledge Base",
    description: "Organize and retrieve information instantly with semantic search capabilities",
    span: "col-span-1 md:col-span-2",
    gradient: "from-green-500/20 to-emerald-500/20",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Track usage, performance, tokens consumed, and AI model performance metrics",
    span: "col-span-1",
    gradient: "from-cyan-500/20 to-blue-500/20",
  },
  {
    icon: Workflow,
    title: "Workflow Automation",
    description: "Automate repetitive tasks and streamline processes with intelligent agents",
    span: "col-span-1",
    gradient: "from-violet-500/20 to-purple-500/20",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 md:py-32 bg-gradient-to-b from-background via-card/20 to-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/3 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 mb-4">
            <Sparkles size={16} className="text-accent" />
            <span className="text-sm font-semibold">Powerful Capabilities</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Everything You Need</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive AI tools designed to boost your productivity and streamline your workflow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className={`${feature.span} group`}
              >
                <div className={`relative h-full p-8 rounded-2xl bg-gradient-to-br ${feature.gradient} border border-border/50 hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 overflow-hidden`}>
                  {/* Animated background */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent"></div>
                  </div>

                  <div className="relative z-10">
                    <div className="mb-4 inline-block p-3 rounded-xl bg-background/80 group-hover:bg-accent/20 transition-colors duration-300">
                      <Icon size={24} className="text-accent group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors duration-300">{feature.title}</h3>
                    <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">{feature.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
