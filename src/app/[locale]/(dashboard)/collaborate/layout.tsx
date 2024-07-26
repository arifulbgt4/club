import EmptyState from "~/components/shared/empty-state";
import getCollaborate from "./action";
import CollaborateRepoListItem from "~/components/CollaborateRepoListItem";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const collaborates = await getCollaborate();

  return (
    <div className="flex flex-col flex-nowrap gap-4 lg:flex-row lg:gap-9">
      <div className="absolute -left-[300px] flex flex-col rounded-tr-md border-r lg:relative lg:left-0 lg:w-[300px]">
        <ul className="h-[calc(100vh-142px)] overflow-auto rounded-md pr-3">
          {!!collaborates?.length ? (
            collaborates?.map((r) => (
              <CollaborateRepoListItem
                key={r?.repositoryId}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                {...(r.repository as any)}
              />
            ))
          ) : (
            <EmptyState
              size="sm"
              title="Empty"
              border={false}
              description="Empty Collaborate"
            />
          )}
        </ul>
      </div>
      <div className="w-full lg:w-[calc(100%-300px)]">{children}</div>
    </div>
  );
}
