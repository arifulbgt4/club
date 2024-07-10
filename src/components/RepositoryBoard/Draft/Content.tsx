"use client";
import { type Intent, IntentType, type Issue } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { useState, type FC } from "react";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import Update from "./Update";

const Content: FC<{ issue: Issue; intent: Intent }> = ({ issue, intent }) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex cursor-pointer flex-nowrap items-start justify-between gap-5 rounded-lg border p-4 hover:bg-accent">
          <div className="flex flex-col">
            <div className="flex w-full flex-col">
              <div className="mb-1.5 flex flex-col">
                <div className="text-xs text-muted-foreground">
                  #{issue?.issueNumber} {" • "} draft{" "}
                  {formatDistanceToNow(new Date(intent?.updatedAt), {
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

          <div className="flex w-28 justify-end pt-3 text-right text-base text-green-500">
            {intent?.type === IntentType.paid ? (
              `$ ${intent?.price?.toFixed(2) ?? (0).toFixed(2)}`
            ) : (
              <span className=" text-muted-foreground">open-source</span>
            )}
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <Update setOpen={setOpen} issueId={issue?.id} />
      </DialogContent>
    </Dialog>
  );
};

export default Content;
