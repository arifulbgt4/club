"use server";
import { type FC } from "react";
import { type PRequestsProps } from "./Types";
import EmptyState from "../shared/empty-state";
import { getList } from "./action";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import Pagination from "../sections/pagination";
import { TASK_TABS } from "~/types";

const PRequests: FC<PRequestsProps> = async ({ pagination, total }) => {
  const { requests, take, page } = await getList(pagination);
  if (!total)
    return (
      <EmptyState
        title="Request List Currently Empty Now"
        description="Your applied issue list is empty. Explore and apply additional issues to get started"
      />
    );

  const totalPages = Math.ceil(total / take);
  return (
    <div className="flex flex-col">
      <span className=" border-b py-3 font-medium">Applyed</span>
      {requests?.map((d) => (
        <Link
          key={d?.id}
          href={`/issue/${d?.issueId}`}
          className=" flex flex-col rounded border-b border-l border-r px-5 py-4 hover:bg-accent"
        >
          <span className="mb-1 text-sm text-muted-foreground">
            applyed{" "}
            {formatDistanceToNow(new Date(d?.updatedAt), {
              addSuffix: true,
              includeSeconds: true,
            })}
          </span>
          <span className=" text-xl">{d?.issue?.title}</span>
        </Link>
      ))}
      <div className="mt-3">
        <Pagination
          page={page}
          more={`?t=${TASK_TABS.applyed}`}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default PRequests;
