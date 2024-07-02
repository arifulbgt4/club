"use server";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import EmptyState from "../shared/empty-state";
import { getInreview } from "./action";
import { Backpack } from "lucide-react";

const InReviewCard = async () => {
  const { list, total } = await getInreview();
  return (
    <Card className="bg-accent">
      <CardHeader>
        <CardTitle className="text-xl">In Review ({total})</CardTitle>
        <CardDescription>Your submitted to review issue list</CardDescription>
      </CardHeader>
      <CardContent>
        {!!total ? (
          list?.map((l) => (
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
          ))
        ) : (
          <EmptyState
            title="No Issues Submitted for Review"
            description="The review queue is currently empty. This indicates there are no submissions pending your assessment"
            size="sm"
          />
        )}
      </CardContent>
      <CardFooter>
        <Link
          className=" font-medium text-lime-500 hover:underline"
          href="/task/?t=str"
        >
          See all
        </Link>
      </CardFooter>
    </Card>
  );
};

export default InReviewCard;
