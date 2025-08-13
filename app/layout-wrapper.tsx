export default function LayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="bg-background h-full flex flex-col min-h-screen font-[family-name:var(--font-geist-sans)]">
      {children}
    </main>
  );
}
