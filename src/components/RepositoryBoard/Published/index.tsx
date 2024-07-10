import { getPublished } from "../action";
import Pagination from "~/components/sections/pagination";
import { buttonVariants } from "~/components/ui/button";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { cn } from "~/lib/utils";
import Content from "./Content";
import EmptyState from "~/components/shared/empty-state";
import EditModal from "./EditModal";
import type { IssueOptions } from "~/types";

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
  if (!data || !data?.intents?.length) {
    return <EmptyState title="No issues published yet" />;
  }
  const { intents, take, page } = data;

  const totalPages = Math.ceil(total / take);

  return (
    <>
      <div className="max-h-[calc(100vh-279px)] overflow-scroll ">
        <div className="min-h-[calc(100vh-279px)] pt-3">
          <div className=" flex flex-col gap-3">
            {intents?.map((intent) => (
              <div key={intent?.id} className=" group relative mr-5">
                <Content
                  issue={intent?.issue as IssueOptions}
                  intent={intent}
                />
                <div className=" absolute right-0 top-3 flex flex-col gap-2 opacity-30 transition-opacity group-hover:opacity-100">
                  <Link
                    href={`/issue/${intent?.issue?.id}`}
                    target="_blank"
                    className={cn(
                      buttonVariants({ size: "icon", variant: "outline" }),
                      "rounded-full"
                    )}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  <EditModal issueId={intent?.issue?.id as string} />
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
