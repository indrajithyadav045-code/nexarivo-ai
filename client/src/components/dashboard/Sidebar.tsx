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
  Zap as ZapIcon,
  Lock,
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

interface UserPlan {
  name: "Free" | "Starter" | "Professional" | "Enterprise";
  requestsUsed: number;
  requestsLimit: number;
  storageUsed: number;
  storageLimit: number;
  filesUsed: number;
  filesLimit: number;
  teamMembers: number;
  teamLimit: number;
}

const userPlan: UserPlan = {
  name: "Starter",
  requestsUsed: 287,
  requestsLimit: 500,
  storageUsed: 2.4,
  storageLimit: 10,
  filesUsed: 12,
  filesLimit: 50,
  teamMembers: 1,
  teamLimit: 2,
};

export default function DashboardSidebar() {
  const [location] = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getProgressColor = (used: number, limit: number) => {
    const percentage = (used / limit) * 100;
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-accent";
  };

  return (
    <aside
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } bg-gradient-to-b from-card to-background border-r border-border/50 flex flex-col transition-all duration-300 hidden md:flex shadow-lg`}
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-background font-bold text-sm">N</span>
            </div>
            <span className="font-bold">NEXARIVO</span>
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
              className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-accent to-accent/80 text-accent-foreground shadow-lg shadow-accent/20"
                  : "text-muted-foreground hover:bg-background/50 hover:text-foreground hover:border hover:border-border/50"
              }`}
              title={isCollapsed ? item.label : ""}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </a>
          );
        })}
      </nav>

      {/* Plan Section */}
      {!isCollapsed && (
        <div className="border-t border-border p-4 space-y-4">
          {/* Plan Badge */}
          <div className="bg-gradient-to-r from-accent/20 to-purple-500/20 border border-accent/30 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-accent">{userPlan.name} Plan</span>
              <ZapIcon size={14} className="text-accent" />
            </div>
            <p className="text-xs text-muted-foreground">
              {userPlan.name === "Free"
                ? "Limited features"
                : userPlan.name === "Starter"
                ? "Great for individuals"
                : userPlan.name === "Professional"
                ? "Perfect for teams"
                : "Enterprise ready"}
            </p>
          </div>

          {/* Usage Stats */}
          <div className="space-y-3">
            {/* Requests */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">AI Requests</span>
                <span className="text-xs text-muted-foreground">
                  {userPlan.requestsUsed}/{userPlan.requestsLimit}
                </span>
              </div>
              <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                <div
                  className={`h-full ${getProgressColor(userPlan.requestsUsed, userPlan.requestsLimit)} transition-all`}
                  style={{
                    width: `${(userPlan.requestsUsed / userPlan.requestsLimit) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Storage */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">Storage</span>
                <span className="text-xs text-muted-foreground">
                  {userPlan.storageUsed}GB/{userPlan.storageLimit}GB
                </span>
              </div>
              <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                <div
                  className={`h-full ${getProgressColor(userPlan.storageUsed, userPlan.storageLimit)} transition-all`}
                  style={{
                    width: `${(userPlan.storageUsed / userPlan.storageLimit) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Files */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">Files</span>
                <span className="text-xs text-muted-foreground">
                  {userPlan.filesUsed}/{userPlan.filesLimit}
                </span>
              </div>
              <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                <div
                  className={`h-full ${getProgressColor(userPlan.filesUsed, userPlan.filesLimit)} transition-all`}
                  style={{
                    width: `${(userPlan.filesUsed / userPlan.filesLimit) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Team Members */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">Team Members</span>
                <span className="text-xs text-muted-foreground">
                  {userPlan.teamMembers}/{userPlan.teamLimit}
                </span>
              </div>
              <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                <div
                  className={`h-full ${getProgressColor(userPlan.teamMembers, userPlan.teamLimit)} transition-all`}
                  style={{
                    width: `${(userPlan.teamMembers / userPlan.teamLimit) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Upgrade Button */}
          {userPlan.name !== "Enterprise" && (
            <Button
              variant="outline"
              size="sm"
              className="w-full border-accent text-accent hover:bg-accent/10 gap-2"
            >
              <ZapIcon size={14} />
              Upgrade Plan
            </Button>
          )}

          {/* Limitations Info */}
          {userPlan.name === "Free" && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2">
              <div className="flex gap-2 items-start">
                <Lock size={14} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-yellow-600/80">
                  <p className="font-semibold mb-1">Free Tier Limitations:</p>
                  <ul className="space-y-0.5 text-yellow-600/70">
                    <li>• 50 requests/month</li>
                    <li>• GPT-3.5 only</li>
                    <li>• 100MB storage</li>
                    <li>• 5 files max</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          {!isCollapsed && <p>© 2024 NEXARIVO-AI</p>}
        </div>
      </div>
    </aside>
  );
}
