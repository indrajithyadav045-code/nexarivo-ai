import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, MoreVertical, Folder } from "lucide-react";
import { useState } from "react";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const mockProjects: Project[] = [
  {
    id: "1",
    name: "Market Research Analysis",
    description: "Analyzing Q4 market trends and competitor insights",
    status: "active",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: "2",
    name: "Product Documentation",
    description: "Writing comprehensive API documentation",
    status: "active",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-17"),
  },
  {
    id: "3",
    name: "Code Refactoring",
    description: "Refactoring legacy codebase with AI assistance",
    status: "archived",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-12"),
  },
];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Projects</h2>
            <p className="text-sm text-muted-foreground">Manage your AI projects</p>
          </div>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
            <Plus size={18} />
            New Project
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="flex-1 overflow-auto p-6">
        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Folder size={48} className="text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-4">Create your first project to get started</p>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
              <Plus size={18} />
              Create Project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                className="p-6 bg-background border-border hover:border-accent/50 hover:shadow-premium transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <Folder size={20} className="text-accent" />
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical size={16} />
                  </Button>
                </div>

                <h3 className="text-lg font-bold mb-2">{project.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {project.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    project.status === "active"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}>
                    {project.status}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {project.updatedAt.toLocaleDateString()}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
