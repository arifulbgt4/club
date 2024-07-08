"use server";
import React from "react";
import { Tabs, TabsContent } from "~/components/ui/tabs";
import IssueImportModal from "./IssueImportModal";
import BoardTabsTrigger from "./BoardTabsTrigger";
import { getCounts } from "./action";
import Published from "./Published";
import InProgress from "./InProgress";
import InReview from "./InReview";
import Done from "./Done";
import Draft from "./Draft";

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
        <InProgress repoId={repoId} p={p} total={count?.inprogress} b={b} />
      </TabsContent>
      <TabsContent className="m-0" value={TAB_VALUE.inreview}>
        <InReview repoId={repoId} p={p} total={count?.inreview} b={b} />
      </TabsContent>
      <TabsContent className="m-0" value={TAB_VALUE.done}>
        <Done repoId={repoId} p={p} total={count?.done} b={b} />
      </TabsContent>
      <TabsContent className="m-0" value={TAB_VALUE.draft}>
        <Draft repoId={repoId} p={p} total={count?.draft} b={b} />
      </TabsContent>
    </Tabs>
  );
};

export default RepositoryBoard;
