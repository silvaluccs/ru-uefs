import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/feedback/Skeleton";

export function MealSkeleton() {
  return (
    <Card className="p-6 space-y-4">
      <Skeleton className="h-6 w-32" />
      <div className="space-y-3 pt-2">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="space-y-2 pt-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    </Card>
  );
}
