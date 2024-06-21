import { type FC } from "react";
import { type StrProps } from "./Types";
import EmptyState from "../shared/empty-state";

const Str: FC<StrProps> = () => {
  return (
    <div>
      <EmptyState
        title="No Issues Submitted for Review"
        description="The review queue is currently empty. This indicates there are no submissions pending your evaluation or assessment"
      />
    </div>
  );
};

export default Str;
