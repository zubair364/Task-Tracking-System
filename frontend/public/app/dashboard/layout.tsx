import type React from "react";
import Link from "next/link";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { UserHeader } from "@/components/user-header";
import { MobileNav } from "@/components/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { FolderKanban } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <MobileNav />
        <div className="flex items-center mr-auto">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold text-xl"
          >
            <FolderKanban className="h-6 w-6 text-primary" />
            <span className="hidden md:inline">Task Flow</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserHeader />
        </div>
      </header>
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 ml-0 md:ml-60 overflow-auto">
          <div className="container mx-auto py-6 px-4 md:px-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
