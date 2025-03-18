import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ProjectList } from "@/components/project-list"
import { Plus, Grid, List } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage your projects and organize your tasks</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/dashboard/projects/new">
              <Plus className="mr-2 h-4 w-4" /> New Project
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="grid">
              <Grid className="mr-2 h-4 w-4" />
              Grid
            </TabsTrigger>
            <TabsTrigger value="list">
              <List className="mr-2 h-4 w-4" />
              List
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="grid" className="mt-4">
          <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
            <ProjectList view="grid" />
          </Suspense>
        </TabsContent>
        <TabsContent value="list" className="mt-4">
          <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
            <ProjectList view="list" />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

