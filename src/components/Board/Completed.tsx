import { type FC } from "react";
import { type CompletedProps } from "./Types";
import { Avatar, AvatarImage } from "../ui/avatar";

const Completed: FC<CompletedProps> = ({ src }) => {
  return (
    <div className=" mb-3 flex cursor-pointer flex-col rounded border bg-zinc-900 px-2.5 py-1.5">
      <div className="mb-2 flex items-center">
        <span className=" text-xs font-bold text-muted-foreground">
          Completed by:
        </span>
        <div className=" ml-2 flex items-center">
          <Avatar className=" -mr-2 h-6 w-6 border border-black">
            <AvatarImage src={src} title="arifulbgt4" />
          </Avatar>
        </div>
      </div>
      <p className=" text-lg">Sign in form page</p>
    </div>
  );
};

export default Completed;
