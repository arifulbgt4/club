import { type FC } from "react";
import { type SubmittedProps } from "./Types";
import { Avatar, AvatarImage } from "../ui/avatar";
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
import { Button } from "../ui/button";

const Submitted: FC<SubmittedProps> = ({ assigned, title }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className=" mb-3 flex cursor-pointer flex-col rounded border bg-zinc-900 px-2.5 py-1.5">
          <div className="mb-2 flex items-center">
            <span className=" text-xs font-bold text-muted-foreground">
              Submitted by:
            </span>
            <div className=" ml-2 flex items-center">
              <Avatar className=" -mr-2 h-6 w-6 border border-black">
                <AvatarImage
                  src={assigned?.picture}
                  title={assigned?.username}
                />
              </Avatar>
            </div>
          </div>
          <p className=" text-lg">{title}</p>
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>
            Please review your pull request. If you decide to merge it, the task
            will be completed. If you request changes, the issue will be
            reassigned and marked as {"in progress."}
          </SheetDescription>
        </SheetHeader>

        {/* <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter> */}
      </SheetContent>
    </Sheet>
  );
};

export default Submitted;
