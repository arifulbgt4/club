"use client";
import { useRouter } from "next/navigation";
import { type FC } from "react";
import { Badge } from "~/components/ui/badge";
import { TabsList, TabsTrigger } from "~/components/ui/tabs";
import { TASK_TABS } from "~/types";

interface TriggersProps {
  total?: {
    total_request: number;
  };
}

const Triggers: FC<TriggersProps> = ({ total }) => {
  const router = useRouter();
  return (
    <TabsList>
      <TabsTrigger
        onClick={() => router.push("/dashboard/task")}
        value={TASK_TABS.wip}
      >
        Work in progress{" "}
      </TabsTrigger>
      <TabsTrigger
        onClick={() => router.push(`/dashboard/task?p=${TASK_TABS.requests}`)}
        value={TASK_TABS.requests}
      >
        Pending requests
        <Badge className=" ml-2  bg-yellow-500">{total?.total_request}</Badge>
      </TabsTrigger>
      <TabsTrigger
        onClick={() => router.push(`/dashboard/task?p=${TASK_TABS.str}`)}
        value={TASK_TABS.str}
      >
        Submitted to review
        <Badge className=" ml-2 bg-purple-500">0</Badge>
      </TabsTrigger>

      <TabsTrigger
        onClick={() => router.push(`/dashboard/task?p=${TASK_TABS.completed}`)}
        value={TASK_TABS.completed}
      >
        Completed
        <Badge className=" ml-2  bg-green-500">0</Badge>
      </TabsTrigger>
      <TabsTrigger
        onClick={() => router.push(`/dashboard/task?p=${TASK_TABS.failed}`)}
        value={TASK_TABS.failed}
      >
        Failed
        <Badge className=" ml-2  bg-red-500">0</Badge>
      </TabsTrigger>
    </TabsList>
  );
};

export default Triggers;
