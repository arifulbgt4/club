"use server";
import { type WipProps } from "./Types";
import { getInProgress } from "./action";
import Description from "~/app/[locale]/issue/[issueId]/description";
import { formatDistanceToNow } from "date-fns";
import IssueComment from "../IssueComment";
import Submit from "./Submit";
import { Suspense } from "react";

async function Wip(props: WipProps) {
  const { issue, inprogress, comments } = await getInProgress();
  if (!inprogress)
    return (
      <div>
        <span>No task in progress</span>
      </div>
    );
  return (
    <div className="mt-6 flex flex-col">
      <div className=" border-b">
        <h1 className=" mb-2 break-words text-3xl">{issue?.title}</h1>
        <p className=" mb-2 text-sm font-medium text-muted-foreground">
          <span className=" font-bold">{inprogress?.userName}</span> assigned
          you in this issue{" "}
          {formatDistanceToNow(new Date(inprogress?.updatedAt as Date), {
            addSuffix: true,
            includeSeconds: true,
          })}
          {` • ${issue?.comments} comments`}
        </p>
      </div>
      <div className="my-5 flex">
        <div className=" mr-9 flex w-[70%] flex-col">
          <div className="mb-6 flex flex-auto">
            <Description body={issue?.body as string} />
          </div>
          <div className="flex flex-col">
            {!!issue?.comments && (
              <span className=" mb-3 font-bold">Comments</span>
            )}
            {comments?.map((com) => (
              <IssueComment
                key={com?.id}
                imgSrc={com?.user?.avatar_url as string}
                username={com?.user?.login as string}
                body={com?.body}
                updatedAt={com?.updated_at}
                createdAt={com?.created_at}
                authorAssociation={com?.author_association}
              />
            ))}
          </div>
        </div>
        <div className="flex w-[30%] flex-auto">
          <Suspense>
            <Submit
              requestId={inprogress?.id as string}
              issueId={String(issue?.id)}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default Wip;
