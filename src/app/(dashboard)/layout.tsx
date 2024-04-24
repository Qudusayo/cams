
import Sidebar from "@/components/sidebar";
import AuthNav from "@/components/auth-nav";
import { AuthProvider } from "../context/auth-context";
 
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <section className="flex h-screen">
        <Sidebar />
        <div className="flex h-full flex-1 flex-col bg-[#FAFAFA]">
          <AuthNav />
          <div className="mb-8 flex-1 overflow-y-auto px-4 py-5">
            {children}
          </div>
        </div>
      </section>
    </AuthProvider>
  );
}
