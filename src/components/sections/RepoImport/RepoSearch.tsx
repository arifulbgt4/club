import { type Organization, type User } from "@prisma/client";
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  Github,
  Lock,
  LockOpen,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "~/components/ui/command";
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

interface RepoOptions {
  id: string;
  name: string;
}

const RepoSearch = ({
  organization,
  repo,
  user,
}: {
  organization: Organization[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  repo: any[];
  user: User;
}) => {
  return (
    <div className=" flex flex-col">
      <div className="">
        <Command className="rounded-lg border shadow-md">
          <div className=" flex">
            <Select defaultValue={DEFAULT_USER}>
              <SelectTrigger className=" w-auto">
                <SelectValue placeholder="Select a Organization" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={DEFAULT_USER} className=" cursor-pointer">
                    <div className="flex">
                      <Avatar className="mr-2 h-[20px] w-[20px]">
                        <AvatarImage src={user?.picture || ""} />
                      </Avatar>
                      <p className=" font-black">{user?.username}</p>
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
            <CommandInput placeholder="Search a repo..." />
          </div>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {/* <CommandGroup heading="Suggestions"> */}
            {repo.map((item, i) => {
              console.log("item: ", item);
              return (
                <>
                  <CommandItem className=" p-2" key={item?.id}>
                    <div className=" mr-2 h-4 w-4">
                      {item?.private ? (
                        <Lock className=" mr-2 h-5 w-5" />
                      ) : (
                        <LockOpen className=" mr-2 h-5 w-5" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className=" font-medium">{item?.name}</span>
                      <span className=" text-xs font-light">
                        {item?.full_name}
                      </span>
                    </div>
                  </CommandItem>
                  <CommandSeparator />
                </>
              );
            })}

            {/* </CommandGroup> */}
          </CommandList>
        </Command>
      </div>
    </div>
  );
};

export default RepoSearch;
