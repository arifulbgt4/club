import PublishedIssueItem from "~/components/PublishedIssueItem/PublishedIssueItem";
import { getIssues } from "./action";

export default async function Home() {
  const issues = await getIssues();
  return (
    <div className="container">
      {issues.map((issue) => (
        <PublishedIssueItem key={issue.id} {...issue} />
      ))}
    </div>
  );
}
