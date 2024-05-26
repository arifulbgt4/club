import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { type PublishedIssueItemProps } from "./Types";
import { Avatar, AvatarImage } from "~/components/ui/avatar";

export default function PublishedIssueItem({
  id,
  title,
  user,
  updatedAt,
}: PublishedIssueItemProps) {
  return (
    <Link
      href={`/issue/${id}`}
      className="mb-2 flex flex-col items-start rounded-lg border p-3 text-left text-sm transition-all "
    >
      <div className="flex w-full flex-col">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <div className="text-base font-semibold">{title}</div>
            {/* {!item.read && (
            <span className="flex h-2 w-2 rounded-full bg-blue-600" />
          )} */}
          </div>
          <div className="ml-auto text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(updatedAt), {
              addSuffix: true,
              includeSeconds: true,
            })}
          </div>
        </div>
        <div className="mb-1 flex items-center">
          <Avatar className="mr-1 h-[15px] w-[15px] rounded-sm">
            <AvatarImage src={user?.picture as string} />
          </Avatar>
          <p className="  font-medium">{user?.username}</p>
        </div>
        {/* <div className="text-xs font-medium">{user?.username}</div> */}
      </div>
      <div className="line-clamp-2 text-xs text-muted-foreground">
        {/* {item.text.substring(0, 300)} */}
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Porro nihil
        commodi molestias sequi fugiat minus sunt, voluptates natus magnam.
        Adipisci id officia nulla esse dolore veritatis doloribus ut? Fuga,
        placeat.
      </div>

      {/* {item.labels.length ? (
      <div className="flex items-center gap-2">
        {item.labels.map((label) => (
          <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
            {label}
          </Badge>
        ))}
      </div>
       ) : null} */}
    </Link>
  );
}
