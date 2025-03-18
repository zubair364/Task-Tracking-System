export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface TaskUser {
  id: number;
  username: string;
}

export interface TaskProject {
  id: number;
  name: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  due_date?: string;
  status: TaskStatus;
  priority: TaskPriority;
  created_at: string;
  updated_at: string;
  project: TaskProject;
  assigned_to?: TaskUser;
  created_by: TaskUser;
}

export interface TaskList {
  tasks: Task[];
  count: number;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  due_date?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  project_id: number;
  assigned_to_id?: number;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  due_date?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  project_id?: number;
  assigned_to_id?: number | null;
}

export interface TaskFilters {
  project_id?: number;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigned_to_id?: number;
}
