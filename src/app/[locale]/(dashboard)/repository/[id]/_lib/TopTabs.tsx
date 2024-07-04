"use client";
import { Settings, SquareKanban } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { Button } from "~/components/ui/button";

const TopTabs = ({ t }: { t: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="flex w-20  justify-end gap-2">
      <Button
        title="Board"
        size="icon"
        variant={t === "board" ? "default" : "outline"}
        className="h-8 w-8"
        onClick={() => router.push(pathname + "?t=board")}
      >
        <SquareKanban />
      </Button>
      <Button
        title="Settings"
        size="icon"
        variant={t === "settings" ? "default" : "outline"}
        className="h-8 w-8"
        onClick={() => router.push(pathname + "?t=settings")}
      >
        <Settings />
      </Button>
    </div>
  );
};

export default TopTabs;
