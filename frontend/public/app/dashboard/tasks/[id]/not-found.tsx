import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function TaskNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-900/30">
        <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
      </div>
      <h2 className="text-2xl font-bold">Task Not Found</h2>
      <p className="text-muted-foreground text-center max-w-md">
        The task you're looking for doesn't exist or you don't have permission
        to view it.
      </p>
      <div className="flex gap-4 mt-4">
        <Button asChild variant="outline">
          <Link href="/dashboard/tasks">Back to Tasks</Link>
        </Button>
        <Button asChild>
          <Link href="/dashboard/tasks/new">Create New Task</Link>
        </Button>
      </div>
    </div>
  );
}
