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
import { getReassign } from "./action";
import { Backpack } from "lucide-react";

const RequestChangesCard = async () => {
  const { list, total } = await getReassign();
  if (!total) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Request Changes ({total})</CardTitle>
        <CardDescription>Reassignments of your review</CardDescription>
      </CardHeader>
      <CardContent>
        {list?.map((l) => (
          <Link
            className=" flex border-b border-b-accent-foreground py-1 text-accent-foreground hover:border-b-lime-600 hover:text-lime-600"
            href={`/issue/${l?.issueId}`}
            key={l.id}
          >
            <div className="mr-1 mt-1 h-4 w-4">
              <Backpack className="h-4 w-4" />
            </div>
            <span>{l?.issue?.title}</span>
          </Link>
        ))}
      </CardContent>
      <CardFooter>
        <Link
          className=" font-medium text-lime-500 hover:underline"
          href={`/task/?t=${TASK_TABS.queue}`}
        >
          See all
        </Link>
      </CardFooter>
    </Card>
  );
};

export default RequestChangesCard;
