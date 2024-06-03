import { type FC } from "react";
import { type ApplyProps } from "./Types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const Apply: FC<ApplyProps> = () => {
  return (
    <Card>
      <CardHeader className=" border-b">
        <CardTitle className=" text-green-500">$250.00</CardTitle>
      </CardHeader>
      <CardContent className="py-4">
        <p>To apply a paid issue you need to complete 30 free task before</p>
        <span className="mt-2 block text-gray-600">Completed 5/30</span>
      </CardContent>
      <CardFooter aria-disabled="true" className=" flex-col">
        <div className="mb-5 flex items-center self-end">
          <span className=" text-sm font-semibold">
            I will submit the task within{" "}
          </span>
          <Input
            // disabled
            placeholder="EX: 2"
            className=" mx-3 h-8 w-[78px] border-yellow-100"
            type="number"
          />{" "}
          <span>days</span>
        </div>
        <Button
          // disabled
          className=" self-end bg-green-500"
        >
          Apply
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Apply;
