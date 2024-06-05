import { type FC } from "react";
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
import { type PublishedProps } from "./Types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import Icons from "../shared/icons";

const Published: FC<PublishedProps> = ({ id, title, request }) => {
  return (
    <Sheet
      onOpenChange={(open) => {
        console.log("open: ", open);
      }}
    >
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
        <div className="grid gap-4 py-4">
          {request?.length < 8 &&
            request?.map((r) => (
              <div
                key={r?.id}
                className=" flex items-center space-x-4 rounded-md border p-4"
              >
                <Avatar className="">
                  <AvatarImage
                    src={r?.user?.picture}
                    title={r?.user?.username}
                  />
                  <AvatarFallback>
                    <Icons.spinner className=" animate-spin" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    @{r?.user?.username}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    request for {r?.days} days
                  </p>
                </div>
                <Button size="sm" variant="secondary">
                  Accept
                </Button>
              </div>
            ))}
        </div>
        {/* <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter> */}
      </SheetContent>
    </Sheet>
  );
};

export default Published;
