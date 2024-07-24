import AddRepository from "~/components/AddRepository";
import EmptyState from "~/components/shared/empty-state";
import RepoListItem from "~/components/RepoListItem";
import { Button } from "~/components/ui/button";
import { getProviders, getRepository } from "./action";

export default async function RepositoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const providers = await getProviders();
  const repos = await getRepository();

  return (
    <div className=" flex flex-col gap-2">
      <div className="flex flex-col flex-nowrap gap-4 lg:flex-row lg:gap-9">
        <div className=" lg:hidden">
          <Button>Reopsitory</Button>
        </div>
        <div className="absolute -left-[300px] flex flex-col rounded-tr-md border-r lg:relative lg:left-0 lg:w-[300px]">
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
        <div className="w-full lg:w-[calc(100%-300px)]">{children}</div>
      </div>
    </div>
  );
}
