"use client";

import type React from "react";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-slate-50">
      <DashboardSidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        pathname={pathname}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
