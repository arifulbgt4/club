import React from "react";
import { getAnIssue } from "../action";

interface IssuePageProps {
  params: { issueId: string };
}

const IssuePage = async ({ params: { issueId } }: IssuePageProps) => {
  const issue = await getAnIssue(issueId);
  return (
    <div>
      <h1>{issue?.title}</h1>
      <p>{issue?.body}</p>
    </div>
  );
};

export default IssuePage;
