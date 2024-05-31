"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import GitIssueList from "~/components/GitIssueList";
import DeleteCard from "./delete-card";

export default function TabSections({
  repoId,
  repoName,
}: {
  repoId: string;
  repoName: string;
}) {
  return (
    <Tabs defaultValue="issues">
      <TabsList>
        <TabsTrigger value="issues">Issues</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="issues">
        <GitIssueList repoId={repoId} repoName={repoName} />
      </TabsContent>
      <TabsContent value="settings">
        <DeleteCard id={repoId} />
      </TabsContent>
    </Tabs>
  );
}
