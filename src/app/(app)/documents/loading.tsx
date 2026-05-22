import { Skeleton } from "@/components/ui/skeleton";

export default function DocumentsLoading() {
  return (
    <div className="space-y-5">
      <div>
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-2 h-8 w-40" />
      </div>
      <Skeleton className="h-64" />
      <Skeleton className="h-56" />
    </div>
  );
}
