import Link from "next/link";
import React from "react";
import AddRepository from "~/components/AddRepository";
import { getProviders, getRepository } from "./action";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Github } from "lucide-react";

const RepositoryLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const providers = await getProviders();
  const repos = await getRepository();
  return (
    <div className=" flex flex-col gap-2">
      <div className="flex items-center justify-between border-b pb-3">
        <h1 className=" text-2xl">
          Manage your project with global developers
        </h1>
        <AddRepository providers={providers} />
      </div>
      <div className="flex flex-nowrap gap-6">
        <div className="flex w-[300px] flex-col ">
          <span className=" mb-3 px-2 text-sm font-semibold text-muted-foreground">
            Repository
            <span className="ml-2">({repos?.length})</span>
          </span>
          <ul className="h-[calc(100vh-270px)] overflow-auto rounded-md border">
            {repos?.map((r) => (
              <li key={r.id} className="border-b hover:bg-accent">
                <Link
                  href={`/repository/${r?.id}`}
                  className="flex flex-nowrap p-3"
                >
                  <div className=" mt-1 flex h-6 w-6 items-center justify-center text-muted-foreground">
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
            ))}
          </ul>
        </div>
        <div className="w-[calc(100% - 300px)]">{children}</div>
      </div>
    </div>
  );
};

export default RepositoryLayout;
