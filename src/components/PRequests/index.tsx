"use server";
import { type FC } from "react";
import { type PRequestsProps } from "./Types";
import EmptyState from "../shared/empty-state";
import { getList } from "./action";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDistanceToNow } from "date-fns";
import Icons from "../shared/icons";

const PRequests: FC<PRequestsProps> = async () => {
  const { requests, count } = await getList();
  if (!count)
    return (
      <EmptyState
        title="Request List Currently Empty Now"
        description="Your applied issue list is empty. Explore and apply additional issues to get started"
      />
    );
  return (
    <div className="flex flex-col">
      <span className=" border-b py-3 font-medium">Applyed</span>
      {requests?.map((d) => (
        <Link
          key={d?.id}
          href={`/issue/${d?.issueId}`}
          className=" flex flex-col rounded border-b border-l border-r px-5 py-4 hover:bg-accent"
        >
          <span className="mb-0.5 text-sm text-muted-foreground">
            applyed{" "}
            {formatDistanceToNow(new Date(d?.updatedAt), {
              addSuffix: true,
              includeSeconds: true,
            })}
          </span>
          <span className=" text-xl">{d?.issue?.title}</span>
          <div className="mt-2 flex items-center">
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
            <span className=" ml-1 text-sm font-semibold">
              {d?.issue?.user?.username}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PRequests;
