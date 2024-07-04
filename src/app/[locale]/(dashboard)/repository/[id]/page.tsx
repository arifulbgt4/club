import React from "react";
import { getRepositoryByID } from "../action";
import { Github, Lock, LockOpen } from "lucide-react";
import { Avatar, AvatarImage } from "~/components/ui/avatar";

const ARepositoryPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const { dbRepo, gitRepo } = await getRepositoryByID(id);
  if (!dbRepo || !gitRepo) return null;
  return (
    <div className="flex flex-col">
      <div className="flex items-center border-b pb-2 pl-9">
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
    </div>
  );
};

export default ARepositoryPage;
