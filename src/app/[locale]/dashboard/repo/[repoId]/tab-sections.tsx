"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import DeleteCard from "./delete-card";
import { publisheAnIssue } from "../action";
import { useRouter } from "next/navigation";
import GitIssueItem from "~/components/GitIssueItem";

export default function TabSections({
  repositoryId,
  issues,
}: {
  repositoryId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  issues: any[];
}) {
  const router = useRouter();

  return (
    <Tabs defaultValue="issues">
      <TabsList>
        <TabsTrigger value="issues">Issues</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="issues">
        {issues.map((issue) => (
          <GitIssueItem
            key={issue?.id}
            {...issue}
            id={issue?.id}
            repoId={repositoryId}
          />
        ))}
        {/* <Button
              size="sm"
              variant="outline"
              onClick={() =>
                publishedIssue({
                  title: item.title,
                  issueNumber: item.number,
                  body: item?.body,
                  repoId: repositoryId,
                  state: item?.state,
                  id: item.id,
                })
              }
            >
              Publish
            </Button> */}
      </TabsContent>
      <TabsContent value="settings">
        <DeleteCard id={repositoryId} />
      </TabsContent>
    </Tabs>
  );
}
