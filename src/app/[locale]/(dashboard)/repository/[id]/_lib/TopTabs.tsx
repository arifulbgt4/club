"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Settings, SquareKanban } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { Button } from "~/components/ui/button";

export default function TopTabs({ t }: { t: string }) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="flex w-20  justify-end gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant={t === undefined ? "default" : "outline"}
              className="h-8 w-8"
              onClick={() => t !== undefined && router.push(pathname)}
            >
              <SquareKanban />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Board</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant={t === "settings" ? "default" : "outline"}
              className="h-8 w-8"
              onClick={() =>
                t !== "settings" && router.push(pathname + "?t=settings")
              }
            >
              <Settings />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Settings</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
