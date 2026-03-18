import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { PageTransition } from "@/components/layout/PageTransition";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-[#080b12] text-white overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 h-screen overflow-y-auto overflow-x-hidden relative">
        <Topbar />
        <main className="flex-1 w-full p-6 md:p-8 max-w-7xl mx-auto relative z-10">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
