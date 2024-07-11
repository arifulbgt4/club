"use client";
import { useRouter } from "next/navigation";
import { type FC } from "react";
import { Badge } from "~/components/ui/badge";
import { TabsList, TabsTrigger } from "~/components/ui/tabs";
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
  return (
    <TabsList>
      <TabsTrigger onClick={() => router.push("/task")} value={TASK_TABS.wip}>
        Work in progress
      </TabsTrigger>
      <TabsTrigger
        onClick={() => router.push(`/task?t=${TASK_TABS.queue}`)}
        value={TASK_TABS.queue}
      >
        Queue
        <Badge className=" ml-2 bg-fuchsia-500">{total?.reassigned}</Badge>
      </TabsTrigger>
      <TabsTrigger
        onClick={() => router.push(`/task?t=${TASK_TABS.applyed}`)}
        value={TASK_TABS.applyed}
      >
        Applyed
        <Badge className=" ml-2  bg-yellow-500">{total?.requests}</Badge>
      </TabsTrigger>
      <TabsTrigger
        onClick={() => router.push(`/task?t=${TASK_TABS.str}`)}
        value={TASK_TABS.str}
      >
        Submitted to review
        <Badge className=" ml-2 bg-purple-500">{total?.inreview}</Badge>
      </TabsTrigger>

      <TabsTrigger
        onClick={() => router.push(`/task?t=${TASK_TABS.completed}`)}
        value={TASK_TABS.completed}
      >
        Completed
        <Badge className=" ml-2  bg-green-500">{total?.completed}</Badge>
      </TabsTrigger>
      <TabsTrigger
        onClick={() => router.push(`/task?t=${TASK_TABS.failed}`)}
        value={TASK_TABS.failed}
      >
        Failed
        <Badge className=" ml-2  bg-red-500">{total?.failed}</Badge>
      </TabsTrigger>
    </TabsList>
  );
};

export default Triggers;
