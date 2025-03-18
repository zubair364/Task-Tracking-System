import { cn } from "@/lib/utils";

interface CustomProgressProps {
  className?: string;
  value?: number;
  indicatorClassName?: string;
}

export function CustomProgress({
  className,
  value = 0,
  indicatorClassName,
}: CustomProgressProps) {
  return (
    <div
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
        className
      )}
    >
      <div
        className={cn("h-full bg-primary transition-all", indicatorClassName)}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
