"use client";
import { useState, type FC } from "react";
import { type SubmitProps } from "./Types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { toast } from "~/components/ui/use-toast";

import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Loader2 } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";

const prNumberSchema = z.object({
  prNumber: z
    .string({
      required_error: "Please enter your pull request number",
    })
    .min(1, {
      message: "Number must be at least 1 characters.",
    })
    .max(5, {
      message: "Number must be at most 5 characters.",
    }),
});

type PRValues = z.infer<typeof prNumberSchema>;

const Submit: FC<SubmitProps> = ({
  requestId,
  intentId,
  issueId,
  isReSubmit,
  previous_pr,
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<PRValues>({
    resolver: zodResolver(prNumberSchema),
    mode: "onChange",
  });

  const { formState } = form;

  async function onSubmit(data: PRValues) {
    if (!formState.isDirty) return;
    setLoading(true);
    const res = await fetch("/api/v1/request/submit", {
      method: "PUT",
      body: JSON.stringify({
        requestId,
        issueId,
        intentId,
        prNumber: data.prNumber,
      }),
    });
    const text = await res.text();
    if (!res.ok) {
      toast({
        title: text,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    toast({
      title: text,
    });
    router.refresh();
    setLoading(false);
  }

  async function reSubmit() {
    setLoading(true);
    await fetch("/api/v1/request/re_submit", {
      method: "PUT",
      body: JSON.stringify({
        requestId,
        issueId,
        intentId,
        prNumber: previous_pr,
      }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <Card>
      <CardHeader className=" border-b px-3 py-4">
        <CardTitle className=" text-xl ">Submit pull request number</CardTitle>
      </CardHeader>
      {!isReSubmit ? (
        <>
          <CardContent className="pt-3 text-muted-foreground">
            <p>
              After submitting your pull request, your profile will become
              available.
            </p>
          </CardContent>
          <CardFooter aria-disabled="true" className="flex px-3">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex">
                <FormField
                  control={form.control}
                  name="prNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="#PR number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="ml-2"
                  disabled={
                    formState.isSubmitting || !formState.isDirty || loading
                  }
                >
                  {formState.isSubmitting || loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </form>
            </Form>
          </CardFooter>
        </>
      ) : (
        <>
          <CardContent className="pt-3 text-muted-foreground">
            <p>After re-submit, your profile will become available.</p>
          </CardContent>
          <CardFooter>
            <Button disabled={loading} onClick={reSubmit}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                "Re-Submit"
              )}
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default Submit;
