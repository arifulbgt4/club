/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { type PublishedIssueItemProps } from "./Types";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { getIssue } from "./action";
import { hexToRgba } from "~/lib/utils";
import { IssueType } from "@prisma/client";
import type { RepositoryOptions } from "~/types";

export default async function PublishedIssueItem({
  id,
  issueNumber,
  repository,
  updatedAt,
  price,
  type,
  topics,
}: PublishedIssueItemProps) {
  const issue = await getIssue(
    repository as RepositoryOptions,
    Number(issueNumber)
  );

  return (
    <Link
      href={`/issue/${id}`}
      className="mb-2 flex flex-col items-start rounded-lg border p-4 text-left text-sm transition-all hover:bg-accent "
    >
      <div className="flex w-full flex-col">
        <div className="mb-1 flex items-center">
          <div className="mb-0.5 flex flex-col">
            <div className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(updatedAt), {
                addSuffix: true,
                includeSeconds: true,
              })}
            </div>
            <span className=" text-xl font-semibold">{issue?.title}</span>
            {/* // TODO: If a issue visit then the dot will not show */}
            {/* <span className="flex h-2 w-2 rounded-full bg-blue-600" /> */}
          </div>
          <div className="ml-auto text-base text-green-500">
            {type === IssueType.paid ? (
              `$ ${price?.toFixed(2)}`
            ) : (
              <span className=" text-muted-foreground">open-source</span>
            )}
          </div>
        </div>
        <div className="mb-2 flex items-center">
          <Avatar className="mr-1 h-[15px] w-[15px] rounded-sm">
            <AvatarImage src={repository?.provider?.picture as string} />
          </Avatar>
          <p className=" ml-0.5 font-medium text-muted-foreground">
            {repository?.provider?.name}
          </p>
        </div>
        {/* <div className="text-xs font-medium">{user?.username}</div> */}
      </div>
      <p className={`mb-4 text-gray-500 ${!issue?.body && " italic"}`}>
        {issue?.body
          ? issue?.body?.substring(0, 100) + " ..."
          : "No description provided."}
      </p>

      {issue?.labels?.length ? (
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
      ) : (
        ""
      )}
      {topics?.length ? (
        <div className=" my-1 flex flex-wrap gap-1">
          {topics?.map((t, i) => (
            <span
              key={i}
              className="rounded bg-accent px-2 py-0.5 text-sm font-medium text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      ) : (
        ""
      )}
    </Link>
  );
}
