"use client";
import Header from "./header";

export default function LayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="bg-background items-center min-h-screen font-[family-name:var(--font-geist-sans)]">
      <Header />
      {children}
    </main>
  );
}
