import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, Upload, File, MoreVertical, Trash2, Download, Loader } from "lucide-react";
import { useState, useRef } from "react";

interface KnowledgeItem {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: Date;
  status: "processing" | "ready" | "error";
}

interface Plugin {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  icon: string;
}

const mockItems: KnowledgeItem[] = [
  {
    id: "1",
    name: "Company_Handbook_2024.pdf",
    type: "PDF",
    size: "2.4 MB",
    uploadedAt: new Date("2024-01-15"),
    status: "ready",
  },
  {
    id: "2",
    name: "Technical_Specifications.docx",
    type: "Document",
    size: "1.8 MB",
    uploadedAt: new Date("2024-01-14"),
    status: "ready",
  },
  {
    id: "3",
    name: "Market_Data_Q4.xlsx",
    type: "Spreadsheet",
    size: "3.2 MB",
    uploadedAt: new Date("2024-01-13"),
    status: "processing",
  },
];

const plugins: Plugin[] = [
  {
    id: "1",
    name: "PDF Parser",
    description: "Extract and analyze PDF documents",
    enabled: true,
    icon: "📄",
  },
  {
    id: "2",
    name: "Web Scraper",
    description: "Fetch and process web content",
    enabled: true,
    icon: "🌐",
  },
  {
    id: "3",
    name: "Data Analyzer",
    description: "Analyze spreadsheets and datasets",
    enabled: true,
    icon: "📊",
  },
  {
    id: "4",
    name: "Image Extractor",
    description: "Extract text from images (OCR)",
    enabled: false,
    icon: "🖼️",
  },
  {
    id: "5",
    name: "Video Summarizer",
    description: "Summarize video transcripts",
    enabled: false,
    icon: "🎥",
  },
];

export default function KnowledgeBase() {
  const [items, setItems] = useState<KnowledgeItem[]>(mockItems);
  const [allPlugins, setAllPlugins] = useState<Plugin[]>(plugins);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"files" | "plugins">("files");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setIsUploading(true);
      setTimeout(() => {
        const newItems: KnowledgeItem[] = Array.from(files).map((file, idx) => ({
          id: (Date.now() + idx).toString(),
          name: file.name,
          type: file.type || "File",
          size: (file.size / 1024 / 1024).toFixed(2) + " MB",
          uploadedAt: new Date(),
          status: "processing",
        }));
        setItems((prev) => [...newItems, ...prev]);
        setIsUploading(false);
      }, 1500);
    }
  };

  const togglePlugin = (pluginId: string) => {
    setAllPlugins((prev) =>
      prev.map((p) => (p.id === pluginId ? { ...p, enabled: !p.enabled } : p))
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Knowledge Base</h2>
            <p className="text-sm text-muted-foreground">Upload files and manage plugins</p>
          </div>
          {activeTab === "files" && (
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
            >
              {isUploading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Upload File
                </>
              )}
            </Button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.docx,.xlsx,.txt,.csv,.doc,.xls"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border">
          <button
            onClick={() => setActiveTab("files")}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === "files"
                ? "text-accent border-b-2 border-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Files ({items.length})
          </button>
          <button
            onClick={() => setActiveTab("plugins")}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === "plugins"
                ? "text-accent border-b-2 border-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Plugins ({allPlugins.filter((p) => p.enabled).length}/{allPlugins.length})
          </button>
        </div>

        {/* Search (Files tab only) */}
        {activeTab === "files" && (
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === "files" ? (
          filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <File size={48} className="text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No files uploaded</h3>
              <p className="text-muted-foreground mb-4">Upload your first file to build your knowledge base</p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
              >
                <Upload size={18} />
                Upload File
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className="p-4 bg-background border-border hover:border-accent/50 hover:shadow-premium transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                        <File size={20} className="text-accent" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs bg-card px-2 py-1 rounded">{item.type}</span>
                          <span className="text-xs text-muted-foreground">{item.size}</span>
                          <span className="text-xs text-muted-foreground">
                            {item.uploadedAt.toLocaleDateString()}
                          </span>
                          {item.status === "processing" && (
                            <span className="text-xs flex items-center gap-1 text-yellow-400">
                              <Loader size={12} className="animate-spin" />
                              Processing...
                            </span>
                          )}
                          {item.status === "ready" && (
                            <span className="text-xs text-green-400">✓ Ready</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Download size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                        onClick={() => setItems((prev) => prev.filter((i) => i.id !== item.id))}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPlugins.map((plugin) => (
              <Card
                key={plugin.id}
                className={`p-6 border-border transition-all duration-300 ${
                  plugin.enabled
                    ? "bg-gradient-to-br from-accent/10 to-accent/5 border-accent/50"
                    : "bg-background hover:border-border/50"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{plugin.icon}</div>
                  <button
                    onClick={() => togglePlugin(plugin.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      plugin.enabled ? "bg-accent" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                        plugin.enabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                <h3 className="font-bold mb-1">{plugin.name}</h3>
                <p className="text-sm text-muted-foreground">{plugin.description}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
