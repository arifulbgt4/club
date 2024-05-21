"use client";
import * as React from "react";
import { Avatar } from "~/components/ui/avatar";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export default function SelectDemo() {
  const [value, setValue] = React.useState("");
  return (
    <Select
      onValueChange={(v) => {
        console.log("first ", v);
      }}
      //   defaultValue="blueberry"
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="apple">
            <div className="flex">
              <Avatar className="h-[20px] w-[20px]">A</Avatar> Apple
            </div>
          </SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectItem value="applse">
            <div className="flex">
              <Avatar className="h-[20px] w-[20px]">B</Avatar> Apple
            </div>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
