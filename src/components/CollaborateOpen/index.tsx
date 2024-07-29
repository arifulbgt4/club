import EmptyState from "../shared/empty-state";
import { getIssues } from "./action";
import Item from "./Item";
import type { CollaborateOpenProps } from "./Types";

export default async function CollaborateOpen({ id }: CollaborateOpenProps) {
  const data = await getIssues(id);

  if (!data) {
    return <EmptyState title="Empty" />;
  }
  return (
    <div className=" max-h-[calc(100vh-183px)] overflow-scroll">
      <div className="min-h-[calc(100vh-183px)]">
        {data?.map((o, i) => (
          <Item key={i + o?.id} issue={o} intent={o?.intent[0]} />
        ))}
      </div>
    </div>
  );
}
