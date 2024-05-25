"use client";
import { type Project, type Repository } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import DeleteCard from "./delete-card";
import EditableDetails from "./editable-details";
import { Button } from "~/components/ui/button";
import { createIssue } from "../action";

export default function TabSections({
  project,
  issues,
}: {
  project: Repository;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  issues: any[];
}) {
  const publishedIssue = async (data: {
    title: string;
    body?: string;
    repoId?: string;
    issueNumber: number;
  }) => {
    const publ = await createIssue(data);
  };
  console.log(issues);
  return (
    <Tabs defaultValue="details">
      <TabsList>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="details">
        <h3>{project.name}</h3>
        {/* <EditableDetails initialValues={project} /> */}
        {issues.map((item) => (
          <div
            key={item?.id}
            className="mb-2 flex flex-col items-start rounded-lg border p-3 text-left text-sm transition-all "
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{item?.title}</div>
                  {/* {!item.read && (
                    <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                  )} */}
                </div>
                <div className="ml-auto text-xs text-muted-foreground">
                  about 1 year ago
                </div>
              </div>
              <div className="text-xs font-medium">weekend olans</div>
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
              {/* {item.text.substring(0, 300)} */}
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Porro
              nihil commodi molestias sequi fugiat minus sunt, voluptates natus
              magnam. Adipisci id officia nulla esse dolore veritatis doloribus
              ut? Fuga, placeat.
            </div>
            {/* {item.labels.length ? (
              <div className="flex items-center gap-2">
                {item.labels.map((label) => (
                  <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
                    {label}
                  </Badge>
                ))}
              </div>
               ) : null} */}
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                publishedIssue({
                  title: item.title,
                  issueNumber: item.number,
                  body: item?.body,
                  repoId: project?.id,
                })
              }
            >
              Publish
            </Button>
          </div>
        ))}
      </TabsContent>
      <TabsContent value="settings">
        <DeleteCard id={project.id} />
      </TabsContent>
    </Tabs>
  );
}
