import { type FC } from "react";
import { type IssueCommentProps } from "./Types";
import { Avatar, AvatarImage } from "../ui/avatar";
import { formatDistanceToNow } from "date-fns";

const IssueComment: FC<IssueCommentProps> = ({
  imgSrc,
  username,
  body,
  updatedAt,
  createdAt,
  authorAssociation,
}) => {
  return (
    <div className="mb-6 flex">
      <Avatar className="h-8 w-8">
        <AvatarImage className="" src={imgSrc} />
      </Avatar>
      <div className=" relative ml-4 flex-auto rounded border before:absolute before:right-[100%] before:top-2 before:h-4 before:w-2 before:bg-muted before:content-[''] before:clip-path-triangle">
        <div className=" flex flex-row items-center justify-between bg-muted px-4 py-1">
          <span className=" text-muted-foreground">
            <span className=" font-semibold">{username}</span> commented{" "}
            {formatDistanceToNow(new Date(createdAt), {
              addSuffix: true,
              includeSeconds: true,
            })}{" "}
            {createdAt !== updatedAt &&
              " • updated " +
                formatDistanceToNow(new Date(updatedAt), {
                  addSuffix: true,
                  includeSeconds: true,
                })}
          </span>
          {authorAssociation === "OWNER" && (
            <span className=" rounded bg-stone-900 px-1.5 py-0.5 text-xs font-bold text-muted-foreground">
              Author
            </span>
          )}
        </div>
        <div className="p-3">{body}</div>
      </div>
    </div>
  );
};

export default IssueComment;
