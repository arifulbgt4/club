import { IssueType } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import React, { type FC } from "react";
import type { IssueOptions } from "~/types";

const Content: FC<{ issue: IssueOptions }> = ({ issue }) => {
  return (
    <div className="flex cursor-pointer flex-nowrap items-start justify-between gap-5 rounded-lg border p-4 hover:bg-accent">
      <div className="flex flex-col">
        <div className="flex w-full flex-col">
          <div className="mb-1.5 flex flex-col">
            <div className="text-xs text-muted-foreground">
              #{issue?.issueNumber} {" • "} draft{" "}
              {formatDistanceToNow(new Date(issue?.updatedAt), {
                addSuffix: true,
                includeSeconds: true,
              })}
            </div>
            <span className=" text-xl font-semibold">{issue?.title}</span>
          </div>
        </div>

        {issue?.topics?.length ? (
          <div className=" my-1 flex flex-wrap gap-1">
            {issue?.topics?.map((t, i) => (
              <span
                key={i}
                className=" rounded bg-accent px-2 py-0.5 text-sm font-medium text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="flex w-28 justify-end text-right text-base text-green-500">
        {issue?.type === IssueType.paid ? (
          `$ ${issue?.price?.toFixed(2) ?? (0).toFixed(2)}`
        ) : (
          <span className=" text-muted-foreground">open-source</span>
        )}
      </div>
    </div>
  );
};

export default Content;
