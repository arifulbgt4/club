import React, { type FC } from "react";
import { Button } from "../ui/button";
import Icons from "./icons";
import { cn } from "~/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  onActionClick?: () => void;
  actionText?: string;
  size?: "default" | "sm";
}

const EmptyState: FC<EmptyStateProps> = ({
  title,
  description,
  onActionClick,
  actionText = "Take Action",
  size = "default",
}) => {
  return (
    <div
      className={cn(
        size === "sm" ? "px-3" : "border p-16",
        " flex flex-1 flex-col items-center justify-center rounded text-center"
      )}
    >
      <Icons.emptyIllustration
        width={size === "sm" ? 60 : 150}
        height={size === "sm" ? 60 : 150}
      />
      <span
        className={cn(
          size === "sm" ? "text-base" : "text-2xl",
          "mt-4 font-bold"
        )}
      >
        {title}
      </span>

      {description && (
        <span className=" mt-2 text-muted-foreground">{description}</span>
      )}

      {onActionClick && (
        <Button onClick={onActionClick} className=" mt-6">
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
