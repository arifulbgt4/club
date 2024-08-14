"use client";

import dynamic from "next/dynamic";
import { zodResolver } from "@hookform/resolvers/zod";
import { type User } from "lucia";
import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { toast } from "~/components/ui/use-toast";
import { settingsSchema, type SettingsValues } from "~/types";
import { updateUser } from "./actions";

const CancelConfirmModal = dynamic(
  () => import("~/components/layout/cancel-confirm-modal")
);

export default function SettingsForm({ currentUser }: { currentUser: User }) {
  const [pending, startTransition] = useTransition();

  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    mode: "onChange",
    values: {
      name: currentUser.name,
      email: currentUser.email,
      picture: currentUser.picture,
      username: currentUser?.username,
    },
  });

  const { formState } = form;

  const [showConfirmAlert, setShowConfirmAlert] = useState(false);

  function onSubmit(data: SettingsValues) {
    if (!formState.isDirty) return;

    startTransition(() => {
      const updatePromise = updateUser(currentUser.id, data);

      return updatePromise
        .then(() => {
          toast({
            title: "Updated successfully!",
          });
        })
        .catch(() => {
          toast({
            title: "Something went wrong.",
            variant: "destructive",
          });
        });
    });
  }

  function handleReset() {
    form.reset();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" max-w-2xl space-y-6"
      >
        <span>Profile picture</span>
        <Avatar className="group relative h-28 w-28 rounded-full">
          <AvatarImage
            src={form?.getValues("picture")}
            alt={form.getValues().name}
          />
        </Avatar>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  className=" bg-muted"
                  readOnly
                  placeholder="username"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  className=" bg-muted"
                  readOnly
                  placeholder="Your email address"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormDescription>
          Note: If your information does not match your GitHub profile, please
          log in again
        </FormDescription>

        <div className="inline-flex gap-x-4">
          <CancelConfirmModal
            setShow={setShowConfirmAlert}
            show={showConfirmAlert}
            reset={handleReset}
            isDisabled={formState.isSubmitting || pending || !formState.isDirty}
          />

          <Button
            type="submit"
            disabled={formState.isSubmitting || pending || !formState.isDirty}
          >
            {formState.isSubmitting || pending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
