import { type FC, useCallback, useEffect, useMemo, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { type RequestsProps, type PublishedProps } from "./Types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import Icons from "../shared/icons";

const Published: FC<PublishedProps> = ({ id, title, request }) => {
  const [open, setOpen] = useState(false);
  const [reqData, setReqData] = useState();

  const getData = useMemo(() => {
    return reqData || request;
  }, [reqData, request]);

  const getRequests = useCallback(async () => {
    try {
      if (open && request?.length === 8) {
        const res = await fetch(`/api/v1/request/list?issueId=${id}`);
        const data = await res.json();
        setReqData(data);
      }
    } catch (error) {
      console.log(error);
    }
  }, [open, request, setReqData, id]);

  useEffect(() => {
    getRequests();
  }, [getRequests]);

  return (
    <Sheet onOpenChange={(open) => setOpen(open)}>
      <SheetTrigger asChild>
        <div className=" mb-3 flex cursor-pointer flex-col rounded border bg-zinc-900 px-2.5 py-1.5">
          <div className="mb-2 flex items-center">
            <span className=" text-xs font-bold text-muted-foreground">
              Requests: {request?.length === 0 && " No request yet"}
            </span>
            <div className=" ml-2 flex items-center">
              {request?.map((u) => (
                <Avatar
                  key={u?.id}
                  className=" -mr-2 h-6 w-6 border border-black"
                >
                  <AvatarImage
                    src={u?.user?.picture}
                    title={u?.user?.username}
                  />
                  <AvatarFallback>
                    <Icons.spinner className=" animate-spin" />
                  </AvatarFallback>
                </Avatar>
              ))}
              {request?.length === 8 && (
                <div className=" z-50 flex h-6 w-7 items-center justify-center rounded-full border bg-white shadow">
                  <span className="text-center text-xs font-black text-red-600">
                    9+
                  </span>
                </div>
              )}
            </div>
          </div>
          <p className=" text-lg">{title}</p>
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when youre done.
          </SheetDescription>
        </SheetHeader>
        {open && (
          <div className="grid gap-4 py-4">
            {getData?.map((r) => <Request key={r?.id} {...r} issueId={id} />)}
          </div>
        )}

        {/* <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter> */}
      </SheetContent>
    </Sheet>
  );
};

function Request({ id, days, user, issueId }: RequestsProps) {
  const [loading, setLoading] = useState(false);
  async function onAccept() {
    try {
      setLoading(true);
      const res = await fetch(`/api/v1/request/accept`, {
        method: "PUT",
        body: JSON.stringify({ id, issueId, userId: user?.id }),
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className=" flex items-center space-x-4 rounded-md border p-4">
      <Avatar className="">
        <AvatarImage src={user?.picture} title={user?.username} />
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

export default Published;
