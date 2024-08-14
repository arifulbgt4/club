import EmptyState from "~/components/shared/empty-state";
import { getIssues } from "./action";
import Item from "./Item";
import type { CollaborateFailedProps } from "./Types";

export default async function CollaborateFailed({
  id,
}: CollaborateFailedProps) {
  const data = await getIssues(id);

  if (!data || !data?.length) {
    return <EmptyState title="Empty" border={false} />;
  }
  return (
    <div className=" max-h-[calc(100vh-167px)] overflow-scroll">
      <div className="min-h-[calc(100vh-167px)] py-4">
        {data?.map((o, i) => (
          <Item key={i + o?.id} issue={o} intent={o?.intent[0]} />
        ))}
      </div>
    </div>
  );
}
