"use client";
import { useCallback, useEffect, useMemo, useState, type FC } from "react";
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
import Icons from "../shared/icons";
import { IssueType } from "@prisma/client";

const Apply: FC<ApplyProps> = ({ issueId, price, issueType }) => {
  const [applyed, setApplyed] = useState<boolean>();
  const [loading, setLoading] = useState(true);
  const isApplyed = useCallback(async () => {
    try {
      const res = await fetch(`/api/v1/issue/checkApply?issueId=${issueId}`, {
        method: "GET",
      });
      const data = await res.json();
      setApplyed(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [issueId]);

  useEffect(() => {
    isApplyed();
  }, [isApplyed]);

  async function onApply() {
    setLoading(true);
    await fetch("/api/v1/issue/request", {
      method: "POST",
      body: JSON.stringify({ issueId }),
    });
    setApplyed(true);
    setLoading(false);
  }

  const getPrice = useMemo(() => {
    if (price === 0 || price < 3 || issueType === IssueType.free) {
      return (
        <span>
          Free <span className=" text-sm text-muted-foreground">$0.00</span>
        </span>
      );
    }
    return `$${price.toFixed(2)}`;
  }, [price, issueType]);

  return (
    <Card>
      <CardHeader className=" border-b">
        <CardTitle className=" text-green-500">{getPrice}</CardTitle>
      </CardHeader>
      <CardContent className="py-4">
        <p>To apply for a paid issue, you must first complete 30 free tasks</p>
        <span className="mt-2 block text-gray-600">Completed 5/30</span>
      </CardContent>
      <CardFooter aria-disabled="true" className=" flex-col">
        <div className="mb-5 flex items-center self-end">
          <span className=" text-sm font-semibold">
            I will submit the task within{" "}
          </span>
          <Input
            disabled={applyed || loading}
            placeholder="EX: 2"
            className=" mx-3 h-8 w-[78px] border-yellow-100"
            type="number"
          />{" "}
          <span>days</span>
        </div>
        {!loading ? (
          <Button
            disabled={applyed}
            onClick={onApply}
            className=" self-end bg-green-500"
          >
            {applyed ? "Applyed" : "Apply"}
          </Button>
        ) : (
          <Button className=" self-end bg-green-500">
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default Apply;
