"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  MoreHorizontal,
  Pencil,
  Trash2,
  Calendar,
  Search,
  ArrowUpDown,
  Filter,
  Tag,
  Briefcase,
  Flag,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  format,
  isBefore,
  parseISO,
  isToday,
  addDays,
  isWithinInterval,
} from "date-fns";
import { toast } from "sonner";
import { getTasks, updateTask, deleteTask } from "@/app/actions/task-actions";

type Task = {
  id: number;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  due_date: string;
  created_at: string;
  project: {
    id: number;
    name: string;
  };
};

type TaskListProps = {
  filter?: "TODO" | "IN_PROGRESS" | "DONE";
};

// Helper function to normalize status for comparison
const normalizeStatus = (status: string): string => {
  return status.toLowerCase();
};

// Helper function to get status color
const getStatusColor = (status: string): string => {
  const normalized = normalizeStatus(status);
  if (normalized === "done")
    return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
  if (normalized === "in_progress")
    return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
  return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
};

// Helper function to get priority color
const getPriorityColor = (priority: string): string => {
  if (priority === "HIGH") return "text-red-500";
  if (priority === "MEDIUM") return "text-amber-500";
  return "text-green-500";
};

// Helper function to get priority icon
const getPriorityIcon = (priority: string) => {
  if (priority === "HIGH") return <Flag className="h-3 w-3 text-red-500" />;
  if (priority === "MEDIUM") return <Flag className="h-3 w-3 text-amber-500" />;
  return <Flag className="h-3 w-3 text-green-500" />;
};

// Helper function to format due date with relative indicators
const formatDueDate = (dueDate: string) => {
  const date = parseISO(dueDate);
  const today = new Date();

  if (isToday(date)) {
    return <span className="text-amber-500 font-medium">Today</span>;
  } else if (isBefore(date, today)) {
    return <span className="text-red-500 font-medium">Overdue</span>;
  } else if (isWithinInterval(date, { start: today, end: addDays(today, 2) })) {
    return <span className="text-amber-500 font-medium">Soon</span>;
  }

  return format(date, "MMM dd");
};

type SortOption = "dueDate" | "priority" | "title" | "status";
type GroupOption = "none" | "project" | "priority" | "status" | "dueDate";

