"use client";
import { useTransition, type FC } from "react";
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

const Submit: FC<SubmitProps> = ({ requestId }) => {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<PRValues>({
    resolver: zodResolver(prNumberSchema),
    mode: "onChange",
  });

  const { formState } = form;

  function onSubmit(data: PRValues) {
    if (!formState.isDirty) return;

    startTransition(() => {
      return fetch("/api/v1/request/submit", {
        method: "PUT",
        body: JSON.stringify({
          id: requestId,
          prNumber: data.prNumber,
        }),
      })
        .then(() => {
          toast({
            title: "PR submit successfully!",
          });
          router.refresh();
        })
        .catch(() => {
          toast({
            title: "Something went wrong.",
            variant: "destructive",
          });
        });
    });
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex">
            <FormField
              control={form.control}
              name="prNumber"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="number" placeholder="#PR number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="ml-2"
              disabled={formState.isSubmitting || pending || !formState.isDirty}
            >
              {formState.isSubmitting || pending ? (
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
    </Card>
  );
};

export default Submit;
