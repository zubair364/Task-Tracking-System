"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  createProject,
  updateProject,
  getProject,
} from "@/app/actions/project-actions";

const projectSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
});

type ProjectFormProps = {
  projectId?: number;
};

export function ProjectForm({ projectId }: ProjectFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;

      try {
        setIsLoading(true);
        const result = await getProject(projectId);

        if (result.success && result.project) {
          setFormData({
            name: result.project.name,
            description: result.project.description || "",
          });
        } else {
          toast.error("Error", {
            description: "Failed to load project details. Please try again.",
          });
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        toast.error("Error", {
          description: "Failed to load project details. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const validateForm = () => {
    try {
      projectSchema.parse(formData);
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
      const result = projectId
        ? await updateProject(projectId, formData)
        : await createProject(formData);

      if (result.success) {
        toast.success(projectId ? "Project updated" : "Project created", {
          description: projectId
            ? "Your project has been updated successfully"
            : "Your new project has been created successfully",
        });
        router.push("/dashboard/projects");
      } else {
        toast.error("Error", {
          description:
            result.message ||
            `Failed to ${
              projectId ? "update" : "create"
            } project. Please try again.`,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: `Failed to ${
          projectId ? "update" : "create"
        } project. Please try again.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && projectId) {
    return <div className="text-center py-8">Loading project details...</div>;
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Project Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          disabled={isLoading}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
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
          placeholder="Describe the purpose of this project"
        />
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
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? "Saving..."
            : projectId
            ? "Update Project"
            : "Create Project"}
        </Button>
      </div>
    </motion.form>
  );
}
