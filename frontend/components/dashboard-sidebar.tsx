"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Calendar,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const mainNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Tasks",
    href: "/dashboard/tasks",
    icon: CheckSquare,
  },
  {
    title: "Projects",
    href: "/dashboard/projects",
    icon: FolderKanban,
  },
  {
    title: "Calendar",
    href: "/dashboard/calendar",
    icon: Calendar,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-60 border-r bg-background z-30">
      <div className="flex flex-col h-full gap-4 p-4">
        <ScrollArea className="flex-1">
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">
                Main
              </h3>
              <nav className="space-y-1">
                {mainNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium",
                      pathname === item.href
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                ))}
              </nav>
            </div>
            <div>
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-semibold uppercase text-muted-foreground">
                  Projects
                </h3>
                <Button variant="ghost" size="icon" className="h-5 w-5" asChild>
                  <Link href="/dashboard/projects/new">
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">New Project</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
}
