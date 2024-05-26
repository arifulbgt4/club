import { getRepoIssues, getRepositoryById } from "../action";
import TabSections from "./tab-sections";

export default async function SingleProject({
  params: { repoId },
}: {
  params: { repoId: string };
}) {
  const project = await getRepositoryById(repoId);
  const issues = await getRepoIssues(project.name);
  return (
    <div>
      <TabSections project={project} issues={issues} />
    </div>
  );
}
