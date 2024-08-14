import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 justify-center">
      <Skeleton className="flex h-[500px] max-w-2xl flex-1 rounded-md" />
    </div>
  );
}
