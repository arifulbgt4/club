import { type FC } from "react";
import { type CompletedProps } from "./Types";
import EmptyState from "../shared/empty-state";
import { getList } from "./action";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Icons from "../shared/icons";
import Pagination from "../sections/pagination";
import { TASK_TABS } from "~/types";

const Completed: FC<CompletedProps> = async ({ pagination }) => {
  const { requests, total, take, page } = await getList(pagination);
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
      {requests?.map((d) => (
        <Link
          key={d?.id}
          href={`/issue/${d?.issueId}`}
          className=" flex flex-col rounded border-b border-l border-r px-5 py-4 hover:bg-accent"
        >
          <span className="mb-1 text-sm text-muted-foreground">
            completed{" "}
            {formatDistanceToNow(new Date(d?.updatedAt), {
              addSuffix: true,
              includeSeconds: true,
            })}
          </span>
          <span className=" text-xl">{d?.issue?.title}</span>
          <div className="mt-3 flex ">
            <div className="box-border flex items-center  rounded-full border pr-2">
              <Avatar className=" h-5 w-5">
                <AvatarImage
                  src={d?.issue?.user?.picture as string}
                  alt={d?.issue?.user?.username as string}
                  title={d?.issue?.user?.name as string}
                />
                <AvatarFallback>
                  <Icons.spinner className=" animate-spin" />
                </AvatarFallback>
              </Avatar>
              <span className=" ml-1.5 text-sm font-semibold text-muted-foreground">
                {d?.issue?.user?.username}
              </span>
            </div>
          </div>
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
