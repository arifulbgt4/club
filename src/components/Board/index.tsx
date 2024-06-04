import React, { type FC } from "react";
import { type BoardProps } from "./Types";
import { Avatar, AvatarImage } from "../ui/avatar";

const Board: FC<BoardProps> = ({ src }) => {
  return (
    <div className="mt-5 flex gap-3 ">
      <div className="flex w-[25%] flex-col rounded border bg-black px-3 py-2">
        <div className="mb-3">
          <span className=" text-x font-medium">Published</span>
          <p className="text-sm text-gray-500">Published issues list</p>
        </div>
        <div className=" mb-3 flex cursor-pointer flex-col rounded border bg-zinc-900 px-2.5 py-1.5">
          <div className="mb-2 flex items-center">
            <span className=" text-xs font-bold text-muted-foreground">
              Requests:
            </span>
            <div className=" ml-2 flex items-center">
              <Avatar className=" -mr-2 h-6 w-6 border border-black">
                <AvatarImage src={src} title="arifulbgt4" />
              </Avatar>
              <Avatar className="-mr-2 h-6 w-6 border border-black">
                <AvatarImage src={src} title="arifulbgt4" />
              </Avatar>
              <Avatar className="-mr-2 h-6 w-6 border border-black">
                <AvatarImage src={src} title="arifulbgt4" />
              </Avatar>
              <Avatar className="-mr-2 h-6 w-6 border border-black">
                <AvatarImage src={src} title="arifulbgt4" />
              </Avatar>
              <Avatar className="-mr-2 h-6 w-6 border border-black">
                <AvatarImage src={src} title="arifulbgt4" />
              </Avatar>
              <Avatar className="-mr-2 h-6 w-6 border border-black">
                <AvatarImage src={src} title="arifulbgt4" />
              </Avatar>
              <Avatar className="-mr-2 h-6 w-6 border border-black">
                <AvatarImage src={src} title="arifulbgt4" />
              </Avatar>
              <Avatar className="-mr-2 h-6 w-6 border border-black">
                <AvatarImage src={src} title="arifulbgt4" />
              </Avatar>
              <div className=" z-50 flex h-6 w-7 items-center justify-center rounded-full border bg-white shadow">
                <span className="text-center text-xs font-black text-red-600">
                  9+
                </span>
              </div>
            </div>
          </div>
          <p className=" text-lg">Sign in form page</p>
        </div>
      </div>
      <div className="flex w-[25%] flex-col rounded border bg-black px-3 py-2">
        <div className="mb-3">
          <span className=" text-x font-medium">In Progress</span>
          <p className=" text-sm text-gray-500">
            This is actively being worked on
          </p>
        </div>
        <div className=" mb-3 flex cursor-pointer flex-col rounded border bg-zinc-900 px-2.5 py-1.5">
          <div className="mb-2 flex items-center">
            <span className=" text-xs font-bold text-muted-foreground">
              Assigned:
            </span>
            <div className=" ml-2 flex items-center">
              <Avatar className=" -mr-2 h-6 w-6 border border-black">
                <AvatarImage src={src} title="arifulbgt4" />
              </Avatar>
              <Avatar className="-mr-2 h-6 w-6 border border-black">
                <AvatarImage src={src} title="arifulbgt4" />
              </Avatar>
              <Avatar className="-mr-2 h-6 w-6 border border-black">
                <AvatarImage src={src} title="arifulbgt4" />
              </Avatar>
              <Avatar className="-mr-2 h-6 w-6 border border-black">
                <AvatarImage src={src} title="arifulbgt4" />
              </Avatar>
              <Avatar className="-mr-2 h-6 w-6 border border-black">
                <AvatarImage src={src} title="arifulbgt4" />
              </Avatar>
              <Avatar className="-mr-2 h-6 w-6 border border-black">
                <AvatarImage src={src} title="arifulbgt4" />
              </Avatar>
              <Avatar className="-mr-2 h-6 w-6 border border-black">
                <AvatarImage src={src} title="arifulbgt4" />
              </Avatar>
              <Avatar className="-mr-2 h-6 w-6 border border-black">
                <AvatarImage src={src} title="arifulbgt4" />
              </Avatar>

              <div className=" z-50 flex h-6 w-7 items-center justify-center rounded-full border bg-white shadow">
                <span className="text-center text-xs font-black text-red-600">
                  9+
                </span>
              </div>
            </div>
          </div>
          <p className=" text-lg">Sign in form page</p>
        </div>
        <div className=" mb-3 flex cursor-pointer flex-col rounded border bg-zinc-900 px-2.5 py-1.5">
          <div className="mb-2 flex items-center">
            <span className=" text-xs font-bold text-muted-foreground">
              Assigned:
            </span>
            <div className=" ml-2 flex items-center">
              <Avatar className=" -mr-2 h-6 w-6 border border-black">
                <AvatarImage src={src} title="arifulbgt4" />
              </Avatar>
            </div>
          </div>
          <p className=" text-lg">
            Sign in form page Sign in form page Sign in form page Sign in form
            page Sign in form pageSign in form page Sign in form page
          </p>
        </div>
      </div>
      <div className="flex w-[25%] flex-col rounded border bg-black px-3 py-2">
        <div className="mb-3">
          <span className=" text-xl  font-medium">In Review</span>
          <p className="text-sm text-gray-500">Published issue list</p>
        </div>
      </div>
      <div className="flex w-[25%] flex-col rounded border bg-black px-3 py-2">
        <div className="mb-3">
          <span className=" text-x font-medium">Done</span>
          <p className="text-sm text-gray-500">This has been completed</p>
        </div>
      </div>
    </div>
  );
};

export default Board;
