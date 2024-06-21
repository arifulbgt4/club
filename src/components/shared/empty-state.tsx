import React, { type FC } from "react";
import { Button } from "../ui/button";
import Icons from "./icons";

interface EmptyStateProps {
  title: string;
  description: string;
  onActionClick?: () => void;
  actionText?: string;
}

const EmptyState: FC<EmptyStateProps> = ({
  title,
  description,
  onActionClick,
  actionText = "Take Action",
}) => {
  return (
    <div className=" flex flex-1 flex-col items-center justify-center rounded border p-16 text-center">
      <Icons.emptyIllustration width={150} height={150} />
      <span className=" mt-4 text-2xl font-bold">{title}</span>

      <span className=" mt-2 text-muted-foreground"> {description}</span>

      {onActionClick && (
        <Button onClick={onActionClick} className=" mt-6">
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
