import React, { type FC } from "react";
import { type BoardProps } from "./Types";
import { Avatar, AvatarImage } from "../ui/avatar";
import Published from "./Published";
import Assigned from "./Assigned";
import Submitted from "./Submited";
import Completed from "./Completed";

const Board: FC<BoardProps> = ({ src }) => {
  return (
    <div className="mt-5 flex gap-3 ">
      <div className="flex w-[25%] flex-col rounded border bg-black px-3 py-2">
        <div className="mb-3">
          <span className=" text-x font-medium">Published</span>
          <p className="text-sm text-gray-500">Published issues list</p>
        </div>
        <Published src={src} />
      </div>
      <div className="flex w-[25%] flex-col rounded border bg-black px-3 py-2">
        <div className="mb-3">
          <span className=" text-x font-medium">In Progress</span>
          <p className=" text-sm text-gray-500">
            This is actively being worked on
          </p>
        </div>
        <Assigned src={src} />
        <Assigned src={src} />
        <Assigned src={src} />
        <Assigned src={src} />
      </div>
      <div className="flex w-[25%] flex-col rounded border bg-black px-3 py-2">
        <div className="mb-3">
          <span className=" text-xl  font-medium">In Review</span>
          <p className="text-sm text-gray-500">Published issue list</p>
        </div>
        <Submitted src={src} />
      </div>
      <div className="flex w-[25%] flex-col rounded border bg-black px-3 py-2">
        <div className="mb-3">
          <span className=" text-x font-medium">Done</span>
          <p className="text-sm text-gray-500">This has been completed</p>
        </div>
        <Completed src={src} />
      </div>
    </div>
  );
};

export default Board;
