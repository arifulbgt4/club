import PublishedIssueItem from "~/components/PublishedIssueItem/PublishedIssueItem";
import { getIssues } from "./action";
import Pagination from "~/components/sections/pagination";
import RequestedCard from "~/components/RequestedCard";
import { validateRequest } from "~/server/auth";
import InReviewCard from "~/components/InReviewCard";
import SignUpPromotion from "~/components/SignUpPromotion";
import RequestChangesCard from "~/components/RequestChangesCard";
import EmptyState from "~/components/shared/empty-state";
import SearchByTopics from "~/components/SearchByTopics";

export default async function Home({
  searchParams,
}: {
  searchParams: { page: string; topics: string };
}) {
  const { session } = await validateRequest();
  const topics =
    (!!searchParams?.topics && searchParams?.topics?.split(",")) || [];
  const { issues, total, take, page } = await getIssues(
    Number(searchParams.page) || 1,
    topics
  );
  const totalPages = Math.ceil(total / take);
  return (
    <div className="container">
      <div className="mb-9 mt-3 flex">
        <div className=" flex w-[70%] flex-col pr-3">
          <div className="mb-3 flex  w-full items-center space-x-2">
            <SearchByTopics params={topics} />
          </div>
          {!!issues?.length ? (
            <>
              {issues.map((issue) => (
                <PublishedIssueItem key={issue.id} {...issue} />
              ))}
              <Pagination
                page={page}
                totalPages={totalPages}
                more={
                  !!searchParams?.topics
                    ? `?topics=${searchParams?.topics}`
                    : ""
                }
              />
            </>
          ) : (
            <EmptyState title="No issues found" />
          )}
        </div>
        <div className="flex w-[30%] flex-col pl-6">
          {!!session ? (
            <>
              <div className="mb-6">
                <RequestedCard />
              </div>
              <div className="mb-6">
                <InReviewCard />
              </div>
              <RequestChangesCard />
            </>
          ) : (
            <SignUpPromotion />
          )}
        </div>
      </div>
    </div>
  );
}
