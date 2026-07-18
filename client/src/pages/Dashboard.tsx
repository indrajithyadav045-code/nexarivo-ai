import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import DashboardTopbar from "@/components/dashboard/Topbar";

export default function Dashboard() {
  const { user } = useAuth();
  const [location] = useLocation();

  // Redirect to chat if on dashboard root
  if (location === "/dashboard") {
    window.location.href = "/dashboard/chat";
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardTopbar user={user} />
        <main className="flex-1 overflow-auto">
          {/* Child routes will render here */}
        </main>
      </div>
    </div>
  );
}
