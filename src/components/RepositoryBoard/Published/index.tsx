import { formatDistanceToNow } from "date-fns";
import { getPublished } from "../action";
import { IssueType } from "@prisma/client";
import Pagination from "~/components/sections/pagination";
import { Button, buttonVariants } from "~/components/ui/button";
import { Edit2, ExternalLink, SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "~/lib/utils";

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
          <div className=" flex flex-col gap-3">
            {issues?.map((i) => (
              <div key={i?.id} className=" group relative mr-5">
                <div className="mr-5 flex flex-col items-start rounded-lg border p-4 pr-9 hover:bg-accent">
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
                        <span className=" text-xl font-semibold">
                          {i?.title}
                        </span>
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
                <div className=" absolute right-0 top-3 flex flex-col gap-2 opacity-30 transition-opacity group-hover:opacity-100">
                  <Link
                    href={`/issue/${i?.id}`}
                    target="_blank"
                    className={cn(
                      buttonVariants({ size: "icon", variant: "outline" }),
                      "rounded-full"
                    )}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  <Button
                    size="icon"
                    variant="outline"
                    className=" rounded-full"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Pagination page={page} totalPages={totalPages} justify="start" />
    </>
  );
};

export default Published;
