"use client";
import { type FC } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "~/components/ui/badge";
import { TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn } from "~/lib/utils";
import { TASK_TABS } from "~/types";

interface TriggersProps {
  total?: {
    reassigned: number;
    requests: number;
    inreview: number;
    completed: number;
    failed: number;
  };
}

const Triggers: FC<TriggersProps> = ({ total }) => {
  const router = useRouter();

  const handleTabsTriggerClick = (value: string): void => {
    if (value === TASK_TABS.wip) {
      router.push(`/task`);
    } else {
      router.push(`/task?t=${value}`);
    }
  };

  const TABS_DATA = [
    {
      title: "Work in progress",
      value: TASK_TABS.wip,
      total: null,
      color: null,
    },
    {
      title: "Queue",
      value: TASK_TABS.queue,
      total: total?.reassigned,
      color: "bg-fuchsia-500",
    },
    {
      title: "Applyed",
      value: TASK_TABS.applyed,
      total: total?.requests,
      color: "bg-yellow-500",
    },
    {
      title: "Submitted to review",
      value: TASK_TABS.str,
      total: total?.inreview,
      color: "bg-purple-500",
    },
    {
      title: "Completed",
      value: TASK_TABS.completed,
      total: total?.completed,
      color: "bg-green-500",
    },
    {
      title: "Failed",
      value: TASK_TABS.failed,
      total: total?.failed,
      color: "bg-red-500",
    },
  ];

  return (
    <TabsList className="flex h-auto flex-wrap items-center justify-start space-y-1">
      {TABS_DATA.map((t, i) => (
        <TabsTrigger
          key={`tab-trigger-${t.title}-${i}`}
          onClick={() => handleTabsTriggerClick(t?.value)}
          value={t?.value}
          className=" text-base tracking-wide"
        >
          {t?.title}
          {t?.total !== null && (
            <Badge className={cn(t?.color, "ml-2")}>{t?.total}</Badge>
          )}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default Triggers;
