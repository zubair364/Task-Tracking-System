"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function TaskEditError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
        <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
      </div>
      <h2 className="text-2xl font-bold">Something went wrong</h2>
      <p className="text-muted-foreground text-center max-w-md">
        There was an error loading or updating this task. Please try again.
      </p>
      <div className="flex gap-4 mt-4">
        <Button variant="outline" onClick={reset}>
          Try Again
        </Button>
        <Button asChild>
          <Link href="/dashboard/tasks">Back to Tasks</Link>
        </Button>
      </div>
    </div>
  );
}
