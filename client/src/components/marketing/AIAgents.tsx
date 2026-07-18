import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Code, PenTool, Briefcase, BookOpen, Zap } from "lucide-react";

const agents = [
  {
    icon: Brain,
    name: "Research Agent",
    description: "Gather and synthesize information from multiple sources",
  },
  {
    icon: Code,
    name: "Coding Agent",
    description: "Generate, debug, and optimize code in any language",
  },
  {
    icon: PenTool,
    name: "Writing Agent",
    description: "Create compelling content with AI assistance",
  },
  {
    icon: Briefcase,
    name: "Business Agent",
    description: "Analyze data and generate business insights",
  },
  {
    icon: BookOpen,
    name: "Learning Agent",
    description: "Create educational content and explanations",
  },
  {
    icon: Zap,
    name: "Automation Agent",
    description: "Automate repetitive tasks and workflows",
  },
];

export default function AIAgents() {
  return (
    <section className="py-20 md:py-32 bg-card/20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">AI Agents</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Specialized agents designed for different tasks and workflows
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent, idx) => {
            const Icon = agent.icon;
            return (
              <Card
                key={idx}
                className="p-6 bg-background border-border hover:border-accent/50 hover:shadow-premium transition-all duration-300 group cursor-pointer"
              >
                <div className="mb-4 inline-block p-3 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                  <Icon size={24} className="text-accent" />
                </div>
                <h3 className="text-lg font-bold mb-2">{agent.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{agent.description}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-accent hover:text-accent hover:bg-accent/10"
                >
                  Launch Agent →
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
