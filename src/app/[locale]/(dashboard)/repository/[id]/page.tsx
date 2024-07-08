import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { getRepositoryByID } from "../action";
import { Lock, LockOpen } from "lucide-react";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import TopTabs from "./_lib/TopTabs";
import RepositoryBoard from "~/components/RepositoryBoard";
import EmptyState from "~/components/shared/empty-state";

const ARepositoryPage = async ({
  params: { id },
  searchParams: { t, b, page },
}: {
  params: { id: string };
  searchParams: { t: string; page: string; b: string };
}) => {
  const data = await getRepositoryByID(id);
  if (!data) return <EmptyState title="Repository is not found" />;
  const { dbRepo, gitRepo } = data;
  const p = Number(page) || 1;
  return (
    <div className="flex flex-col">
      <div className="flex gap-3 pb-2">
        <div className="flex w-[calc(100%-5rem)] items-center ">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="mt-0.5 h-6 w-6 rounded border">
                  <AvatarImage
                    src={dbRepo?.provider?.picture as string}
                    alt={dbRepo?.provider?.name as string}
                  />
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>{dbRepo?.provider?.name}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="ml-2 overflow-hidden text-ellipsis whitespace-nowrap text-2xl font-bold">
                  {gitRepo.name}
                </span>
              </TooltipTrigger>
              <TooltipContent>{gitRepo.full_name}</TooltipContent>
            </Tooltip>
          </TooltipProvider>

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
      <div className=" rounded-tl-md border-t">
        <RepositoryBoard b={b} p={p} repoId={id} />
      </div>
    </div>
  );
};

export default ARepositoryPage;
