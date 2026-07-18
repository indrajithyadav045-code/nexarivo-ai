import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, FileText, MoreVertical } from "lucide-react";
import { useState } from "react";

interface Document {
  id: string;
  title: string;
  preview: string;
  status: "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
}

const mockDocuments: Document[] = [
  {
    id: "1",
    title: "API Integration Guide",
    preview: "Complete guide for integrating our API into your application...",
    status: "published",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: "2",
    title: "Product Roadmap 2024",
    preview: "Upcoming features and improvements planned for this year...",
    status: "draft",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-17"),
  },
];

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDocuments = documents.filter(
    (d) =>
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.preview.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Documents</h2>
            <p className="text-sm text-muted-foreground">Create and manage documents</p>
          </div>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
            <Plus size={18} />
            New Document
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Documents List */}
      <div className="flex-1 overflow-auto p-6">
        {filteredDocuments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <FileText size={48} className="text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No documents found</h3>
            <p className="text-muted-foreground mb-4">Create your first document to get started</p>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
              <Plus size={18} />
              Create Document
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDocuments.map((doc) => (
              <Card
                key={doc.id}
                className="p-6 bg-background border-border hover:border-accent/50 hover:shadow-premium transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText size={20} className="text-accent" />
                      <h3 className="text-lg font-bold">{doc.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {doc.preview}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        doc.status === "published"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        {doc.status}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Updated {doc.updatedAt.toLocaleDateString()}
                      </span>
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
