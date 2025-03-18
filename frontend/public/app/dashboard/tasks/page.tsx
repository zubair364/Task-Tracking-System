import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskList } from "@/components/task-list";
import { Plus, ListFilter } from "lucide-react";

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Manage your tasks and track your progress
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <ListFilter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button asChild>
            <Link href="/dashboard/tasks/new">
              <Plus className="mr-2 h-4 w-4" /> New Task
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="todo">To Do</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="done">Done</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
            <TaskList />
          </Suspense>
        </TabsContent>
        <TabsContent value="todo" className="mt-4">
          <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
            <TaskList filter="TODO" />
          </Suspense>
        </TabsContent>
        <TabsContent value="in-progress" className="mt-4">
          <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
            <TaskList filter="IN_PROGRESS" />
          </Suspense>
        </TabsContent>
        <TabsContent value="done" className="mt-4">
          <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
            <TaskList filter="DONE" />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
