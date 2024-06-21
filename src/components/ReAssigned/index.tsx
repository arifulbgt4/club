import { type FC } from "react";
import { type ReAssignedProps } from "./Types";
import EmptyState from "../shared/empty-state";

const ReAssigned: FC<ReAssignedProps> = () => {
  return (
    <div>
      <EmptyState
        title="No Reassignments of Your Review"
        description="No issues have been reassigned to you for review. All submitted items remain as originally assigned, and no new tasks or changes have been made to your review responsibilities"
      />
    </div>
  );
};

export default ReAssigned;
