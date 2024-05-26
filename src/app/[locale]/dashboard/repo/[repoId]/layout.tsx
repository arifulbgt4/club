import GoBack from "~/components/go-back";
import { getRepositoryById } from "../action";

export default async function SingleProjectLayout({
  children,
  params: { projectId },
}: {
  children: React.ReactNode;
  params: { projectId: string };
}) {
  const project = await getRepositoryById(projectId);

  return (
    <>
      <div className="mb-5 flex items-center">
        <GoBack />
        <span className=" ml-3 text-2xl">{project.name}</span>
      </div>
      {children}
    </>
  );
}
