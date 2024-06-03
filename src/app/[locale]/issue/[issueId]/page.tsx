import React from "react";
import { formatDistanceToNow } from "date-fns";

import { getAnIssue } from "../action";
import IssueComment from "~/components/IssueComment";
import Apply from "~/components/Apply";

interface IssuePageProps {
  params: { issueId: string };
}

const IssuePage = async ({ params: { issueId } }: IssuePageProps) => {
  const { issue, dbIssue, comments } = await getAnIssue(BigInt(issueId));
  return (
    <div className="mt-6 flex flex-col">
      <div className=" border-b">
        <h1 className=" mb-2 break-words text-3xl uppercase ">
          {issue?.title}
        </h1>
        <p className=" mb-2 text-sm font-medium text-muted-foreground">
          <span className=" font-bold">{dbIssue?.user?.username}</span>{" "}
          published this issue{" "}
          {formatDistanceToNow(new Date(dbIssue?.updatedAt), {
            addSuffix: true,
            includeSeconds: true,
          })}
          {` • ${issue?.comments} comments`}
        </p>
      </div>
      <div className="my-5 flex">
        <div className=" mr-9 flex w-[70%] flex-col">
          <div className=" mb-6 flex flex-1 rounded border p-3">
            <span>{issue?.body || "No description provided."}</span>
          </div>
          <div className="flex flex-col">
            <span className=" mb-3 font-bold">Comments</span>
            {comments?.map((com) => (
              <IssueComment
                key={com?.id}
                imgSrc={com?.user?.avatar_url as string}
                username={com?.user?.login as string}
                body={com?.body}
                updatedAt={com?.updated_at}
                createdAt={com?.created_at}
                authorAssociation={com?.author_association}
              />
            ))}
          </div>
        </div>
        <div className="flex w-[30%]">
          <Apply />
        </div>
      </div>
    </div>
  );
};

export default IssuePage;
