import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  FolderOpen,
  FileText,
  Database,
  Zap,
  BarChart3,
  Settings,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { icon: MessageSquare, label: "Chat", href: "/dashboard/chat" },
  { icon: FolderOpen, label: "Projects", href: "/dashboard/projects" },
  { icon: FileText, label: "Documents", href: "/dashboard/documents" },
  { icon: Database, label: "Knowledge Base", href: "/dashboard/knowledge-base" },
  { icon: Zap, label: "Agents", href: "/dashboard/agents" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardSidebar() {
  const [location] = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } bg-card border-r border-border flex flex-col transition-all duration-300 hidden md:flex`}
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-background font-bold text-sm">N</span>
            </div>
            <span className="font-bold">Nexarivo</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft size={18} className={isCollapsed ? "rotate-180" : ""} />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;

          return (
            <a
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-background hover:text-foreground"
              }`}
              title={isCollapsed ? item.label : ""}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </a>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          {!isCollapsed && <p>© 2024 Nexarivo</p>}
        </div>
      </div>
    </aside>
  );
}
