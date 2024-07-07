"use client";
import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Sheet, SheetTrigger } from "~/components/ui/sheet";
import { IssueType } from "@prisma/client";
import RequestList from "./RequestList";
import type { IssueOptions } from "~/types";

const Content = ({ issue }: { issue: IssueOptions }) => {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div className="mr-5 flex cursor-pointer flex-col items-start rounded-lg border p-4 pr-9 hover:bg-accent">
          <div className="flex w-full flex-col">
            <div className="mb-1 flex items-center">
              <div className="mb-0.5 flex flex-col">
                <div className="text-xs text-muted-foreground">
                  #{issue?.issueNumber} {" • "} published{" "}
                  {formatDistanceToNow(new Date(issue?.createdAt), {
                    addSuffix: true,
                    includeSeconds: true,
                  })}
                </div>
                <span className=" text-xl font-semibold">{issue?.title}</span>
              </div>
              <div className="ml-auto text-base text-green-500">
                {issue?.type === IssueType.paid ? (
                  `$ ${issue?.price?.toFixed(2)}`
                ) : (
                  <span className=" text-muted-foreground">open-source</span>
                )}
              </div>
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
      </SheetTrigger>
      {open && <RequestList id={issue?.id} setOpen={setOpen} />}
    </Sheet>
  );
};

export default Content;
