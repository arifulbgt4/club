"use client";
import { type Organization, type User } from "@prisma/client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
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
const SEARCH_PARAMS_NAME = "org";

export default function SelectDemo({
  organization,
  user,
}: {
  organization: Organization[];
  user: User;
}) {
  const search = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const orgParams = search.get(SEARCH_PARAMS_NAME);

  return (
    <Select
      onValueChange={(v: string) => {
        if (v === DEFAULT_USER) {
          router.push(path);
          return;
        }
        router.push(`${path}?${SEARCH_PARAMS_NAME}=${v}`);
      }}
      defaultValue={orgParams === null ? DEFAULT_USER : orgParams}
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
