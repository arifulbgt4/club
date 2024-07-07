import { formatDistanceToNow } from "date-fns";
import { getPublished } from "../action";
import { IssueType } from "@prisma/client";
import Pagination from "~/components/sections/pagination";

const Published = async ({
  p,
  repoId,
  total,
}: {
  p: number;
  repoId: string;
  total: number;
}) => {
  const data = await getPublished(repoId, p);
  if (!data || !data?.issues?.length) {
    return (
      <div>
        <span>No published issue</span>
      </div>
    );
  }
  const { issues, take, page } = data;

  const totalPages = Math.ceil(total / take);

  return (
    <>
      <div className="max-h-[calc(100vh-279px)] overflow-scroll ">
        <div className="min-h-[calc(100vh-279px)] pt-3">
          {issues?.map((i) => (
            <div
              key={i?.id}
              className="mb-2 flex flex-col items-start rounded-lg border p-4 text-left text-sm transition-all hover:bg-accent "
            >
              <div className="flex w-full flex-col">
                <div className="mb-1 flex items-center">
                  <div className="mb-0.5 flex flex-col">
                    <div className="text-xs text-muted-foreground">
                      #{i?.issueNumber} {" • "} published{" "}
                      {formatDistanceToNow(new Date(i?.createdAt), {
                        addSuffix: true,
                        includeSeconds: true,
                      })}
                    </div>
                    <span className=" text-xl font-semibold">{i?.title}</span>
                  </div>
                  <div className="ml-auto text-base text-green-500">
                    {i?.type === IssueType.paid ? (
                      `$ ${i?.price?.toFixed(2)}`
                    ) : (
                      <span className=" text-muted-foreground">
                        open-source
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {i?.topics?.length ? (
                <div className=" my-1 flex flex-wrap gap-1">
                  {i?.topics?.map((t, i) => (
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
      <Pagination page={page} totalPages={totalPages} justify="start" />
    </>
  );
};

export default Published;
