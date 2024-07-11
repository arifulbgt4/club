import type { User } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { buttonVariants } from "~/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { formatDate } from "~/lib/utils";
import type { IssueOptions } from "~/types";

const Info = ({
  issue,
  user,
  pr_number,
}: {
  issue: IssueOptions;
  user: User;
  pr_number: number;
}) => (
  <>
    <DialogHeader>
      <DialogTitle>{issue?.title}</DialogTitle>
      <DialogDescription>
        Submitted by <strong>{user?.username}</strong> at{" "}
        {formatDate(issue?.updatedAt)}
      </DialogDescription>
    </DialogHeader>
    <div className="flex flex-col gap-2">
      <div>
        <strong className="pr-2">Re-assign:</strong>
        <span>
          If you review the pull request and <strong>Request changes</strong> or{" "}
          <strong>Comment</strong>, the issue will be reassigned.
        </span>
      </div>
      <div>
        <strong className="pr-2">Done:</strong>
        <span>
          If you review and <strong>Approve</strong> or <strong>Merge</strong>{" "}
          the pull request, the issue will be marked as done.
        </span>
      </div>
      <div>
        <strong className="pr-2">Failure:</strong>
        <span>
          If you review and <strong>Close</strong> the pull request, the issue
          will move to <strong>Draft</strong>, and the developer will receive a
          failure.
        </span>
      </div>
    </div>
    <Link
      target="_blank"
      className={buttonVariants()}
      href={`https://github.com/${issue?.repository?.fullName}/pull/${pr_number}`}
    >
      See pull request #{pr_number}
    </Link>
  </>
);

export default Info;
