"use server";
import { Tabs, TabsContent } from "~/components/ui/tabs";
import Wip from "~/components/Wip";
import Str from "~/components/Str";
import PRequests from "~/components/PRequests";
import Completed from "~/components/Completed";
import Failed from "~/components/Failed";
import { getCounts } from "./action";
import Triggers from "./Triggers";
import { TASK_TABS } from "~/types";
import ReAssigned from "~/components/ReAssigned";

async function TaskPage({
  searchParams,
}: {
  searchParams: { t: string; page?: string };
}) {
  const total = await getCounts();
  return (
    <Tabs defaultValue={searchParams?.t || TASK_TABS.wip}>
      <Triggers total={total} />
      <div>
        <TabsContent value={TASK_TABS.wip}>
          <Wip />
        </TabsContent>
        <TabsContent value={TASK_TABS.reassign}>
          <ReAssigned />
        </TabsContent>
        <TabsContent value={TASK_TABS.requests}>
          <PRequests pagination={Number(searchParams?.page || 1)} />
        </TabsContent>
        <TabsContent value={TASK_TABS.str}>
          <Str />
        </TabsContent>
        <TabsContent value={TASK_TABS.completed}>
          <Completed />
        </TabsContent>
        <TabsContent value={TASK_TABS.failed}>
          <Failed />
        </TabsContent>
      </div>
    </Tabs>
  );
}

export default TaskPage;
