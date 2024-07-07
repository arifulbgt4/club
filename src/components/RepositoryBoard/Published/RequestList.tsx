"use client";
import { usePathname, useRouter } from "next/navigation";
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
  setOpen,
}: {
  id: string;
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
          Make changes to your profile here. Click save when youre done.
        </SheetDescription>
      </SheetHeader>
      <div className="grid gap-4 py-4">
        {reqData?.map((r) => (
          <RequestItem key={r?.id} request={r} setOpen={setOpen} />
        ))}
      </div>
    </SheetContent>
  );
};

function RequestItem({
  request: { id, days, user, issueId },
  setOpen,
}: {
  request: RequestOptions;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  async function onAccept() {
    try {
      setLoading(true);
      const res = await fetch(`/api/v1/request/accept`, {
        method: "PUT",
        body: JSON.stringify({ id, issueId, userId: user?.id }),
      });
      router.push(`${pathname}?b=inprogress`);
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
