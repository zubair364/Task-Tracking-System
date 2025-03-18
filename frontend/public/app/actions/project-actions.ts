"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

type Project = {
  id: number;
  name: string;
  description: string;
  created_at: string;
  task_count: number;
};

type ProjectFormData = {
  name: string;
  description: string;
};

type ProjectResponse = {
  success: boolean;
  message?: string;
  project?: Project;
  projects?: Project[];
};

// Helper function to get the auth token
async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value;
}

export async function getProjects(): Promise<ProjectResponse> {
  const token = await getAuthToken();

  if (!token) {
    return { success: false, message: "Not authenticated" };
  }

  try {
    const response = await fetch(`${process.env.API_BASE_URL}/projects`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return { success: false, message: "Failed to fetch projects" };
    }

    const data = await response.json();
    // Handle the case where the API returns an object with projects and count properties
    const projects = Array.isArray(data) ? data : data.projects || [];
    return { success: true, projects };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function getProject(id: number): Promise<ProjectResponse> {
  const token = await getAuthToken();

  if (!token) {
    return { success: false, message: "Not authenticated" };
  }

  try {
    const response = await fetch(`${process.env.API_BASE_URL}/projects/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return { success: false, message: "Failed to fetch project" };
    }

    const project = await response.json();
    return { success: true, project };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function createProject(
  projectData: ProjectFormData
): Promise<ProjectResponse> {
  const token = await getAuthToken();

  if (!token) {
    return { success: false, message: "Not authenticated" };
  }

  try {
    const response = await fetch(`${process.env.API_BASE_URL}/projects/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      return { success: false, message: "Failed to create project" };
    }

    const project = await response.json();
    revalidatePath("/dashboard/projects");
    revalidatePath("/dashboard");
    return { success: true, project };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function updateProject(
  id: number,
  projectData: ProjectFormData
): Promise<ProjectResponse> {
  const token = await getAuthToken();

  if (!token) {
    return { success: false, message: "Not authenticated" };
  }

  try {
    const response = await fetch(`${process.env.API_BASE_URL}/projects/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      return { success: false, message: "Failed to update project" };
    }

    const project = await response.json();
    revalidatePath("/dashboard/projects");
    revalidatePath(`/dashboard/projects/${id}`);
    revalidatePath("/dashboard");
    return { success: true, project };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function deleteProject(id: number): Promise<ProjectResponse> {
  const token = await getAuthToken();

  if (!token) {
    return { success: false, message: "Not authenticated" };
  }

  try {
    const response = await fetch(`${process.env.API_BASE_URL}/projects/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return { success: false, message: "Failed to delete project" };
    }

    revalidatePath("/dashboard/projects");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function getProjectCount(): Promise<number> {
  const token = await getAuthToken();

  if (!token) {
    return 0;
  }

  try {
    const response = await fetch(`${process.env.API_BASE_URL}/projects/count`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch project count");
    }

    const data = await response.json();
    return data.count;
  } catch (error) {
    console.error("Error fetching project count:", error);
    return 0;
  }
}

// Add this function to your project-actions.ts file

export async function getProjectStats() {
  const token = await getAuthToken();

  if (!token) {
    return {
      total: 0,
      active: 0,
      onHold: 0,
      completed: 0,
      archived: 0,
      cancelled: 0,
    };
  }

  try {
    const response = await fetch(`${process.env.API_BASE_URL}/projects/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch project stats");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching project stats:", error);
    return {
      total: 0,
      active: 0,
      onHold: 0,
      completed: 0,
      archived: 0,
      cancelled: 0,
    };
  }
}
