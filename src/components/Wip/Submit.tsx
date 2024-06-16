"use client";
import { useCallback, useEffect, useState, type FC } from "react";
import { type SubmitProps } from "./Types";
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

const Submit: FC<SubmitProps> = () => {
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setLoading(true);
    // await fetch("/api/v1/issue/request", {
    //   method: "POST",
    //   body: JSON.stringify({ issueId }),
    // });
    setLoading(false);
  }

  return (
    <Card>
      <CardHeader className=" border-b px-3 py-4">
        <CardTitle className=" text-xl ">Submit pull request number</CardTitle>
      </CardHeader>
      <CardContent className="pt-3 text-muted-foreground">
        <p>
          After submitting your pull request, your profile will become
          available.
        </p>
      </CardContent>
      <CardFooter aria-disabled="true" className="flex px-3">
        <Input
          disabled={loading}
          placeholder="# Pull request number"
          className="mr-2"
          type="number"
        />
        {!loading ? (
          <Button onClick={onSubmit} className=" self-end bg-green-500">
            Submit
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

export default Submit;
