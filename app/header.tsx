import { ModeToggle } from "@/components/ui/mode-toggle";
import { Shield } from "lucide-react";
import HeaderActions from "./header-actions";
import Link from "next/link";
import { Authenticated } from "convex/react";

function Header() {
  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-[#35174D]/10 sticky top-0 z-50">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-[#A34280] to-[#35174D] rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-[#35174D] group-hover:text-[#A34280] transition-colors">
                  ComplianceHub
                </span>
                <span className="text-xs text-[#35174D]/60 -mt-1">
                  Document Management
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              <Authenticated>
                <Link
                  href="/dashboard"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-[#35174D]/70 hover:text-[#35174D] hover:bg-[#35174D]/5 transition-all"
                >
                  Dashboard
                </Link>
              </Authenticated>
              <Link
                href="/#"
                className="px-3 py-2 rounded-lg text-sm font-medium text-[#35174D]/70 hover:text-[#35174D] hover:bg-[#35174D]/5 transition-all"
              >
                Features
              </Link>
              <Link
                href="/#"
                className="px-3 py-2 rounded-lg text-sm font-medium text-[#35174D]/70 hover:text-[#35174D] hover:bg-[#35174D]/5 transition-all"
              >
                Pricing
              </Link>
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            <ModeToggle />
            <div className="h-5 w-px bg-[#35174D]/20"></div>
            <HeaderActions />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
