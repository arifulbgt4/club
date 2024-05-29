"use server";
import { type Repository } from "@prisma/client";
import RepositoryItem from "~/components/RepositoryItem";
import RepoImport from "~/components/RepoImport";
import SelectDemo from "./Select";
import { getOrganizations, getRepositoryes } from "./action";
import Pagination from "~/components/sections/pagination";

export default async function RepositoryPage({
  searchParams: { org, page },
}: {
  searchParams: { org: string; page: string };
}) {
  const { organization, user } = await getOrganizations();
  const aOrg = organization.find((i) => i?.name === org);
  const { repositorys, take, total } = await getRepositoryes(
    Number(page) || 1,
    aOrg?.id
  );

  const totalPages = Math.ceil(total / take);

  return (
    <div className=" flex flex-col">
      <div className="mb-3 flex gap-6">
        <SelectDemo organization={organization} user={user} />
        <RepoImport />
      </div>
      <div>
        <div className="flex gap-2">
          {repositorys.map((repo: Repository) => (
            <RepositoryItem key={repo.id} {...repo} />
          ))}
        </div>
        {totalPages >= 2 && (
          <Pagination page={Number(page) || 1} totalPages={totalPages} />
        )}
      </div>
    </div>
  );
}
