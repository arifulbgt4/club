"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import GitIssueList from "~/components/GitIssueList";
import DeleteCard from "./delete-card";
import Board from "~/components/Board";

export default function TabSections({
  repoId,
  repoName,
  src,
}: {
  repoId: string;
  repoName: string;
  src: string;
}) {
  return (
    <Tabs defaultValue="board">
      <TabsList>
        <TabsTrigger value="board">Board</TabsTrigger>
        <TabsTrigger value="issues">Issues</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="board">
        <Board src={src} repoId={repoId} />
      </TabsContent>
      <TabsContent value="issues">
        <GitIssueList repoId={repoId} repoName={repoName} />
      </TabsContent>

      <TabsContent value="settings">
        <DeleteCard id={repoId} />
      </TabsContent>
    </Tabs>
  );
}
