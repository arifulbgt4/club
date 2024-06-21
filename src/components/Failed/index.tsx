import { type FC } from "react";
import { type FailedProps } from "./Types";
import EmptyState from "../shared/empty-state";

const Failed: FC<FailedProps> = () => {
  return (
    <div>
      <EmptyState title="You haven't failed any issues yet" />
    </div>
  );
};

export default Failed;
