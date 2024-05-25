"use server";
import Link from "next/link";
import { Card } from "~/components/ui/card";
import { getOrganizations, getProjects } from "./action";
import CreateProjectModal from "./create-project-modal";
import SelectDemo from "./Select";
import { RepoImport } from "~/components/sections/RepoImport";

export default async function Projects() {
  const projects = await getProjects();
  const { organization, user } = await getOrganizations();

  // const userRepos = await getUserRepos();
  // console.log("userrepos: ", userRepos);

  return (
    <div className=" flex flex-col">
      <div className="mb-3 flex gap-6">
        <SelectDemo organization={organization} user={user} />
        <RepoImport />
      </div>
      {/* <CreateProjectModal /> */}
      <div className="flex gap-2">
        {projects.map((project) => (
          <Card
            role="button"
            key={project.id}
            className="relative flex flex-col items-center justify-center gap-y-2.5 p-8 text-center hover:bg-accent"
          >
            <h4 className="font-medium ">{project.name}</h4>
            <p className=" text-muted-foreground">{project.fullName}</p>
            <Link
              href={`/dashboard/projects/${project.id}`}
              className="absolute inset-0 "
            >
              <span className="sr-only">View project details</span>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
