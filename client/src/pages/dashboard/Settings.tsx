import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/_core/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { Bell, Key, User, Palette, Copy, Eye, EyeOff } from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey] = useState("sk_live_51234567890abcdefghij");

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border p-6">
        <h2 className="text-2xl font-bold mb-2">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="profile" className="w-full max-w-4xl">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="gap-2">
              <User size={16} />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="api" className="gap-2">
              <Key size={16} />
              <span className="hidden sm:inline">API Keys</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell size={16} />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Palette size={16} />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6 mt-6">
            <Card className="p-6 bg-background border-border">
              <h3 className="text-lg font-bold mb-4">Profile Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Name</label>
                  <Input defaultValue={user?.name || ""} />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Email</label>
                  <Input defaultValue={user?.email || ""} disabled />
                </div>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Save Changes
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* API Keys Tab */}
          <TabsContent value="api" className="space-y-6 mt-6">
            <Card className="p-6 bg-background border-border">
              <h3 className="text-lg font-bold mb-4">API Keys</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Live API Key</label>
                  <div className="flex gap-2">
                    <Input
                      value={showApiKey ? apiKey : "•".repeat(apiKey.length)}
                      readOnly
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="px-3"
                    >
                      {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(apiKey)}
                      className="px-3"
                    >
                      <Copy size={16} />
                    </Button>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Generate New Key
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6 mt-6">
            <Card className="p-6 bg-background border-border">
              <h3 className="text-lg font-bold mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { label: "Email notifications", description: "Receive updates via email" },
                  { label: "Agent alerts", description: "Get notified when agents complete tasks" },
                  { label: "Usage warnings", description: "Alert when approaching usage limits" },
                  { label: "Security alerts", description: "Important account security notifications" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium text-sm">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    <Switch defaultChecked={idx < 2} />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6 mt-6">
            <Card className="p-6 bg-background border-border">
              <h3 className="text-lg font-bold mb-4">Appearance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium text-sm">Dark Mode</p>
                    <p className="text-xs text-muted-foreground">
                      Current: {theme === "dark" ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                  <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
