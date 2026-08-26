import { useAuth } from "@/_core/hooks/useAuth";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import DashboardTopbar from "@/components/dashboard/Topbar";

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardTopbar user={user} />
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <section className="mx-auto max-w-6xl space-y-8">
            <div>
              <p className="text-sm font-medium text-accent">Workspace overview</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}.</h1>
              <p className="mt-2 text-muted-foreground">Choose a workspace tool from the sidebar, or continue with your latest project.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { label: "AI requests", value: "287", detail: "this month" },
                { label: "Active projects", value: "12", detail: "across your workspace" },
                { label: "Knowledge base", value: "2.4 GB", detail: "of available storage" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-border/60 bg-card/70 p-5 shadow-sm">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-3 text-2xl font-semibold">{stat.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.detail}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
