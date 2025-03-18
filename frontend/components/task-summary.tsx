import { CheckCircle, Clock, AlertCircle, CheckSquare } from "lucide-react";
import { getTaskStats } from "@/app/actions/task-actions";
import { Progress } from "@/components/ui/progress";

export async function TaskSummary() {
  const stats = await getTaskStats();

  // Calculate percentages for progress bars
  const todoPercentage = stats.total > 0 ? (stats.todo / stats.total) * 100 : 0;
  const inProgressPercentage =
    stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0;
  const completedPercentage =
    stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  return (
    <>
      <div className="p-4 transition-colors hover:bg-muted/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Total Tasks</h3>
          </div>
          <span className="text-2xl font-bold">{stats.total}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-2">
          Across all projects
        </p>
        <Progress value={100} className="h-1.5 bg-primary/20" />
      </div>

      <div className="p-4 transition-colors hover:bg-muted/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <h3 className="font-medium">To Do</h3>
          </div>
          <span className="text-2xl font-bold">{stats.todo}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-2">Not yet started</p>
        <Progress
          value={todoPercentage}
          className="h-1.5 bg-amber-100"
          indicatorClassName="bg-amber-500"
        />
      </div>

      <div className="p-4 transition-colors hover:bg-muted/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <h3 className="font-medium">In Progress</h3>
          </div>
          <span className="text-2xl font-bold">{stats.inProgress}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-2">
          Currently being worked on
        </p>
        <Progress
          value={inProgressPercentage}
          className="h-1.5 bg-blue-100"
          indicatorClassName="bg-blue-500"
        />
      </div>

      <div className="p-4 transition-colors hover:bg-muted/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <h3 className="font-medium">Completed</h3>
          </div>
          <span className="text-2xl font-bold">{stats.completed}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-2">
          {stats.total > 0
            ? `${Math.round(
                (stats.completed / stats.total) * 100
              )}% of all tasks`
            : "No tasks yet"}
        </p>
        <Progress
          value={completedPercentage}
          className="h-1.5 bg-green-100"
          indicatorClassName="bg-green-500"
        />
      </div>
    </>
  );
}
