"use server";
import Link from "next/link";
import { Card } from "~/components/ui/card";
import { getOrganizations, getProjects } from "./action";
import CreateProjectModal from "./create-project-modal";
import SelectDemo from "./Select";
import GithHub from "~/lib/octokit";

export default async function Projects() {
  const app = await GithHub();
  const projects = await getProjects();
  const { organization, user } = await getOrganizations();
  console.log("user: ", user);
  const repo = await app.request("GET /repos/{owner}/{repo}/issues", {
    owner: user.username as string,
    repo: "club",
    // sort: "updated",
    // visibility: "private",
    headers: {
      // "X-GitHub-Api-Version": "2022-11-28",
      authorization: `token ${user.accessToken as string}`,
    },
  });

  console.log("repo: ", repo.data);

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
