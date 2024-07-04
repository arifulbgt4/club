import React from "react";
import { getRepositoryByID } from "../action";
import { Lock, LockOpen } from "lucide-react";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import TopTabs from "./_lib/TopTabs";

const ARepositoryPage = async ({
  params: { id },
  searchParams: { t },
}: {
  params: { id: string };
  searchParams: { t: string; p: string };
}) => {
  const { dbRepo, gitRepo } = await getRepositoryByID(id);
  if (!dbRepo || !gitRepo) return null;
  return (
    <div className="flex  gap-3 border-b pb-2 pl-9">
      <div className="flex w-[calc(100%-5rem)] items-center ">
        <Avatar className="mt-0.5 h-6 w-6 rounded border">
          <AvatarImage
            src={dbRepo?.provider?.picture as string}
            alt={dbRepo?.provider?.name as string}
            title={dbRepo?.provider?.name as string}
          />
        </Avatar>
        <span className="ml-2 text-2xl font-bold">{gitRepo.name}</span>
        <span className="ml-3 flex items-center rounded-full border bg-accent px-3 text-sm text-muted-foreground">
          {gitRepo?.private ? (
            <>
              <Lock className="mr-1 h-3 w-3" />
              private
            </>
          ) : (
            <>
              <LockOpen className="mr-1 h-3 w-3" />
              public
            </>
          )}
        </span>
      </div>
      <TopTabs t={t} />
    </div>
  );
};

export default ARepositoryPage;
