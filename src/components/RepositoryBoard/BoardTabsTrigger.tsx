"use client";
import React from "react";
import { TabsList, TabsTrigger } from "../ui/tabs";
import { usePathname, useRouter } from "next/navigation";
import {
  CircleCheckBig,
  CircleDashed,
  CircleDot,
  CircleDotDashed,
  RefreshCcwDot,
} from "lucide-react";

const TAB_VALUE = {
  published: "published",
  inprogress: "inprogress",
  inreview: "inreview",
  done: "done",
  draft: "draft",
};

const BoardTabsTrigger = ({
  b,
  count: { reassigned, done, inreview, draft, published, inprogress },
}: {
  b: string;
  count: {
    reassigned: number;
    done: number;
    inreview: number;
    draft: number;
    published: number;
    inprogress: number;
  };
}) => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <TabsList className=" h-auto">
      <TabsTrigger
        value={TAB_VALUE.published}
        className="px-2.5 text-base"
        onClick={() => {
          if (b !== undefined || b !== TAB_VALUE.published) {
            router.push(pathname);
          }
        }}
      >
        <CircleDot className="mr-1.5 h-5 w-5 text-sky-500" /> Published (
        {published})
      </TabsTrigger>
      <TabsTrigger
        value={TAB_VALUE.inprogress}
        className="px-2.5 text-base"
        onClick={() => {
          if (b !== TAB_VALUE.inprogress) {
            router.push(pathname + "?b=" + TAB_VALUE.inprogress);
          }
        }}
      >
        <CircleDotDashed className="mr-1.5 h-5 w-5 text-purple-500" /> In
        Progress ({inprogress + reassigned})
      </TabsTrigger>
      <TabsTrigger
        value={TAB_VALUE.inreview}
        className="px-2.5 text-base"
        onClick={() => {
          if (b !== TAB_VALUE.inreview) {
            router.push(pathname + "?b=" + TAB_VALUE.inreview);
          }
        }}
      >
        <RefreshCcwDot className="mr-1.5 h-5 w-5 text-yellow-500" /> In Review (
        {inreview})
      </TabsTrigger>
      <TabsTrigger
        value={TAB_VALUE.done}
        className="px-2.5 text-base"
        onClick={() => {
          if (b !== TAB_VALUE.done) {
            router.push(pathname + "?b=" + TAB_VALUE.done);
          }
        }}
      >
        <CircleCheckBig className="mr-1.5 h-5 w-5 text-green-500" /> Done (
        {done})
      </TabsTrigger>
      <TabsTrigger
        value={TAB_VALUE.draft}
        className="px-2.5 text-base"
        onClick={() => {
          if (b !== TAB_VALUE.draft) {
            router.push(pathname + "?b=" + TAB_VALUE.draft);
          }
        }}
      >
        <CircleDashed className="mr-1.5 h-5 w-5" /> Draft ({draft})
      </TabsTrigger>
    </TabsList>
  );
};

export default BoardTabsTrigger;
