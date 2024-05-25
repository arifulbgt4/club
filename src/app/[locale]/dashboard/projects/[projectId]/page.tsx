import { getRepositoryById } from "../action";
import TabSections from "./tab-sections";

export default async function SingleProject({
  params,
}: {
  params: { projectId: string };
}) {
  const { projectId } = params;
  const project = await getRepositoryById(projectId);
  return <TabSections project={project} />;
}
