/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useRouter } from "next/navigation";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Icons from "~/components/shared/icons";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import type { RequestOptions } from "~/types";

const RequestList = ({
  id,
  intentId,
  setOpen,
}: {
  id: string;
  intentId: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [loading, setLoading] = useState(true);
  const [reqData, setReqData] = useState<RequestOptions[]>();

  const getRequest = async () => {
    const res = await fetch(`/api/v1/request/list?issueId=${id}`);
    const data = await res.json();
    setReqData(data);
    setLoading(false);
  };

  useEffect(() => {
    if (loading) {
      getRequest();
    }
  }, [loading]);

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle className="flex justify-between pr-5">
          <span>Requests</span>
          {loading && <Icons.spinner className=" animate-spin" />}
        </SheetTitle>
        <SheetDescription>
          Approve a request and assign the developer to continue working on the
          issue. If your repository is private, the developer will receive a
          collaborator invitation with <strong>Read</strong> access.
        </SheetDescription>
      </SheetHeader>
      <div className="flex max-h-[calc(100vh-145px)] flex-col gap-2 overflow-y-scroll py-4">
        {reqData?.map((r) => (
          <RequestItem
            key={r?.id}
            request={r}
            setOpen={setOpen}
            intentId={intentId}
          />
        ))}
      </div>
    </SheetContent>
  );
};

function RequestItem({
  request: { id, days, user, issueId },
  intentId,
  setOpen,
}: {
  request: RequestOptions;
  intentId: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  async function onAccept() {
    try {
      setLoading(true);
      await fetch(`/api/v1/request/accept`, {
        method: "PUT",
        body: JSON.stringify({
          requestId: id,
          issueId,
          userId: user?.id,
          intentId,
        }),
      });
      router.refresh();
      setOpen(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className=" flex items-center space-x-4 rounded-md border p-4">
      <Avatar className="">
        <AvatarImage
          src={user?.picture as string}
          title={user?.username as string}
        />
        <AvatarFallback>
          <Icons.spinner className=" animate-spin" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">@{user?.username}</p>
        <p className="text-sm text-muted-foreground">request for {days} days</p>
      </div>
      {loading ? (
        <Button size="sm" variant="secondary">
          <Icons.spinner className=" animate-spin" />
        </Button>
      ) : (
        <Button size="sm" variant="secondary" onClick={onAccept}>
          Accept
        </Button>
      )}
    </div>
  );
}

export default RequestList;
