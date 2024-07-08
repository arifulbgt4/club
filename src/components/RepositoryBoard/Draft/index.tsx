import EmptyState from "~/components/shared/empty-state";
import { getDraft } from "../action";
import Pagination from "~/components/sections/pagination";
import { formatDistanceToNow } from "date-fns";
import { IssueType } from "@prisma/client";

const Draft = async ({
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
  const data = await getDraft(repoId, p);
  if (!data || !data?.issues?.length) {
    return <EmptyState title="No issues in draft" />;
  }
  const { issues, take, page } = data;

  const totalPages = Math.ceil(total / take);

  return (
    <>
      <div className="max-h-[calc(100vh-279px)] overflow-scroll ">
        <div className="min-h-[calc(100vh-279px)] pt-3">
          <div className=" flex flex-col gap-3">
            {issues?.map((issue) => (
              <div
                key={issue?.id}
                className="mr-5 flex cursor-pointer flex-col items-start rounded-lg border p-4 pr-9 hover:bg-accent"
              >
                <div className="flex w-full flex-col">
                  <div className="mb-1 flex items-center">
                    <div className="mb-0.5 flex flex-col">
                      <div className="text-xs text-muted-foreground">
                        #{issue?.issueNumber} {" • "} draft{" "}
                        {formatDistanceToNow(new Date(issue?.updatedAt), {
                          addSuffix: true,
                          includeSeconds: true,
                        })}
                      </div>
                      <span className=" text-xl font-semibold">
                        {issue?.title}
                      </span>
                    </div>
                    <div className="ml-auto text-base text-green-500">
                      {issue?.type === IssueType.paid ? (
                        `$ ${issue?.price?.toFixed(2)}`
                      ) : (
                        <span className=" text-muted-foreground">
                          open-source
                        </span>
                      )}
                    </div>
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
              </div>
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

export default Draft;
