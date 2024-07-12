import React, { type FC } from "react";
import Icons from "./icons";
import { cn } from "~/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  border?: boolean;
  size?: "default" | "sm";
  full?: boolean;
}

const EmptyState: FC<EmptyStateProps> = ({
  title,
  description,
  children,
  border = true,
  size = "default",
  full = true,
}) => {
  return (
    <div
      className={cn(
        size === "sm" ? "px-3" : "p-16",
        border && "border",
        full && "flex-1",
        " flex flex-col items-center justify-center gap-2 rounded text-center"
      )}
    >
      <Icons.emptyIllustration
        width={size === "sm" ? 60 : 150}
        height={size === "sm" ? 60 : 150}
      />
      <span
        className={cn(
          size === "sm" ? "text-base" : "text-2xl",
          "pt-2 font-bold"
        )}
      >
        {title}
      </span>

      {description && (
        <span className="text-muted-foreground">{description}</span>
      )}

      {children && children}
    </div>
  );
};

export default EmptyState;
