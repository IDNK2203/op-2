// components/AdminAuthGuard.tsx
"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.replace("/");
    } else {
      setChecking(false);
    }
  }, [isLoaded, isSignedIn, router]);

  if (checking) {
    return <FullScreenLoader />;
  }

  return <>{children}</>;
}

function FullScreenLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#F2F4F0] z-50">
      <div className="relative w-24 h-24">
        {/* Outer ripple */}
        <div className="absolute inset-0 rounded-full border-4 border-lime-400 animate-ping" />
        {/* Middle circle */}
        <div className="absolute inset-4 rounded-full border-4 border-lime-300 animate-spin" />
        {/* Inner dot */}
        <div className="absolute inset-8 rounded-full bg-lime-400" />
      </div>
    </div>
  );
}
