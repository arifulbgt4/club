import { type FC } from "react";
import { type AssignedProps } from "./Types";
import { Avatar, AvatarImage } from "../ui/avatar";

const Assigned: FC<AssignedProps> = ({ title, assigned }) => {
  return (
    <div className=" mb-3 flex cursor-pointer flex-col rounded border bg-zinc-900 px-2.5 py-1.5">
      <div className="mb-2 flex items-center">
        <span className=" text-xs font-bold text-muted-foreground">
          Assigned:
        </span>
        <div className=" ml-2 flex items-center">
          <Avatar className=" -mr-2 h-6 w-6 border border-black">
            <AvatarImage src={assigned?.picture} title={assigned?.username} />
          </Avatar>
        </div>
      </div>
      <p className=" text-lg">{title}</p>
    </div>
  );
};

export default Assigned;
