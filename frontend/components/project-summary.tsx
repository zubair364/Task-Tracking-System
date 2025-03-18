import { FolderKanban, PauseCircle, CheckCircle } from "lucide-react";
import { getProjectStats } from "@/app/actions/project-actions";
import { Progress } from "@/components/ui/progress";

export async function ProjectSummary() {
  const stats = await getProjectStats();

  // Calculate percentages for progress bars
  const activePercentage =
    stats.total > 0 ? (stats.active / stats.total) * 100 : 0;
  const onHoldPercentage =
    stats.total > 0 ? (stats.onHold / stats.total) * 100 : 0;
  const completedPercentage =
    stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  return (
    <>
      <div className="p-4 transition-colors hover:bg-muted/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Total Projects</h3>
          </div>
          <span className="text-2xl font-bold">{stats.total}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-2">All your projects</p>
        <Progress value={100} className="h-1.5 bg-primary/20" />
      </div>

      <div className="p-4 transition-colors hover:bg-muted/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-green-500" />
            <h3 className="font-medium">Active</h3>
          </div>
          <span className="text-2xl font-bold">{stats.active}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-2">
          Currently in progress
        </p>
        <Progress
          value={activePercentage}
          className="h-1.5 bg-green-100"
          indicatorClassName="bg-green-500"
        />
      </div>

      <div className="p-4 transition-colors hover:bg-muted/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <PauseCircle className="h-5 w-5 text-amber-500" />
            <h3 className="font-medium">On Hold</h3>
          </div>
          <span className="text-2xl font-bold">{stats.onHold}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-2">Temporarily paused</p>
        <Progress
          value={onHoldPercentage}
          className="h-1.5 bg-amber-100"
          indicatorClassName="bg-amber-500"
        />
      </div>

      <div className="p-4 transition-colors hover:bg-muted/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-blue-500" />
            <h3 className="font-medium">Completed</h3>
          </div>
          <span className="text-2xl font-bold">{stats.completed}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-2">
          Successfully finished
        </p>
        <Progress
          value={completedPercentage}
          className="h-1.5 bg-blue-100"
          indicatorClassName="bg-blue-500"
        />
      </div>
    </>
  );
}
