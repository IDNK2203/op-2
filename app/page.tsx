"use client";
import Link from "next/link";
import {
  FileText,
  Search,
  PenTool,
  Shield,
  CheckCircle,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "./header";

export default function Page() {
  return (
    <div className="flex-grow flex flex-col">
      <Header />

      <main className="min-h-screen bg-gradient-to-br from-[#F2F4F0] to-[#F2F4F0]/50">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="container max-w-7xl mx-auto px-4 pt-20 pb-16">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-[#35174D]/10 text-[#35174D] px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Shield className="w-4 h-4" />
                Compliance Management Platform
              </div>

              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#35174D] to-[#A34280] bg-clip-text text-transparent mb-6">
                Streamline Your Compliance Documentation
              </h1>

              <p className="text-xl text-[#35174D]/70 mb-8 leading-relaxed">
                Organize, search, and manage your compliance documents with
                AI-powered insights. Keep your organization secure and
                audit-ready with intelligent document management.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-[#A34280] to-[#35174D] hover:from-[#35174D] hover:to-[#A34280] text-white"
                >
                  <Link href="/dashboard">
                    Get Started
                    <CheckCircle className="w-5 h-5 ml-2" />
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="border-[#35174D] text-[#35174D] hover:bg-[#35174D] hover:text-white"
                >
                  <Link href="/demo">
                    View Demo
                    <Search className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center gap-8 text-sm text-[#35174D]/60 mb-16">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  SOC 2 Compliant
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  1000+ Organizations
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  99.9% Uptime
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white/50">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#35174D] mb-4">
                Everything you need for compliance management
              </h2>
              <p className="text-lg text-[#35174D]/70 max-w-2xl mx-auto">
                Powerful features designed to simplify your compliance workflows
                and keep your documentation organized.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="group">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#35174D]/10 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#A34280] to-[#35174D] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#35174D] mb-3">
                    Document Management
                  </h3>
                  <p className="text-[#35174D]/70 mb-4">
                    Upload, organize, and manage all your compliance documents
                    in one secure location. Support for PDF, Word, and text
                    files.
                  </p>
                  <ul className="space-y-2 text-sm text-[#35174D]/60">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#62AE6E]" />
                      Secure file storage
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#62AE6E]" />
                      Version control
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#62AE6E]" />
                      Access controls
                    </li>
                  </ul>
                </div>
              </div>

              <div className="group">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#35174D]/10 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#E7B627] to-[#62AE6E] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#35174D] mb-3">
                    AI-Powered Search
                  </h3>
                  <p className="text-[#35174D]/70 mb-4">
                    Find exactly what you need with intelligent vector search
                    across all your documents and notes. Get instant, relevant
                    results.
                  </p>
                  <ul className="space-y-2 text-sm text-[#35174D]/60">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#62AE6E]" />
                      Semantic search
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#62AE6E]" />
                      Natural language queries
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#62AE6E]" />
                      Instant results
                    </li>
                  </ul>
                </div>
              </div>

              <div className="group">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#35174D]/10 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#62AE6E] to-[#9CB18B] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <PenTool className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#35174D] mb-3">
                    Smart Notes
                  </h3>
                  <p className="text-[#35174D]/70 mb-4">
                    Create, organize, and search through your compliance notes.
                    Perfect for meeting minutes, action items, and quick
                    references.
                  </p>
                  <ul className="space-y-2 text-sm text-[#35174D]/60">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#62AE6E]" />
                      Rich text editing
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#62AE6E]" />
                      Tagging system
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#62AE6E]" />
                      Quick access
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="bg-gradient-to-r from-[#35174D] to-[#A34280] rounded-3xl p-12 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to streamline your compliance?
              </h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Join thousands of organizations who trust our platform to keep
                their compliance documentation organized and secure.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-[#A34280] to-[#35174D] hover:from-[#35174D] hover:to-[#A34280] text-white"
                >
                  <Link href="/dashboard">Start Free Trial</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-[#35174D] text-[#35174D] hover:bg-[#35174D] hover:text-white"
                >
                  <Link href="/contact">Contact Sales</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
