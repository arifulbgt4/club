import EmptyState from "~/components/shared/empty-state";
import { getDraft } from "../action";
import Pagination from "~/components/sections/pagination";
import Content from "./Content";
import type { IssueOptions } from "~/types";

const Draft = async ({
  p,
  b,
  total,
  repoId,
  isPrivate,
}: {
  p: number;
  b: string;
  total: number;
  repoId: string;
  isPrivate: boolean;
}) => {
  // const data = await getDraft(repoId, p);
  const data = await getDraft(repoId, p);
  if (!data || !data?.intents?.length) {
    return <EmptyState title="No issues in draft" />;
  }
  const { intents, take, page } = data;

  const totalPages = Math.ceil(total / take);

  return (
    <>
      <div className="max-h-[calc(100vh-267px)] overflow-scroll ">
        <div className="min-h-[calc(100vh-267px)] pt-3">
          <div className=" flex flex-col gap-3">
            {intents?.map((intent) => (
              <Content
                key={intent?.id}
                issue={intent.issue as IssueOptions}
                intent={intent}
                isPrivate={isPrivate}
              />
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
