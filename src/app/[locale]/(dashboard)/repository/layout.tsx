import React from "react";
import AddRepository from "~/components/AddRepository";
import { getProviders, getRepository } from "./action";
import EmptyState from "~/components/shared/empty-state";
import RepoListItem from "~/components/RepoListItem";

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
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              repos?.map((r) => <RepoListItem key={r?.id} {...(r as any)} />)
            ) : (
              <EmptyState
                size="sm"
                title="Empty"
                border={false}
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
