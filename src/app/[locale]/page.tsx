import PublishedIssueItem from "~/components/PublishedIssueItem/PublishedIssueItem";
import { getIssues } from "./action";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Search } from "lucide-react";
import Pagination from "~/components/sections/pagination";

export default async function Home({
  searchParams,
}: {
  searchParams: { page: string };
}) {
  const { issues, total, take, page } = await getIssues(
    Number(searchParams.page) || 1
  );
  const totalPages = Math.ceil(total / take);
  return (
    <div className="container">
      <div className="mt-3 flex">
        <div className="flex w-[70%] flex-col pr-3">
          <div className="mb-3 flex  w-full items-center space-x-2">
            <Input type="search" placeholder="Search..." />
            <Button size="icon" variant="outline">
              <Search />
            </Button>
          </div>
          {issues.map((issue) => (
            <PublishedIssueItem key={issue.id} {...issue} />
          ))}
          <Pagination page={page} totalPages={totalPages} />
        </div>
        <div className="flex w-[30%] p-3">card</div>
      </div>
    </div>
  );
}
