import { type FC } from "react";
import { type RepositoryItemProps } from "./Types";
import Link from "next/link";
import { Card } from "../ui/card";

const RepositoryItem: FC<RepositoryItemProps> = ({
  id,
  name,
  fullName,
  private: isPrivate,
  createdAt,
  updatedAt,
}) => {
  return (
    <Card
      role="button"
      className="relative flex flex-col items-center justify-center gap-y-2.5 p-8 text-center hover:bg-accent"
    >
      <h4 className="font-medium ">{name}</h4>
      <p className=" text-muted-foreground">{fullName}</p>
      <Link href={`/repo/${id}`} className="absolute inset-0 ">
        <span className="sr-only">View project details</span>
      </Link>
    </Card>
  );
};

export default RepositoryItem;
