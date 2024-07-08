"use server";

import React from "react";
import Pagination from "~/components/sections/pagination";
import { Tabs, TabsContent } from "~/components/ui/tabs";
import IssueImportModal from "./IssueImportModal";
import BoardTabsTrigger from "./BoardTabsTrigger";
import { getCounts } from "./action";
import Published from "./Published";
import Inprogress from "./InProgress";

const TAB_VALUE = {
  published: "published",
  inprogress: "inprogress",
  inreview: "inreview",
  done: "done",
  draft: "draft",
};

const RepositoryBoard = async ({
  b,
  p,
  repoId,
}: {
  b: string;
  p: number;
  repoId: string;
}) => {
  const count = await getCounts(repoId);
  return (
    <Tabs defaultValue={b || TAB_VALUE.published}>
      <div className="flex items-center justify-between">
        <BoardTabsTrigger b={b} count={count} />
        <IssueImportModal repoId={repoId} />
      </div>
      <TabsContent className="m-0" value={TAB_VALUE.published}>
        <Published repoId={repoId} p={p} total={count?.published} />
      </TabsContent>
      <TabsContent className="m-0" value={TAB_VALUE.inprogress}>
        <Inprogress repoId={repoId} p={p} total={count?.inprogress} b={b} />
      </TabsContent>
      <TabsContent className="m-0" value={TAB_VALUE.inreview}>
        <div className="max-h-[calc(100vh-279px)] overflow-scroll ">
          <div className="min-h-[calc(100vh-279px)] pt-3">
            <span>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed
              libero soluta illum adipisci voluptas sunt deserunt, amet omnis
              quidem, aperiam, nemo doloremque alias id fugiat cupiditate quis.
              Tempora, voluptatem delectus.
            </span>
          </div>
        </div>
        <Pagination page={1} totalPages={1} justify="start" />
      </TabsContent>
      <TabsContent className="m-0" value={TAB_VALUE.done}>
        <div className="max-h-[calc(100vh-279px)] overflow-scroll ">
          <div className="min-h-[calc(100vh-279px)] pt-3">
            <span>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed
              libero soluta illum adipisci voluptas sunt deserunt, amet omnis
              quidem, aperiam, nemo doloremque alias id fugiat cupiditate quis.
              Tempora, voluptatem delectus.
            </span>
          </div>
        </div>
        <Pagination page={1} totalPages={1} justify="start" />
      </TabsContent>
      <TabsContent className="m-0" value={TAB_VALUE.draft}>
        <div className="max-h-[calc(100vh-279px)] overflow-scroll ">
          <div className="min-h-[calc(100vh-279px)] pt-3">
            <span>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed
              libero soluta illum adipisci voluptas sunt deserunt, amet omnis
              quidem, aperiam, nemo doloremque alias id fugiat cupiditate quis.
              Tempora, voluptatem delectus.
            </span>
          </div>
        </div>
        <Pagination page={1} totalPages={1} justify="start" />
      </TabsContent>
    </Tabs>
  );
};

export default RepositoryBoard;
