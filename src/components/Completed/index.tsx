import { type FC } from "react";
import { type CompletedProps } from "./Types";
import EmptyState from "../shared/empty-state";

const Completed: FC<CompletedProps> = () => {
  return (
    <div>
      <EmptyState
        title="You haven't completed any issues yet"
        description="You haven't completed issues, begin your journey by selecting and tackling your first challenge to make meaningful progress"
      />
    </div>
  );
};

export default Completed;
