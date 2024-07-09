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

const Info = ({ issue }: { issue: IssueOptions }) => {
  console.log("issue", "issue");
  return (
    <>
      <DialogHeader>
        <DialogTitle>{issue?.title}</DialogTitle>
        <DialogDescription>
          Submitted by <strong>{issue?.assigned?.username}</strong> at{" "}
          {formatDate(issue?.updatedAt)}
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-2">
        <div>
          <strong className="pr-2">Re-assign:</strong>
          <span>
            If you review the pull request and <strong>Request changes</strong>{" "}
            or <strong>Comment</strong>, the issue will be reassigned.
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
          <strong className="pr-2">Failor:</strong>
          <span>
            If you review and <strong>Close</strong> pull request, the issue
            will move to draft, and the developer will receive a failure point.
          </span>
        </div>
      </div>
      <Link
        target="_blank"
        className={buttonVariants()}
        href={`https://github.com/${issue?.repository?.fullName}/pull/${issue?.prNumber}`}
      >
        See pull request #{issue?.prNumber}
      </Link>
    </>
  );
};

export default Info;
