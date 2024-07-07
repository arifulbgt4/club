import { getPublished } from "../action";
import Pagination from "~/components/sections/pagination";
import { Button, buttonVariants } from "~/components/ui/button";
import { Edit2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { cn } from "~/lib/utils";
import Content from "./Content";

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
                <Content issue={i} />
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
