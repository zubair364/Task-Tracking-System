import { Suspense } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskSummary } from "@/components/task-summary";
import { ProjectSummary } from "@/components/project-summary";
import { RecentTasks } from "@/components/recent-tasks";
import { getUserFromCookies } from "@/app/actions/auth-actions";
import { Plus, CheckSquare, FolderKanban } from "lucide-react";

export default async function DashboardPage() {
  const { user } = await getUserFromCookies();
  const firstName =
    user?.first_name || user?.username?.split(" ")[0] || "there";

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Hello, {firstName}!
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your tasks and projects
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        <Button asChild className="h-auto py-2 px-3">
          <Link href="/dashboard/tasks/new">
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-2 px-3">
          <Link href="/dashboard/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Task Overview</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Suspense fallback={<Skeleton className="h-[120px] w-full" />}>
            <TaskSummary />
          </Suspense>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Project Overview</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Suspense fallback={<Skeleton className="h-[120px] w-full" />}>
            <ProjectSummary />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
