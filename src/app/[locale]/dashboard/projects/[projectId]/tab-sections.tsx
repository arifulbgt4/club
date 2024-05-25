import { type Project, type Repository } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import DeleteCard from "./delete-card";
import EditableDetails from "./editable-details";

export default function TabSections({ project }: { project: Repository }) {
  return (
    <Tabs defaultValue="details">
      <TabsList>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="details">
        <h3>{project.name}</h3>
        {/* <EditableDetails initialValues={project} /> */}
      </TabsContent>
      <TabsContent value="settings">
        <DeleteCard id={project.id} />
      </TabsContent>
    </Tabs>
  );
}
