import EmptyState from "~/components/shared/empty-state";
import { getInReview } from "../action";
import Pagination from "~/components/sections/pagination";
import { formatDistanceToNow } from "date-fns";
import { IssueType } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import Icons from "~/components/shared/icons";
import { GitPullRequest } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import Info from "./Info";
import type { IssueOptions } from "~/types";

const InReview = async ({
  p,
  b,
  total,
  repoId,
}: {
  p: number;
  b: string;
  total: number;
  repoId: string;
}) => {
  const data = await getInReview(repoId, p);
  if (!data || !data?.issues?.length) {
    return <EmptyState title="No issues in review" />;
  }
  const { issues, take, page } = data;

  const totalPages = Math.ceil(total / take);

  return (
    <>
      <div className="max-h-[calc(100vh-279px)] overflow-scroll ">
        <div className="min-h-[calc(100vh-279px)] pt-3">
          <div className=" flex flex-col gap-3">
            {issues?.map((issue) => (
              <Dialog key={issue?.id}>
                <DialogTrigger asChild>
                  <div className="flex cursor-pointer flex-nowrap items-start justify-between gap-5 rounded-lg border p-4 hover:bg-accent">
                    <div className="flex flex-col">
                      <div className="flex w-full flex-col">
                        <div className="mb-1.5 flex flex-col">
                          <div className="text-xs text-muted-foreground">
                            #{issue?.issueNumber} {" • "} in-review{" "}
                            {formatDistanceToNow(new Date(issue?.updatedAt), {
                              addSuffix: true,
                              includeSeconds: true,
                            })}
                          </div>
                          <span className=" text-xl font-semibold">
                            {issue?.title}
                          </span>
                        </div>
                      </div>

                      {issue?.topics?.length ? (
                        <div className=" my-1 flex flex-wrap gap-1">
                          {issue?.topics?.map((t, i) => (
                            <span
                              key={i}
                              className=" rounded bg-accent px-2 py-0.5 text-sm font-medium text-muted-foreground"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="mt-2 flex items-center gap-1.5">
                        <Avatar className="h-6 w-6 border border-black">
                          <AvatarImage
                            src={issue?.assigned?.picture as string}
                            title={issue?.assigned?.username as string}
                          />
                          <AvatarFallback>
                            <Icons.spinner className=" animate-spin" />
                          </AvatarFallback>
                        </Avatar>
                        <span className=" font-semibold">
                          {issue?.assigned?.name}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-5">
                      <div className=" text-base text-green-500">
                        {issue?.type === IssueType.paid ? (
                          `$ ${issue?.price?.toFixed(2)}`
                        ) : (
                          <span className=" text-muted-foreground">
                            open-source
                          </span>
                        )}
                      </div>
                      <span className="flex items-center gap-1 text-indigo-500">
                        <GitPullRequest className="h-5 w-5" />
                        <span className="text-lg font-medium ">
                          {issue?.prNumber}
                        </span>
                      </span>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <Info issue={issue as IssueOptions} />
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </div>
      <Pagination
        page={page}
        totalPages={totalPages}
        more={`?b=${b}`}
        justify="start"
      />
    </>
  );
};

export default InReview;