export function TaskList({ filter }: TaskListProps) {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("dueDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [groupBy, setGroupBy] = useState<GroupOption>("none");

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const result = await getTasks();
        if (result.success) {
          let filteredTasks = result.tasks || [];

          // Apply filter if provided
          if (filter) {
            filteredTasks = filteredTasks.filter(
              (task) => normalizeStatus(task.status) === normalizeStatus(filter)
            );
          }

          setTasks(filteredTasks);
        } else {
          setError(result.message || "Failed to fetch tasks");
        }
      } catch (error) {
        setError("Error loading tasks. Please try again.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [filter]);

  const handleDelete = async (id: number) => {
    try {
      const result = await deleteTask(id);

      if (result.success) {
        setTasks(tasks.filter((task) => task.id !== id));
        toast.success("Task deleted", {
          description: "The task has been successfully deleted",
        });
      } else {
        toast.error("Error", {
          description:
            result.message || "Failed to delete task. Please try again.",
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to delete task. Please try again.",
      });
      console.error(error);
    }
  };

  const handleStatusChange = async (
    id: number,
    newStatus: "TODO" | "IN_PROGRESS" | "DONE"
  ) => {
    try {
      const result = await updateTask(id, { status: newStatus });

      if (result.success) {
        // If we're filtering and the new status doesn't match the filter, remove the task
        if (filter && normalizeStatus(newStatus) !== normalizeStatus(filter)) {
          setTasks(tasks.filter((task) => task.id !== id));
        } else {
          setTasks(
            tasks.map((task) =>
              task.id === id ? { ...task, status: newStatus } : task
            )
          );
        }

        toast.success("Status updated", {
          description: `Task status changed to ${newStatus
            .replace("_", " ")
            .toLowerCase()}`,
        });
      } else {
        toast.error("Error", {
          description:
            result.message || "Failed to update task status. Please try again.",
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to update task status. Please try again.",
      });
      console.error(error);
    }
  };

  const handleToggleComplete = async (
    id: number,
    currentStatus: "TODO" | "IN_PROGRESS" | "DONE"
  ) => {
    const newStatus =
      normalizeStatus(currentStatus) === "done" ? "TODO" : "DONE";
    await handleStatusChange(id, newStatus);
  };

  const toggleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(option);
      setSortDirection("asc");
    }
  };

  // Filter tasks based on search query
  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;

    const query = searchQuery.toLowerCase();
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.project.name.toLowerCase().includes(query)
    );
  }, [tasks, searchQuery]);

  // Sort tasks
  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "dueDate":
          comparison =
            new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
          break;
        case "priority": {
          const priorityValues = { HIGH: 3, MEDIUM: 2, LOW: 1 };
          comparison =
            (priorityValues[a.priority] || 0) -
            (priorityValues[b.priority] || 0);
          break;
        }
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "status": {
          const statusValues = { TODO: 1, IN_PROGRESS: 2, DONE: 3 };
          comparison =
            (statusValues[a.status] || 0) - (statusValues[b.status] || 0);
          break;
        }
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredTasks, sortBy, sortDirection]);

  // Group tasks
  const groupedTasks = useMemo(() => {
    if (groupBy === "none") {
      return { "All Tasks": sortedTasks };
    }

    return sortedTasks.reduce((groups, task) => {
      let groupKey = "";

      switch (groupBy) {
        case "project":
          groupKey = task.project.name;
          break;
        case "priority":
          groupKey = task.priority;
          break;
        case "status":
          groupKey = task.status.replace("_", " ");
          break;
        case "dueDate": {
          const dueDate = parseISO(task.due_date);
          const today = new Date();

          if (isToday(dueDate)) {
            groupKey = "Today";
          } else if (isBefore(dueDate, today)) {
            groupKey = "Overdue";
          } else if (
            isWithinInterval(dueDate, { start: today, end: addDays(today, 7) })
          ) {
            groupKey = "This Week";
          } else {
            groupKey = "Later";
          }
          break;
        }
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }

      groups[groupKey].push(task);
      return groups;
    }, {} as Record<string, Task[]>);
  }, [sortedTasks, groupBy]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden animate-pulse">
            <div className="flex items-start p-4 gap-4">
              <div className="flex-shrink-0 pt-1 w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="flex-1 min-w-0">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8 text-center">
        <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
          <AlertCircle className="h-6 w-6 text-red-500" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-medium">Error loading tasks</h3>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  if (filteredTasks.length === 0 && searchQuery) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tasks..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSearchQuery("")}
          >
            <span className="sr-only">Clear search</span>
            <AlertCircle className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8 text-center">
          <div className="rounded-full bg-primary/10 p-3">
            <Search className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-medium">No matching tasks</h3>
            <p className="text-sm text-muted-foreground">
              No tasks found matching "{searchQuery}"
            </p>
          </div>
          <Button variant="outline" onClick={() => setSearchQuery("")}>
            Clear Search
          </Button>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8 text-center">
        <div className="rounded-full bg-primary/10 p-3">
          <CheckCircle className="h-6 w-6 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-medium">No tasks found</h3>
          <p className="text-sm text-muted-foreground">
            {filter
              ? `You don't have any ${filter
                  .toLowerCase()
                  .replace("_", " ")} tasks`
              : "Create your first task to get started"}
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/tasks/new">Create Task</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and filter controls */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tasks..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select
            value={groupBy}
            onValueChange={(value) => setGroupBy(value as GroupOption)}
          >
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Group by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No grouping</SelectItem>
              <SelectItem value="project">Project</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="dueDate">Due Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Sort controls */}
      <div className="flex text-sm border-b pb-1">
        <button
          className={`flex items-center px-3 py-1 rounded-md ${
            sortBy === "title" ? "bg-muted font-medium" : ""
          }`}
          onClick={() => toggleSort("title")}
        >
          Title
          {sortBy === "title" && (
            <ArrowUpDown
              className={`ml-1 h-3 w-3 ${
                sortDirection === "desc" ? "rotate-180" : ""
              }`}
            />
          )}
        </button>
        <button
          className={`flex items-center px-3 py-1 rounded-md ${
            sortBy === "dueDate" ? "bg-muted font-medium" : ""
          }`}
          onClick={() => toggleSort("dueDate")}
        >
          Due Date
          {sortBy === "dueDate" && (
            <ArrowUpDown
              className={`ml-1 h-3 w-3 ${
                sortDirection === "desc" ? "rotate-180" : ""
              }`}
            />
          )}
        </button>
        <button
          className={`flex items-center px-3 py-1 rounded-md ${
            sortBy === "priority" ? "bg-muted font-medium" : ""
          }`}
          onClick={() => toggleSort("priority")}
        >
          Priority
          {sortBy === "priority" && (
            <ArrowUpDown
              className={`ml-1 h-3 w-3 ${
                sortDirection === "desc" ? "rotate-180" : ""
              }`}
            />
          )}
        </button>
        <button
          className={`flex items-center px-3 py-1 rounded-md ${
            sortBy === "status" ? "bg-muted font-medium" : ""
          }`}
          onClick={() => toggleSort("status")}
        >
          Status
          {sortBy === "status" && (
            <ArrowUpDown
              className={`ml-1 h-3 w-3 ${
                sortDirection === "desc" ? "rotate-180" : ""
              }`}
            />
          )}
        </button>
      </div>

      {/* Task list */}
      <div className="space-y-8">
        {Object.entries(groupedTasks).map(([group, tasks]) => (
          <div key={group} className="space-y-4">
            {groupBy !== "none" && (
              <div className="flex items-center gap-2">
                {groupBy === "project" && <Briefcase className="h-4 w-4" />}
                {groupBy === "priority" && <Flag className="h-4 w-4" />}
                {groupBy === "status" && <Tag className="h-4 w-4" />}
                {groupBy === "dueDate" && <Calendar className="h-4 w-4" />}
                <h3 className="text-lg font-medium">{group}</h3>
                <Badge variant="outline">{tasks.length}</Badge>
              </div>
            )}

            <AnimatePresence>
              {tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: index * 0.03 }}
                  layout
                >
                  <Card className="overflow-hidden transition-colors">
                    <div className="flex items-start p-4 gap-4">
                      <div className="flex-shrink-0 pt-1"></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3
                                className={`font-medium ${
                                  normalizeStatus(task.status) === "done"
                                    ? "line-through text-muted-foreground"
                                    : ""
                                }`}
                              >
                                {task.title}
                              </h3>
                              <Badge
                                variant="secondary"
                                className={`text-xs ${getStatusColor(
                                  task.status
                                )}`}
                              >
                                {task.status.replace("_", " ").toLowerCase()}
                              </Badge>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                              {task.description}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-1 text-xs">
                              {getPriorityIcon(task.priority)}
                              <span
                                className={`${getPriorityColor(task.priority)}`}
                              >
                                {task.priority.toLowerCase()}
                              </span>
                            </div>
                            <Badge
                              variant="outline"
                              className="flex items-center gap-1"
                            >
                              <Calendar className="h-3 w-3" />
                              {formatDueDate(task.due_date)}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="flex items-center gap-1"
                            >
                              <Briefcase className="h-3 w-3" />
                              {task.project.name}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() =>
                                    router.push(`/dashboard/tasks/${task.id}`)
                                  }
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(task.id, "TODO")
                                  }
                                >
                                  <AlertCircle className="mr-2 h-4 w-4" />
                                  Mark as Todo
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(task.id, "IN_PROGRESS")
                                  }
                                >
                                  <Clock className="mr-2 h-4 w-4" />
                                  Mark as In Progress
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(task.id, "DONE")
                                  }
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Mark as Done
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleDelete(task.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
