import { IntentType } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import type { ItemProps } from "./Types";

export default function Item({ issue, intent }: ItemProps) {
  return (
    <Link
      href={`/issue/${issue?.id}`}
      className="mb-2 flex flex-col items-start rounded-lg border p-4 text-left text-sm transition-all hover:bg-accent "
    >
      <div className="flex w-full flex-col">
        <div className="mb-1 flex items-center">
          <div className="mb-0.5 flex flex-col">
            <div className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(issue.updatedAt as Date), {
                addSuffix: true,
                includeSeconds: true,
              })}
            </div>
            <span className=" text-xl font-semibold">{issue?.title}</span>
          </div>
          <div className="ml-auto font-mono text-base font-semibold tracking-wide">
            {intent?.type === IntentType.paid ? (
              `$${intent?.price?.toFixed(2)}`
            ) : (
              <span className="font-normal tracking-normal">open-source</span>
            )}
          </div>
        </div>
      </div>

      {issue?.topics?.length ? (
        <div className=" my-1 flex flex-wrap gap-1">
          {issue?.topics?.map((t, i) => (
            <span
              key={i}
              className="rounded bg-accent px-2 py-0.5 text-sm font-medium text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      ) : (
        ""
      )}
    </Link>
  );
}
