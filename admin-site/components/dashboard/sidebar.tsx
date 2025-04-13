"use client";

import Link from "next/link";
import {
  Users,
  Calendar,
  BookOpen,
  Image,
  Bell,
  Layers,
  Home,
  DoorOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  pathname: string;
}

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "User Info",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Timetable",
    href: "/dashboard/timetable",
    icon: Calendar,
  },
  {
    title: "Textbook Market",
    href: "/dashboard/textbooks",
    icon: BookOpen,
  },
  {
    title: "Carousel Editor",
    href: "/dashboard/carousel",
    icon: Image,
  },
  {
    title: "Push Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
  },
  {
    title: "Class List",
    href: "/dashboard/classes",
    icon: Layers,
  },
  {
    title: "Room List",
    href: "/dashboard/rooms",
    icon: DoorOpen,
  },
  {
    title: "LINE Bot",
    href: "/dashboard/line-bot",
    icon: Bell,
  },
];

export function DashboardSidebar({ open, setOpen, pathname }: SidebarProps) {
  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-white transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="rounded-md bg-blue-600 p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
          </div>
          <span className="font-bold">UniApp Admin</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-100",
                pathname === item.href
                  ? "bg-slate-100 text-blue-600"
                  : "text-slate-700"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t p-4">
        <Button variant="outline" className="w-full" asChild>
          <Link href="/">Logout</Link>
        </Button>
      </div>
    </div>
  );
}
