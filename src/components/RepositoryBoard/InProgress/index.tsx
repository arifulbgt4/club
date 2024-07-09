import EmptyState from "~/components/shared/empty-state";
import { getInProgress } from "../action";
import Pagination from "~/components/sections/pagination";
import Content from "./Content";
import type { IssueOptions } from "~/types";

const InProgress = async ({
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
  const data = await getInProgress(repoId, p);
  if (!data || !data?.issues?.length) {
    return <EmptyState title="No issues in progress" />;
  }
  const { issues, take, page } = data;

  const totalPages = Math.ceil(total / take);

  return (
    <>
      <div className="max-h-[calc(100vh-279px)] overflow-scroll ">
        <div className="min-h-[calc(100vh-279px)] pt-3">
          <div className=" flex flex-col gap-3">
            {issues?.map((issue) => (
              <Content key={issue?.id} issue={issue as IssueOptions} />
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

export default InProgress;
