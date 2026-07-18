import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, Upload, File, MoreVertical } from "lucide-react";
import { useState } from "react";

interface KnowledgeItem {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: Date;
}

const mockItems: KnowledgeItem[] = [
  {
    id: "1",
    name: "Company_Handbook_2024.pdf",
    type: "PDF",
    size: "2.4 MB",
    uploadedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Technical_Specifications.docx",
    type: "Document",
    size: "1.8 MB",
    uploadedAt: new Date("2024-01-14"),
  },
  {
    id: "3",
    name: "Market_Data_Q4.xlsx",
    type: "Spreadsheet",
    size: "3.2 MB",
    uploadedAt: new Date("2024-01-13"),
  },
];

export default function KnowledgeBase() {
  const [items, setItems] = useState<KnowledgeItem[]>(mockItems);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Knowledge Base</h2>
            <p className="text-sm text-muted-foreground">Upload and manage reference files</p>
          </div>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
            <Upload size={18} />
            Upload File
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Files List */}
      <div className="flex-1 overflow-auto p-6">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <File size={48} className="text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No files uploaded</h3>
            <p className="text-muted-foreground mb-4">Upload your first file to build your knowledge base</p>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
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
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical size={16} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
