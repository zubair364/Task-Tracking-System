"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { createTask, updateTask, getTask } from "@/app/actions/task-actions";
import { getProjects } from "@/app/actions/project-actions";

type Project = {
  id: number;
  name: string;
};

const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  project_id: z.number({
    required_error: "Please select a project",
  }),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  due_date: z.date({
    required_error: "Please select a due date",
  }),
});

type TaskFormProps = {
  taskId?: number;
};

export function TaskForm({ taskId }: TaskFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    project_id: 0,
    status: "TODO" as "TODO" | "IN_PROGRESS" | "DONE",
    priority: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH",
    due_date: new Date(),
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        // Fetch projects
        const projectsResult = await getProjects();
        // Use optional chaining and provide a default empty array if projects is undefined
        const projectsList = projectsResult.success
          ? projectsResult.projects ?? []
          : [];
        setProjects(projectsList);

        // Set default project if available
        if (projectsList.length > 0 && !taskId) {
          setFormData((prev) => ({
            ...prev,
            project_id: projectsList[0].id,
          }));
        }

        // Fetch task if editing
        if (taskId) {
          const taskResult = await getTask(taskId);
          if (taskResult.success && taskResult.task) {
            const task = taskResult.task;
            setFormData({
              title: task.title,
              description: task.description || "",
              project_id: task.project.id,
              status: task.status,
              priority: task.priority,
              due_date: new Date(task.due_date),
            });
          } else {
            toast.error("Error", {
              description: "Failed to load task details. Please try again.",
            });
          }
        }
      } catch (error) {
        toast.error("Error", {
          description: "Failed to load data. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [taskId]);

  const validateForm = () => {
    try {
      taskSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const taskData = {
        ...formData,
        due_date: format(formData.due_date, "yyyy-MM-dd"),
      };

      const result = taskId
        ? await updateTask(taskId, taskData)
        : await createTask(taskData);

      if (result.success) {
        toast.success(taskId ? "Task updated" : "Task created", {
          description: taskId
            ? "Your task has been updated successfully"
            : "Your new task has been created successfully",
        });
        router.push("/dashboard/tasks");
      } else {
        toast.error("Error", {
          description:
            result.message ||
            `Failed to ${taskId ? "update" : "create"} task. Please try again.`,
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: `Failed to ${
          taskId ? "update" : "create"
        } task. Please try again.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && taskId) {
    return <div className="text-center py-8">Loading task details...</div>;
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          disabled={isLoading}
        />
        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          disabled={isLoading}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="project">Project</Label>
        <Select
          value={formData.project_id.toString()}
          onValueChange={(value) =>
            setFormData({ ...formData, project_id: Number.parseInt(value) })
          }
          disabled={isLoading || projects.length === 0}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id.toString()}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.project_id && (
          <p className="text-sm text-red-500">{errors.project_id}</p>
        )}
        {projects.length === 0 && (
          <p className="text-sm text-amber-500">
            You need to create a project first.{" "}
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={() => router.push("/dashboard/projects/new")}
            >
              Create a project
            </Button>
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value: "TODO" | "IN_PROGRESS" | "DONE") =>
              setFormData({ ...formData, status: value })
            }
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODO">To Do</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="DONE">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value: "LOW" | "MEDIUM" | "HIGH") =>
              setFormData({ ...formData, priority: value })
            }
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="due_date">Due Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.due_date && "text-muted-foreground"
              )}
              disabled={isLoading}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.due_date ? (
                format(formData.due_date, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formData.due_date}
              onSelect={(date) =>
                date && setFormData({ ...formData, due_date: date })
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.due_date && (
          <p className="text-sm text-red-500">{errors.due_date}</p>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || projects.length === 0}>
          {isLoading ? "Saving..." : taskId ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </motion.form>
  );
}
