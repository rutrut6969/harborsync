import { Skeleton } from "@/components/ui/skeleton";

export default function RecordsLoading() {
  return (
    <div className="space-y-5">
      <div>
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-2 h-8 w-44" />
      </div>
      <Skeleton className="h-[30rem]" />
    </div>
  );
}
