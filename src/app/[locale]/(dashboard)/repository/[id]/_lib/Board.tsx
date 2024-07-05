import {
  CircleCheckBig,
  CircleDashed,
  CircleDot,
  PlusCircle,
  RefreshCcwDot,
} from "lucide-react";
import React from "react";
import Pagination from "~/components/sections/pagination";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

const Board = () => {
  return (
    <Tabs defaultValue="published">
      <div className="flex items-center justify-between">
        <TabsList className=" h-auto">
          <TabsTrigger value="published" className=" text-base">
            <CircleDot className="mr-1.5 h-5 w-5 text-sky-500" /> Published
          </TabsTrigger>
          <TabsTrigger value="inprogress" className=" text-base">
            <CircleDashed className="mr-1.5 h-5 w-5 text-purple-500" /> In
            Progress
          </TabsTrigger>

          <TabsTrigger value="inreview" className=" text-base">
            <RefreshCcwDot className="mr-1.5 h-5 w-5 text-yellow-500" /> In
            Review
          </TabsTrigger>
          <TabsTrigger value="done" className=" text-base">
            <CircleCheckBig className="mr-1.5 h-5 w-5 text-green-500" /> Done
          </TabsTrigger>
        </TabsList>
        <Button size="lg" variant="ghost" className=" text-lg text-green-500">
          <PlusCircle className="mr-2 h-5 w-5" />
          Publish an issue
        </Button>
      </div>
      <TabsContent className="m-0" value="published">
        <div className=" min-h-[calc(100vh-309px)]">
          <span>Published</span>
        </div>
        <Pagination page={1} totalPages={12} justify="start" />
      </TabsContent>
      <TabsContent className="m-0" value="inprogress">
        <div className=" min-h-[calc(100vh-309px)]">
          <span>inprogress</span>
        </div>
        <Pagination page={1} totalPages={1} justify="start" />
      </TabsContent>
      <TabsContent className="m-0" value="inreview">
        <div className=" min-h-[calc(100vh-309px)]">
          <span>inreview</span>
        </div>
        <Pagination page={1} totalPages={1} justify="start" />
      </TabsContent>
      <TabsContent className="m-0" value="done">
        <div className=" min-h-[calc(100vh-309px)]">
          <span>done</span>
        </div>
        <Pagination page={1} totalPages={1} justify="start" />
      </TabsContent>
    </Tabs>
  );
};

export default Board;
