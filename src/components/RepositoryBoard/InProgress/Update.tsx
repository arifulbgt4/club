import React, { useCallback, useEffect, useState } from "react";
import Countdown from "~/components/sections/Countdown";
import Icons from "~/components/shared/icons";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { addDays, formatDate } from "~/lib/utils";
import type { IssueOptions, RequestOptions } from "~/types";

const Update = ({
  id,
  setOpen,
}: {
  id: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [loading, setLoading] = useState(true);
  const [issue, setIssue] = useState<IssueOptions>();
  const [request, setRequest] = useState<RequestOptions>();

  const fetchIssue = useCallback(async () => {
    const res = await fetch(`/api/v1/issue/intent?id=${id}`, { method: "GET" });
    if (!res.ok) {
      return;
    }
    const resDate = await res.json();
    setIssue(resDate?.issue);
    setRequest(resDate?.request);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchIssue();
  }, [fetchIssue]);
  if (loading)
    return (
      <div className="flex h-[204px] items-center justify-center">
        <Icons.spinner className=" animate-spin" />
      </div>
    );

  return (
    <>
      <DialogHeader>
        <DialogTitle>{issue?.title}</DialogTitle>
        <DialogDescription>The issue work is progress</DialogDescription>
      </DialogHeader>
      <div className="flex gap-2">
        <div className=" flex items-center gap-1.5">
          <Avatar className="h-6 w-6">
            <AvatarImage
              src={request?.user?.picture as string}
              alt={("@" + request?.user?.username) as string}
            />
          </Avatar>
          <span className="font-semibold">{request?.user?.username}</span>
        </div>
        <span>Working on this issue</span>
      </div>
      <div className="flex flex-col gap-1">
        <div className=" flex gap-5">
          <div className="flex items-center gap-3">
            <span className="text-sm">Started:</span>
            <span className="font-medium">
              {formatDate(issue?.updatedAt as Date)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm">Ending:</span>
            <span className="font-medium">
              {formatDate(
                addDays(issue?.updatedAt as Date, Number(request?.days))
              )}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm">Remaining time:</span>
          <span className="text-lg font-bold">
            <Countdown
              endDate={addDays(issue?.updatedAt as Date, Number(request?.days))}
            />
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm">Working period:</span>
          <span className="font-medium">{request?.days} days</span>
        </div>
      </div>
      <DialogFooter className=" !flex-col !justify-start gap-3 border-t">
        <div className="w-full">
          <em className="text-sm">
            Note: If the developer fails to submit within the remaining time,
            you can take action
          </em>
        </div>
        <div className="flex gap-3">
          <Button disabled>Re-publish</Button>
          <Button disabled variant="destructive">
            Draft
          </Button>
        </div>
      </DialogFooter>
    </>
  );
};

export default Update;
