"use client";

import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { Authenticated } from "convex/react";
import { ClipboardPen, Cog, FilesIcon, Search, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideNav() {
  const pathname = usePathname();

  const navigation = [
    {
      name: "Overview",
      href: "/dashboard",
      icon: Home,
      description: "Dashboard home",
    },
    {
      name: "Search",
      href: "/dashboard/search",
      icon: Search,
      description: "AI-powered search",
    },
    {
      name: "Documents",
      href: "/dashboard/documents",
      icon: FilesIcon,
      description: "Manage documents",
    },
    {
      name: "Notes",
      href: "/dashboard/notes",
      icon: ClipboardPen,
      description: "Quick notes",
    },
    // {
    //   name: "Analytics",
    //   href: "/dashboard/analytics",
    //   icon: BarChart3,
    //   description: "Usage insights",
    // },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Cog,
      description: "Account settings",
    },
  ];

  return (
    <nav className="space-y-2">
      {navigation.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-gradient-to-r from-[#A34280]/10 to-[#35174D]/10 text-[#35174D] border-r-2 border-[#A34280]"
                : "text-[#35174D]/60 hover:text-[#35174D] hover:bg-[#35174D]/5"
            )}
          >
            <item.icon
              className={cn(
                "h-4 w-4 transition-colors",
                isActive
                  ? "text-[#A34280]"
                  : "text-[#35174D]/40 group-hover:text-[#35174D]/60"
              )}
            />
            <div className="flex flex-col">
              <span className="leading-none">{item.name}</span>
              <span
                className={cn(
                  "text-xs leading-none transition-colors",
                  isActive
                    ? "text-[#35174D]/60"
                    : "text-[#35174D]/40 group-hover:text-[#35174D]/50"
                )}
              >
                {item.description}
              </span>
            </div>
          </Link>
        );
      })}
      <Authenticated>
        <div
          className={cn(
            "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
            "text-[#35174D]/60 hover:text-[#35174D] hover:bg-[#35174D]/5"
          )}
        >
          <UserButton />
          <span
            className={cn(
              "text-xs leading-none transition-colors",
              "text-[#35174D]/40 group-hover:text-[#35174D]/50"
            )}
          >
            Your Profile
          </span>
        </div>
      </Authenticated>
    </nav>
  );
}
