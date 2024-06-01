import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Skeleton className="h-20 rounded-lg" />
    </div>
  );
}
