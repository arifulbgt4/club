import { type FC } from "react";
import { type ReAssignedProps } from "./Types";
import EmptyState from "../shared/empty-state";
import Pagination from "../sections/pagination";
import { TASK_TABS } from "~/types";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { getList } from "./action";

const ReAssigned: FC<ReAssignedProps> = async ({ pagination, total }) => {
  const { intents, take, page } = await getList(pagination);
  if (!total)
    return (
      <div>
        <EmptyState
          title="No Reassignments of Your Review"
          description="No issues have been reassigned to you for review. All submitted items remain as originally assigned, and no new tasks or changes have been made to your review responsibilities"
        />
      </div>
    );
  const totalPages = Math.ceil(total / take);
  return (
    <div className="flex flex-col">
      <span className=" border-b py-3 font-medium">Queue</span>
      {intents?.map((intent) => (
        <Link
          key={intent?.id}
          href={`/issue/${intent?.issueId}`}
          className=" flex flex-col rounded border-b border-l border-r px-5 py-4 hover:bg-accent"
        >
          <span className="mb-1 text-sm text-muted-foreground">
            assigned{" "}
            {formatDistanceToNow(new Date(intent?.updatedAt), {
              addSuffix: true,
              includeSeconds: true,
            })}
          </span>
          <span className=" text-xl">{intent?.issue?.title}</span>
        </Link>
      ))}
      <div className="mt-3">
        <Pagination
          page={page}
          more={`?t=${TASK_TABS.queue}`}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default ReAssigned;
