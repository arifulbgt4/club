"use server";
import Link from "next/link";
import { Card } from "~/components/ui/card";
import { getOrganizations, getProjects } from "./action";
import CreateProjectModal from "./create-project-modal";
import SelectDemo from "./Select";
import { app } from "~/lib/octokit";

export default async function Projects() {
  const projects = await getProjects();
  const { organization, user } = await getOrganizations();
  const gst = await app.getInstallationOctokit(Number(user.installId));
  // const aa = await gst.auth()
  const repo = await gst.request("GET /installation/repositories", {
    // sort: "updated",
    // visibility: "private",
    per_page: 100,
    page: 1,
    headers: {
      // "X-GitHub-Api-Version": "2022-11-28",
      Accept: "application/vnd.github.v3+json",
      authorization: `token ${user.accessToken as string}`,
    },
  });

  console.log("repo: ", repo.data.repositories[0]);

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 ">
      <SelectDemo organization={organization} user={user} />
      <CreateProjectModal />
      {projects.map((project) => (
        <Card
          role="button"
          key={project.id}
          className="relative flex flex-col items-center justify-center gap-y-2.5 p-8 text-center hover:bg-accent"
        >
          <h4 className="font-medium ">{project.name}</h4>
          <p className=" text-muted-foreground">{`https://${project.domain}`}</p>
          <Link
            href={`/dashboard/projects/${project.id}`}
            className="absolute inset-0 "
          >
            <span className="sr-only">View project details</span>
          </Link>
        </Card>
      ))}
    </div>
  );
}
