import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <div className=" my-3 w-full">
      <Skeleton className="h-36 rounded-lg" />
      {/* <Skeleton className="h-36 rounded-lg" />
      <Skeleton className="h-36 rounded-lg" />
      <Skeleton className="h-36 rounded-lg" /> */}
    </div>
  );
}
