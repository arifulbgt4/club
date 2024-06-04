import { Github, Globe, Lock, LockOpen } from "lucide-react";
import { getRepositoryById } from "../action";
import TabSections from "./tab-sections";
import Link from "next/link";

export default async function SingleProject({
  params: { repoId },
}: {
  params: { repoId: string };
}) {
  const repository = await getRepositoryById(repoId);
  return (
    <div className="flex flex-col">
      <div className="mb-4 flex flex-col">
        <span className=" mb-1 flex items-center text-xl font-semibold">
          {repository?.private ? (
            <Lock className="mr-2 h-[20px] w-[20px]" />
          ) : (
            <LockOpen className="mr-2 h-[20px] w-[20px]" />
          )}
          {repository?.name}
        </span>
        <div className=" inline-flex">
          <Link
            target="_blank"
            title={repository.full_name}
            href={`https://github.com/${repository?.full_name}`}
            className=" flex h-7 w-7 items-center justify-center rounded-full  border text-sm font-light hover:underline"
          >
            <Github className=" h-4 w-4" />
          </Link>
          {repository?.homepage && (
            <Link
              target="_blank"
              title={repository?.homepage}
              href={repository?.homepage}
              className=" ml-1 flex h-7 w-7 items-center justify-center rounded-full  border text-sm font-light hover:underline"
            >
              <Globe className=" h-4 w-4" />
            </Link>
          )}
        </div>
        {repository?.description && (
          <span className=" mt-1 text-sm">{repository?.description}</span>
        )}
      </div>
      <TabSections
        src={repository?.owner?.avatar_url}
        repoName={repository?.name}
        repoId={repoId}
      />
    </div>
  );
}
