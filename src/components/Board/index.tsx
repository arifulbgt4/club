/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState, type FC } from "react";
import { type BoardProps } from "./Types";
import Published from "./Published";
import Assigned from "./Assigned";
import Submitted from "./Submited";
import Completed from "./Completed";
import { IssueState } from "@prisma/client";

const Board: FC<BoardProps> = ({ src, repoId }) => {
  const [published, setPublished] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [inReview, setInReview] = useState([]);
  const getIssueList = useCallback(async () => {
    const res = await fetch(`/api/v1/issue/publishedList?repoId=${repoId}`);
    const data = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any

    const pub = data?.filter((i: any) => i?.state === IssueState.published);
    const inpro = data?.filter((i: any) => i?.state === IssueState.inprogress);
    const inrev = data?.filter((i: any) => i?.state === IssueState.inreview);
    setPublished(pub);
    setInProgress(inpro);
    setInReview(inrev);
  }, [repoId]);

  useEffect(() => {
    getIssueList();
  }, []);
  return (
    <div className="mt-5 flex gap-3 ">
      <div className="flex w-[25%] flex-col rounded border bg-black px-3 py-2">
        <div className="mb-3">
          <span className=" text-x font-medium">Published</span>
          <p className="text-sm text-gray-500">Published issues list</p>
        </div>
        {published?.map((p: any) => (
          <Published
            key={p?.id}
            id={p?.id}
            title={p?.title}
            request={p?.request}
          />
        ))}
      </div>
      <div className="flex w-[25%] flex-col rounded border bg-black px-3 py-2">
        <div className="mb-3">
          <span className=" text-x font-medium">In Progress</span>
          <p className=" text-sm text-gray-500">
            This is actively being worked on
          </p>
        </div>
        {inProgress?.map((p: any) => <Assigned key={p?.id} {...p} src={src} />)}
      </div>
      <div className="flex w-[25%] flex-col rounded border bg-black px-3 py-2">
        <div className="mb-3">
          <span className=" text-xl  font-medium">In Review</span>
          <p className="text-sm text-gray-500">Published issue list</p>
        </div>
        {inReview?.map((p: any) => <Submitted key={p?.id} {...p} src={src} />)}
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
