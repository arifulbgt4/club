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
import { IntentType } from "@prisma/client";
import { cn } from "~/lib/utils";
import { siteConfig } from "~/config/site";

const Apply: FC<ApplyProps> = ({ issueId, price, issueType, disabled }) => {
  const [days, setDays] = useState(0);
  const [applyError, setApplyError] = useState(false);
  const [checkStatus, setCheckStatus] = useState<{
    qualified: boolean;
    applyed: boolean;
    count: number;
  }>({ qualified: false, count: 0, applyed: false });
  const [loading, setLoading] = useState(true);
  const isApplyed = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/v1/issue/checkApply?issueId=${issueId}&issueType=${issueType}`,
        {
          method: "GET",
        }
      );
      const data = await res.json();
      setDays(data?.applyedDay || 0);
      setCheckStatus(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issueId]);

  async function onApply() {
    if (days <= 0) {
      setApplyError(true);
      return;
    }
    setApplyError(false);
    setLoading(true);
    await fetch("/api/v1/issue/request", {
      method: "POST",
      body: JSON.stringify({ issueId, days: Number(days) }),
    });
    setCheckStatus((prevState) => ({
      ...prevState,
      qualified: false,
      applyed: true,
    }));
    setLoading(false);
  }

  const getPrice = useMemo(() => {
    if (
      price === 0 ||
      price < siteConfig().minimumAmount ||
      issueType === IntentType.open_source
    ) {
      return (
        <span className="font-normal tracking-normal">
          Open source{" "}
          <span className=" text-sm font-semibold tracking-wide text-muted-foreground">
            $0.00
          </span>
        </span>
      );
    }
    return `$${price.toFixed(2)}`;
  }, [price, issueType]);

  useEffect(() => {
    if (!disabled) {
      isApplyed();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApplyed]);

  return (
    <Card className="mb-6">
      <CardHeader className=" mb-6 border-b">
        <CardTitle className="font-mono font-semibold tracking-wide">
          {getPrice}
        </CardTitle>
      </CardHeader>
      {checkStatus?.count < siteConfig().qualifyIssue && (
        <CardContent>
          <p className="text-sm font-semibold">
            To qualify for a paid issue, you must first contribute{" "}
            {siteConfig().qualifyIssue} open-source issues.
          </p>
          <span className="mt-2 block font-semibold text-muted-foreground">
            Completed {checkStatus?.count}/{siteConfig().qualifyIssue}
          </span>
        </CardContent>
      )}
      <CardFooter aria-disabled="true" className=" flex-col">
        <div className="flex flex-col gap-4">
          <span className="text-sm font-semibold">
            How many days will it take for you to submit a pull request?{" "}
          </span>
          <div className="flex gap-2">
            <Input
              disabled={!checkStatus?.qualified || loading || disabled}
              value={days}
              onChange={(event) => {
                if (Number(event?.target?.value) > 0) {
                  setDays(Number(event?.target?.value));
                  setApplyError(false);
                }
              }}
              className={cn(
                "h-8 w-14 border-yellow-100",
                applyError && "border-red-500"
              )}
              type="number"
            />{" "}
            <span className="font-semibold">days</span>
          </div>
          <div>
            {!loading ? (
              <Button
                disabled={!checkStatus?.qualified || disabled}
                onClick={onApply}
                className=" bg-green-500"
              >
                {checkStatus?.applyed ? "Applyed" : "Apply"}
              </Button>
            ) : (
              <Button disabled className=" bg-green-500">
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              </Button>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Apply;
