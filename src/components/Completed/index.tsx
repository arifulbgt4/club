import { type FC } from "react";
import { type CompletedProps } from "./Types";
import EmptyState from "../shared/empty-state";
import { getList } from "./action";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import Pagination from "../sections/pagination";
import { TASK_TABS } from "~/types";

const Completed: FC<CompletedProps> = async ({ pagination, total }) => {
  const { intents, take, page } = await getList(pagination);
  if (!total)
    return (
      <div>
        <EmptyState
          title="You haven't completed any issues yet"
          description="You haven't completed issues, begin your journey by selecting and tackling your first challenge to make meaningful progress"
        />
      </div>
    );
  const totalPages = Math.ceil(total / take);
  return (
    <div className="flex flex-col">
      <span className=" border-b py-3 font-medium">Re-assigned</span>
      {intents?.map((intent) => (
        <Link
          key={intent?.id}
          href={`/issue/${intent?.issueId}`}
          className=" flex flex-col rounded border-b border-l border-r px-5 py-4 hover:bg-accent"
        >
          <span className="mb-1 text-sm text-muted-foreground">
            completed{" "}
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
          more={`?t=${TASK_TABS.completed}`}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default Completed;
