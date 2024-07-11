import { type FC } from "react";
import { type StrProps } from "./Types";
import EmptyState from "../shared/empty-state";
import { getList } from "./action";
import Pagination from "../sections/pagination";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { TASK_TABS } from "~/types";

const Str: FC<StrProps> = async ({ pagination, total }) => {
  const { intents, take, page } = await getList(pagination);
  if (!total)
    return (
      <div>
        <EmptyState
          title="No Issues Submitted for Review"
          description="The review queue is currently empty. This indicates there are no submissions pending your evaluation or assessment"
        />
      </div>
    );
  const totalPages = Math.ceil(total / take);
  return (
    <div className="flex flex-col">
      <span className=" border-b py-3 font-medium">In Review</span>
      {intents?.map((intent) => (
        <Link
          key={intent?.id}
          href={`/issue/${intent?.issueId}`}
          className=" flex flex-col rounded border-b border-l border-r px-5 py-4 hover:bg-accent"
        >
          <span className="mb-1 text-sm text-muted-foreground">
            submitted{" "}
            {formatDistanceToNow(new Date(intent?.updatedAt), {
              addSuffix: true,
              includeSeconds: true,
            })}
          </span>
          <span className=" text-xl">{intent?.issue?.title}</span>
          {/* <div className="mt-3 flex ">
            <div className="box-border flex items-center  rounded-full border pr-2">
              <Avatar className=" h-5 w-5">
                <AvatarImage
                  src={intent?.issue?.user?.picture as string}
                  alt={intent?.issue?.user?.username as string}
                  title={intent?.issue?.user?.name as string}
                />
                <AvatarFallback>
                  <Icons.spinner className=" animate-spin" />
                </AvatarFallback>
              </Avatar>
              <span className=" ml-1.5 text-sm font-semibold text-muted-foreground">
                {intent?.issue?.user?.username}
              </span>
            </div>
          </div> */}
        </Link>
      ))}
      <div className="mt-3">
        <Pagination
          page={page}
          more={`?t=${TASK_TABS.str}`}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default Str;
