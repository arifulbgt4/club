"use client";
import { type Organization, type User } from "@prisma/client";
import { Avatar, AvatarImage } from "~/components/ui/avatar";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const DEFAULT_USER = "defaultuser";

export default function SelectDemo({
  organization,
  user,
}: {
  organization: Organization[];
  user: User;
}) {
  return (
    <Select
      onValueChange={(v: string) => {
        console.log("first ", v);
      }}
      defaultValue={DEFAULT_USER}
    >
      <SelectTrigger className=" w-auto">
        <SelectValue placeholder="Select a Organization" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value={DEFAULT_USER} className=" cursor-pointer">
            <div className="flex">
              <Avatar className="mr-2 h-[20px] w-[20px]">
                <AvatarImage src={user.picture || ""} />
              </Avatar>
              <p className=" font-black">{user.name}</p>
            </div>
          </SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel className=" font-bold">Organization</SelectLabel>
          {organization.map((org: Organization) => (
            <SelectItem
              key={org.id}
              value={org.name}
              className="cursor-pointer"
            >
              <div className="flex">
                <Avatar className="mr-2 h-[20px] w-[20px]">
                  <AvatarImage src={org.picture || ""} />
                </Avatar>
                <p className=" font-black">{org.name}</p>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
