"use server";
import RepositoryList from "~/components/RepositoryList";
import RepoImport from "~/components/RepoImport";
import SelectDemo from "./Select";
import { getOrganizations } from "./action";

export default async function RepositoryPage({
  searchParams: { org, page },
}: {
  searchParams: { org: string; page: string };
}) {
  const { organization, user } = await getOrganizations();
  const aOrg = organization.find((i) => i?.name === org);

  return (
    <div className=" flex flex-col">
      <div className="mb-3 flex gap-6">
        <SelectDemo organization={organization} user={user} />
        <RepoImport />
      </div>
      <RepositoryList page={Number(page) || 1} orgId={aOrg?.id} />
    </div>
  );
}
