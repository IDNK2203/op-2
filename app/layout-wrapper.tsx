"use client";
import Header from "./header";

export default function LayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="bg-background h-full flex flex-col min-h-screen font-[family-name:var(--font-geist-sans)]">
      <Header />
      <div className="flex-grow flex flex-col">{children}</div>
    </main>
  );
}
