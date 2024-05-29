"use server";
import { type Repository } from "@prisma/client";
import RepositoryItem from "~/components/RepositoryItem";
import RepoImport from "~/components/RepoImport";
import SelectDemo from "./Select";
import { getOrganizations, getRepositoryes } from "./action";

export default async function RepositoryPage({
  searchParams: { org },
}: {
  searchParams: { org: string };
}) {
  const { organization, user } = await getOrganizations();
  const aOrg = organization.find((i) => i?.name === org);
  const repositorys = await getRepositoryes(aOrg?.id);

  // const userRepos = await getUserRepos();
  // console.log("userrepos: ", userRepos);

  return (
    <div className=" flex flex-col">
      <div className="mb-3 flex gap-6">
        <SelectDemo organization={organization} user={user} />
        <RepoImport />
      </div>
      <div className="flex gap-2">
        {repositorys.map((repo: Repository) => (
          <RepositoryItem key={repo.id} {...repo} />
        ))}
      </div>
    </div>
  );
}
