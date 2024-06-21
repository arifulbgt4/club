import { type FC } from "react";
import { type PRequestsProps } from "./Types";
import EmptyState from "../shared/empty-state";

const PRequests: FC<PRequestsProps> = () => {
  return (
    <div>
      <EmptyState
        title="Request List Currently Empty Now"
        description="Your applied issue list is empty. Explore and apply additional issues to get started"
      />
    </div>
  );
};

export default PRequests;
