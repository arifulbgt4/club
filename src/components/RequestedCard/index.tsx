"use server";
import Link from "next/link";
import { TASK_TABS } from "~/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import EmptyState from "../shared/empty-state";
import { getApplyed } from "./action";
import { Backpack } from "lucide-react";

const RequestedCard = async () => {
  const { request, total } = await getApplyed();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Applyed ({total})</CardTitle>
        <CardDescription>Your applied issue list</CardDescription>
      </CardHeader>
      <CardContent>
        {!!total ? (
          request?.map((r) => (
            <Link
              className=" flex border-b border-b-accent-foreground py-1 text-accent-foreground hover:border-b-lime-600 hover:text-lime-600"
              href={`/issue/${r?.issueId}`}
              key={r.id}
            >
              <div className="mr-1 mt-1 h-4 w-4">
                <Backpack className="h-4 w-4" />
              </div>
              <span>{r?.issue?.title}</span>
            </Link>
          ))
        ) : (
          <EmptyState
            title="Applyed List Empty"
            description="Your applied issue list is empty. Explore and apply additional issues to get started"
            size="sm"
          />
        )}
      </CardContent>
      <CardFooter>
        <Link
          className=" font-medium text-lime-500 hover:underline"
          href={`/task/?t=${TASK_TABS.requests}`}
        >
          See all
        </Link>
      </CardFooter>
    </Card>
  );
};

export default RequestedCard;
