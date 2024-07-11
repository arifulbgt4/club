import { type FC } from "react";
import { type FailedProps } from "./Types";
import EmptyState from "../shared/empty-state";
import { getList } from "./action";
import Pagination from "../sections/pagination";
import { TASK_TABS } from "~/types";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

const Failed: FC<FailedProps> = async ({ pagination, total }) => {
  const { intents, take, page } = await getList(pagination);

  if (!total)
    return (
      <div>
        <EmptyState title="You haven't failed any issues yet" />
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
            failed{" "}
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
          more={`?t=${TASK_TABS.failed}`}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default Failed;
