import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskForm } from "@/components/task-form";
import { getTask } from "@/app/actions/task-actions";

interface TaskEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TaskEditPage({ params }: TaskEditPageProps) {
  // Await the params since they're now a Promise in Next.js 15
  const resolvedParams = await params;
  const taskId = Number.parseInt(resolvedParams.id, 10);

  if (isNaN(taskId)) {
    notFound();
  }

  // Fetch the task data
  const taskResult = await getTask(taskId);

  if (!taskResult.success || !taskResult.task) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Edit Task</CardTitle>
          <CardDescription>Update the details of your task</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<TaskFormSkeleton />}>
            <TaskForm taskId={taskId} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

function TaskFormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-32 w-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="flex justify-end space-x-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}
