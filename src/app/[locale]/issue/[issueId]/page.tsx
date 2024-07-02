/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { formatDistanceToNow } from "date-fns";

import { getAnIssue } from "../action";
import IssueComment from "~/components/IssueComment";
import Apply from "~/components/Apply";
import Description from "./description";
import { type IssueType } from "@prisma/client";
import SignUpPromotion from "~/components/SignUpPromotion";
import { hexToRgba } from "~/lib/utils";

interface IssuePageProps {
  params: { issueId: string };
}

const IssuePage = async ({ params: { issueId } }: IssuePageProps) => {
  const { issue, dbIssue, comments, isOwn, isAuthenticated } =
    await getAnIssue(issueId);
  return (
    <div className="mt-6 flex flex-col">
      <div className=" border-b">
        <h1 className=" mb-2 break-words text-3xl">{issue?.title}</h1>
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
        <div className=" mr-9 flex w-[75%] flex-col">
          <div className="mb-6 flex flex-auto">
            <Description body={issue?.body as string} />
          </div>
          <div className="flex flex-col">
            {!!issue?.comments && (
              <span className=" mb-3 font-bold">Comments</span>
            )}
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
        <div className="flex w-[25%] flex-col">
          {!isAuthenticated && (
            <div className="mb-6">
              <SignUpPromotion />
            </div>
          )}
          <Apply
            issueId={issueId}
            price={dbIssue?.price as number}
            issueType={dbIssue.type as IssueType}
            disabled={isOwn || !isAuthenticated}
          />
          <div className="mb-6">
            {dbIssue?.tag?.length ? (
              <div className="flex flex-col">
                <span className=" pb-2 text-sm font-medium">Topics</span>
                <div className=" flex flex-wrap">
                  {dbIssue?.tag?.map((t, i) => (
                    <span
                      key={i}
                      className=" m-1 rounded bg-accent px-2 py-0.5 text-sm font-medium text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          {issue?.labels?.length ? (
            <div className="flex flex-col">
              <span className=" pb-3 text-sm font-medium">Labels</span>
              <div className="flex flex-wrap">
                {issue?.labels?.map((label: any) => (
                  <span
                    key={label?.id}
                    style={{
                      background: hexToRgba(`#${label?.color}`, 0.3),
                      borderColor: hexToRgba(`#${label?.color}`, 0.6),
                      color: `#${label?.color}`,
                    }}
                    className={`mb-2 mr-2 rounded-full border px-2.5 py-0.5 text-xs font-medium text-gray-800`}
                  >
                    {label?.name}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default IssuePage;
