import { Card } from "@/components/ui/card";

export default function WorkspacePreview() {
  return (
    <section className="py-20 md:py-32">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Workspace Preview</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the power of our intuitive dashboard
          </p>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-border shadow-premium-lg">
          {/* Mock Dashboard */}
          <div className="bg-gradient-to-b from-card to-background p-8 min-h-[500px]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Sidebar Mock */}
              <div className="hidden md:block space-y-4">
                <div className="h-8 bg-border/50 rounded w-3/4"></div>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-10 bg-border/30 rounded"></div>
                ))}
              </div>

              {/* Main Content Mock */}
              <div className="md:col-span-2 space-y-6">
                <div className="h-12 bg-border/50 rounded w-1/3"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="p-4 bg-background/50 border-border/50">
                      <div className="h-6 bg-border/30 rounded mb-3 w-2/3"></div>
                      <div className="h-4 bg-border/20 rounded w-full mb-2"></div>
                      <div className="h-4 bg-border/20 rounded w-5/6"></div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Overlay gradient */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background via-transparent to-transparent opacity-50"></div>
        </div>
      </div>
    </section>
  );
}
