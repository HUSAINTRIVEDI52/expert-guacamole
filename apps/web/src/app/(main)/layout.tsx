import { Header } from "@/components/Header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="lg:min-h-[calc(100dvh-110px)] md:min-h-[calc(100dvh-90px)] min-h-[calc(100dvh-70px)]">
        {children}
      </main>
    </>
  );
}
