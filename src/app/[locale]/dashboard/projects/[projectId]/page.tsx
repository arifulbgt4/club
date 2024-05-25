import { getRepoIssues, getRepositoryById } from "../action";
import TabSections from "./tab-sections";

export default async function SingleProject({
  params,
}: {
  params: { projectId: string };
}) {
  const { projectId } = params;
  const project = await getRepositoryById(projectId);
  const issues = await getRepoIssues(project.name);
  return (
    <div>
      <TabSections project={project} issues={issues} />
    </div>
  );
}
