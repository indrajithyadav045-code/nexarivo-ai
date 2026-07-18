import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Code, PenTool, Briefcase, BookOpen, Zap } from "lucide-react";

const agents = [
  {
    icon: Brain,
    name: "Research Agent",
    description: "Gather and synthesize information from multiple sources",
    status: "active",
  },
  {
    icon: Code,
    name: "Coding Agent",
    description: "Generate, debug, and optimize code in any language",
    status: "active",
  },
  {
    icon: PenTool,
    name: "Writing Agent",
    description: "Create compelling content with AI assistance",
    status: "active",
  },
  {
    icon: Briefcase,
    name: "Business Agent",
    description: "Analyze data and generate business insights",
    status: "active",
  },
  {
    icon: BookOpen,
    name: "Learning Agent",
    description: "Create educational content and explanations",
    status: "active",
  },
  {
    icon: Zap,
    name: "Automation Agent",
    description: "Automate repetitive tasks and workflows",
    status: "active",
  },
];

export default function Agents() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border p-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">AI Agents</h2>
          <p className="text-sm text-muted-foreground">Browse and launch specialized AI agents</p>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent, idx) => {
            const Icon = agent.icon;
            return (
              <Card
                key={idx}
                className="p-6 bg-background border-border hover:border-accent/50 hover:shadow-premium transition-all duration-300 group cursor-pointer flex flex-col"
              >
                <div className="mb-4 inline-block p-3 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors w-fit">
                  <Icon size={24} className="text-accent" />
                </div>
                <h3 className="text-lg font-bold mb-2">{agent.name}</h3>
                <p className="text-muted-foreground text-sm mb-4 flex-1">{agent.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-xs font-medium px-2 py-1 rounded bg-green-500/20 text-green-400">
                    {agent.status}
                  </span>
                  <Button
                    size="sm"
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    Launch
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
