import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, AlertCircle, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getRecentTasks } from "@/app/actions/task-actions";

export async function RecentTasks() {
  const tasks = await getRecentTasks();

  if (tasks.length === 0) {
    return (
      <div className="flex h-[300px] flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8 text-center">
        <div className="rounded-full bg-primary/10 p-3">
          <CheckCircle className="h-6 w-6 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-medium">No tasks yet</h3>
          <p className="text-sm text-muted-foreground">
            Create your first task to get started
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/tasks/new">Create Task</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Link
          key={task.id}
          href={`/dashboard/tasks/${task.id}`}
          className="group block"
        >
          <div className="flex items-start space-x-4 rounded-lg border p-4 transition-colors hover:bg-accent">
            <div className="flex-shrink-0 pt-1">
              {task.status === "DONE" ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : task.status === "IN_PROGRESS" ? (
                <Clock className="h-5 w-5 text-blue-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-medium truncate">{task.title}</h4>
                <Badge
                  variant={
                    task.priority === "HIGH"
                      ? "destructive"
                      : task.priority === "MEDIUM"
                      ? "default"
                      : "secondary"
                  }
                  className="ml-2"
                >
                  {task.priority.toLowerCase()}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground truncate">
                {task.description}
              </p>
              <div className="mt-2 flex items-center text-xs text-muted-foreground">
                <span className="truncate">Project: {task.project.name}</span>
                <span className="mx-2">•</span>
                <span>
                  Due:{" "}
                  {formatDistanceToNow(new Date(task.due_date), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
            <div className="flex-shrink-0 self-center opacity-0 transition-opacity group-hover:opacity-100">
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
