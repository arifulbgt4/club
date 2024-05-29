"use client";
import { type Organization, type User } from "@prisma/client";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";

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
              <p className=" font-black">{user.username}</p>
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
          <Link
            target="_blank"
            href="https://github.com/apps/issueclub/installations/select_target"
            className=" mt-2 flex items-center justify-center rounded border p-2 text-sm font-semibold hover:bg-accent"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Organization
          </Link>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
