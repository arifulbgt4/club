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

const TopTabs = ({ t }: { t: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="flex w-20  justify-end gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant={t === "board" ? "default" : "outline"}
              className="h-8 w-8"
              onClick={() => router.push(pathname + "?t=board")}
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
              onClick={() => router.push(pathname + "?t=settings")}
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
};

export default TopTabs;
