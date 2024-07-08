import Link from "next/link";
import React from "react";
import AddRepository from "~/components/AddRepository";
import { getProviders, getRepository } from "./action";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Github } from "lucide-react";
import EmptyState from "~/components/shared/empty-state";

const RepositoryLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const providers = await getProviders();
  const repos = await getRepository();
  return (
    <div className=" flex flex-col gap-2">
      <div className="flex flex-nowrap gap-9">
        <div className="flex w-[300px] flex-col rounded-tr-md border-r">
          <AddRepository providers={providers} />
          {/* // TODO: should add a filter by provider  */}
          <span className="mt-1 p-2 text-sm font-medium text-muted-foreground">
            All Repository
          </span>
          <ul className="h-[calc(100vh-222px)] overflow-auto rounded-md pr-3">
            {!!repos?.length ? (
              repos?.map((r) => (
                <li key={r.id} className=" hover:rounded-md hover:bg-accent">
                  <Link
                    href={`/repository/${r?.id}`}
                    className="flex flex-nowrap px-2 py-1"
                  >
                    <div className=" mt-0.5 flex h-6 w-6 items-center justify-center text-muted-foreground">
                      <Github className="h-4 w-4" />
                    </div>
                    <div className="ml-1 flex flex-col">
                      <span className="mb-1 font-semibold">{r.name}</span>
                      <div className="flex items-center">
                        <Avatar className="h-4 w-4 rounded border">
                          <AvatarImage
                            src={r?.provider?.picture as string}
                            alt={r?.provider?.name as string}
                          />
                        </Avatar>
                        <span className="ml-1 text-sm text-muted-foreground">
                          {r?.provider?.name}
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))
            ) : (
              <EmptyState
                size="sm"
                title="Empty"
                description="No repository imported yet"
              />
            )}
          </ul>
        </div>
        <div className="w-[calc(100%-300px)]">{children}</div>
      </div>
    </div>
  );
};

export default RepositoryLayout;
