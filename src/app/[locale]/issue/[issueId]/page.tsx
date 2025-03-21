"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { type IntentType } from "@prisma/client";
import IssueComment from "~/components/IssueComment";
import Apply from "~/components/Apply";
import SignUpPromotion from "~/components/SignUpPromotion";
import Markdown from "~/components/sections/Markdown";
import { hexToRgba } from "~/lib/utils";
import { getAnIssue } from "../action";
import { Lock, Unlock } from "lucide-react";
import Link from "next/link";

interface IssuePageProps {
  params: { issueId: string };
}

export default async function IssuePage({
  params: { issueId },
}: IssuePageProps) {
  const data = await getAnIssue(issueId);

  if (data === null) {
    return <span>No issue Found</span>;
  }

  const { issue, dbIssue, comments, isOwn, isAuthenticated, isCollaborator } =
    data;

  return (
    <div className="mt-6 flex flex-col">
      <div className=" border-b">
        <h1 className=" mb-2 break-words text-3xl">{issue?.title}</h1>
        <p className=" mb-2 text-sm font-medium text-muted-foreground">
          <span className=" font-bold">
            {dbIssue?.repository?.provider?.name}
          </span>{" "}
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
          <div className="mb-6 flex flex-auto flex-col">
            <Markdown
              className="rounded-md border p-4"
              body={issue?.body_html as string}
            />
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
                body={com?.body_html}
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
          {!!dbIssue?.intent?.length && (
            <Apply
              issueId={issueId}
              price={dbIssue?.intent[0]?.price as number}
              issueType={dbIssue?.intent[0].type as IntentType}
              disabled={isOwn || !isAuthenticated}
            />
          )}
          <div className="mb-6">
            {dbIssue?.topics?.length ? (
              <div className="flex flex-col">
                <span className=" pb-2 text-sm font-medium">Topics</span>
                <div className=" flex flex-wrap">
                  {dbIssue?.topics?.map((t, i) => (
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
            <div className="mb-3 flex flex-col">
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
          <div className=" flex flex-col gap-2">
            {dbIssue?.repository?.private ? (
              <div className="flex items-center gap-1.5">
                <Lock className="h-4 w-4" />
                <span className="font-semibold">Private</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Unlock className="h-4 w-4" />
                <span className="font-semibold">Public</span>
              </div>
            )}
            {(!dbIssue?.repository?.private || isOwn || isCollaborator) && (
              <div className="flex flex-col gap-1">
                <Link
                  className=" text-blue-500 hover:underline"
                  href={`https://github.com/${dbIssue?.repository?.fullName}`}
                  target="_blank"
                >
                  {dbIssue?.repository?.fullName}{" "}
                  <span className="text-sm">↗</span>
                </Link>
                <Link
                  className=" text-blue-500 hover:underline"
                  href={`https://github.com/${dbIssue?.repository?.fullName}/issues/${dbIssue?.issueNumber}`}
                  target="_blank"
                >
                  #{dbIssue?.issueNumber} issue{" "}
                  <span className="text-sm">↗</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
