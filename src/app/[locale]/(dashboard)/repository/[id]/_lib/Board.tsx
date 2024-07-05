"use client";
import {
  CircleCheckBig,
  CircleDashed,
  CircleDot,
  CircleDotDashed,
  PlusCircle,
  RefreshCcwDot,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import Pagination from "~/components/sections/pagination";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

const TAB_VALUE = {
  published: "published",
  inprogress: "inprogress",
  inreview: "inreview",
  done: "done",
  draft: "draft",
};

const Board = ({ b }: { b: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <Tabs defaultValue={b || TAB_VALUE.published}>
      <div className="flex items-center justify-between">
        <TabsList className=" h-auto">
          <TabsTrigger
            value={TAB_VALUE.published}
            className="px-2.5 text-base"
            onClick={() => {
              if (b !== undefined || b !== TAB_VALUE.published) {
                router.push(pathname + "?b=" + TAB_VALUE.published);
              }
            }}
          >
            <CircleDot className="mr-1.5 h-5 w-5 text-sky-500" /> Published (0)
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
            Progress (0)
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
            <RefreshCcwDot className="mr-1.5 h-5 w-5 text-yellow-500" /> In
            Review (0)
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
            <CircleCheckBig className="mr-1.5 h-5 w-5 text-green-500" /> Done
            (0)
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
            <CircleDashed className="mr-1.5 h-5 w-5" /> Draft (0)
          </TabsTrigger>
        </TabsList>
        <Button size="lg" variant="ghost" className=" text-lg text-green-500">
          <PlusCircle className="mr-2 h-5 w-5" />
          Publish an issue
        </Button>
      </div>
      <TabsContent className="m-0" value={TAB_VALUE.published}>
        <div className=" min-h-[calc(100vh-309px)]">
          <span>Published</span>
        </div>
        <Pagination page={1} totalPages={12} justify="start" />
      </TabsContent>
      <TabsContent className="m-0" value={TAB_VALUE.inprogress}>
        <div className=" min-h-[calc(100vh-309px)]">
          <span>inprogress</span>
        </div>
        <Pagination page={1} totalPages={1} justify="start" />
      </TabsContent>
      <TabsContent className="m-0" value={TAB_VALUE.inreview}>
        <div className=" min-h-[calc(100vh-309px)]">
          <span>inreview</span>
        </div>
        <Pagination page={1} totalPages={1} justify="start" />
      </TabsContent>
      <TabsContent className="m-0" value={TAB_VALUE.done}>
        <div className=" min-h-[calc(100vh-309px)]">
          <span>done</span>
        </div>
        <Pagination page={1} totalPages={1} justify="start" />
      </TabsContent>
      <TabsContent className="m-0" value={TAB_VALUE.draft}>
        <div className=" min-h-[calc(100vh-309px)]">
          <span>Draft</span>
        </div>
        <Pagination page={1} totalPages={1} justify="start" />
      </TabsContent>
    </Tabs>
  );
};

export default Board;
