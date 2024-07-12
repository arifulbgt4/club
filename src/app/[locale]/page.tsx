"use server";
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
  const { intents, total, take, page } = await getIssues(
    Number(searchParams.page) || 1,
    topics
  );
  const totalPages = Math.ceil(total / take);
  return (
    <div className="container">
      <div className="flex pb-10 pt-3">
        <div className=" flex w-[70%] flex-col pr-3">
          <div className="mb-3 flex  w-full items-center space-x-2">
            <SearchByTopics params={topics} isAuthenticate={!!session} />
          </div>
          {!!intents?.length ? (
            <>
              {intents.map((intent) => (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                <PublishedIssueItem key={intent.id} {...(intent as any)} />
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
            <EmptyState title="No issues found" border={false} full={false} />
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
