"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { CircleCheckBig, CircleDot, CircleX } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { Button } from "~/components/ui/button";

export default function TopTabs({ t }: { t: string }) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="flex w-28  justify-end gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant={t === undefined ? "default" : "outline"}
              className="h-8 w-8"
              onClick={() => t !== undefined && router.push(pathname)}
            >
              <CircleDot />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Open</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant={t === "done" ? "default" : "outline"}
              className="h-8 w-8"
              onClick={() => t !== "done" && router.push(pathname + "?t=done")}
            >
              <CircleCheckBig />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Done</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant={t === "failed" ? "default" : "outline"}
              className="h-8 w-8"
              onClick={() =>
                t !== "failed" && router.push(pathname + "?t=failed")
              }
            >
              <CircleX />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Failed</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
