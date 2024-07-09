import EmptyState from "~/components/shared/empty-state";
import { getDraft } from "../action";
import Pagination from "~/components/sections/pagination";
import { formatDistanceToNow } from "date-fns";
import { IssueType } from "@prisma/client";
import Content from "./Content";

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
            {issues?.map((issue) => <Content key={issue?.id} issue={issue} />)}
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
