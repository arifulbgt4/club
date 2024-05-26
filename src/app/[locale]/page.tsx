import PublishedIssueItem from "~/components/PublishedIssueItem/PublishedIssueItem";
import { getIssues } from "./action";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Search } from "lucide-react";

export default async function Home() {
  const issues = await getIssues();
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
        </div>
        <div className="flex w-[30%] p-3">card</div>
      </div>
    </div>
  );
}
