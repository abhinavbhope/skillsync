"use client";

import {
  Sidebar,
  SidebarProvider,
  SidebarButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Home, BarChart3, Boxes } from "lucide-react";
import { usePathname } from "next/navigation";
import FloatingElements from "@/components/dashboard/FloatingElements";
import { cn } from "@/lib/utils";

function DashboardMain({ children }) {
  const pathname = usePathname();
  const { state } = useSidebar(); // ✅ NOW safe to call

  return (
    <>
      {/* Sidebar */}
      <Sidebar>
        <SidebarButton
          icon={<Home className="w-5 h-5" />}
          href="/"
          isActive={pathname === "/"}
        >
          Home
        </SidebarButton>

        <SidebarButton
          icon={<BarChart3 className="w-5 h-5" />}
          href="/dashboard"
          isActive={pathname === "/dashboard"}
        >
          Analysis
        </SidebarButton>

        <SidebarButton
          icon={<Boxes className="w-5 h-5" />}
          href="/dashboard/opensource"
          isActive={pathname.startsWith("/dashboard/opensource")}
        >
          Open Source
        </SidebarButton>
      </Sidebar>

      {/* Main Content */}
      <main
        className={cn(
          "relative min-h-screen text-gray-200 w-full transition-all duration-300",
          state === "expanded" ? "md:pl-64" : "md:pl-20"
        )}
      >
        <div className="absolute inset-0 -z-10">
          <FloatingElements />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f]/80 to-[#121826]/80 -z-20" />

        <div className="relative z-10 w-full">{children}</div>
      </main>
    </>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <TooltipProvider delayDuration={0}>
        <DashboardMain>{children}</DashboardMain>
      </TooltipProvider>
    </SidebarProvider>
  );
}
