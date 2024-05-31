import { useCallback, useEffect, useState, type FC } from "react";
import { type GitIssueListProps } from "./Types";
import GitIssueItem from "../GitIssueItem";

const GitIssueList: FC<GitIssueListProps> = ({ repoId, repoName }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getIssues = useCallback(async () => {
    try {
      const res = await fetch(`/api/issue/gitissue?repo=${repoName}`);
      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      setIssues(data?.data || []);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.message || "An error occurred while fetching issues.");
    } finally {
      setLoading(false);
    }
  }, [repoName]);

  useEffect(() => {
    getIssues();
  }, [getIssues]);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2>Error: {error}</h2>;
  }

  return (
    <div>
      {issues.length === 0 ? (
        <h2>No issues found.</h2>
      ) : (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        issues.map((issue: any) => (
          <GitIssueItem key={issue.id} {...issue} repoId={repoId} />
        ))
      )}
    </div>
  );
};

export default GitIssueList;
