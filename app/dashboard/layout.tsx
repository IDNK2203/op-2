import AdminAuthGuard from "@/components/admin-guard";
import SideNav from "./side-nav";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-[#F2F4F0]/30">
        <div className="flex">
          {/* Fixed Sidebar */}
          <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-[#35174D]/10 shadow-sm">
            <div className="flex flex-col h-full">
              {/* Sidebar Header */}
              <div className="p-6 border-b border-[#35174D]/10">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#A34280] to-[#35174D] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">C</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-[#35174D]">
                      Dashboard
                    </h2>
                    <p className="text-xs text-[#35174D]/60">Compliance Hub</p>
                  </div>
                </div>
              </div>

              {/* Sidebar Navigation */}
              <div className="flex-1 p-4">
                <SideNav />
              </div>

              {/* Sidebar Footer */}
              <div className="p-4 border-t border-[#35174D]/10">
                <div className="text-xs text-[#35174D]/50 text-center">
                  v1.0.0 - ComplianceHub
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 ml-64">
            <div className="p-8">{children}</div>
          </div>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
