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
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

const Published: FC<PublishedProps> = ({ src }) => {
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
              Requests:
            </span>
            <div className=" ml-2 flex items-center">
              <Avatar className=" -mr-2 h-6 w-6 border border-black">
                <AvatarImage src={src} title="arifulbgt4" />
              </Avatar>

              {/* <div className=" z-50 flex h-6 w-7 items-center justify-center rounded-full border bg-white shadow">
            <span className="text-center text-xs font-black text-red-600">
              9+
            </span>
          </div> */}
            </div>
          </div>
          <p className=" text-lg">Sign in form page</p>
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when youre done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className=" flex items-center space-x-4 rounded-md border p-4">
            <Avatar className=" h-9 w-9">
              <AvatarImage src={src} title="arifulbgt4" />
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">@arifulbgt4</p>
              <p className="text-sm text-muted-foreground">
                Request for 2 days
              </p>
            </div>
            <Button variant="secondary">Accept</Button>
          </div>
          <div className=" flex items-center space-x-4 rounded-md border p-4">
            <Avatar className="">
              <AvatarImage src={src} title="arifulbgt4" />
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                Push Notifications
              </p>
              <p className="text-sm text-muted-foreground">
                Request for 2 days
              </p>
            </div>
            <Button>Accept</Button>
          </div>
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
