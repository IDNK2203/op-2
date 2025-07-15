import SideNav from "./side-nav";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex gap-24 container max-w-7xl mx-auto p-4 pt-12">
      <SideNav />

      {children}
    </div>
  );
}
