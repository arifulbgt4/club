"use client";
import { useTransition } from "react";
import { redirect } from "next/navigation";
import Icons from "~/components/shared/icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Card, CardDescription, CardTitle } from "~/components/ui/card";
import { toast } from "~/components/ui/use-toast";
import { deleteRepositoryById } from "./action";
import type { DeleteRepositoryProps } from "./Types";

export default function DeleteRepository({ repoId }: DeleteRepositoryProps) {
  const [pending, startTransition] = useTransition();
  const handleDelete = async () => {
    startTransition(() =>
      deleteRepositoryById(repoId)
        .then((res) => {
          if (res?.status === 300) {
            toast({
              title: res?.message,
              variant: "destructive",
            });
          }
        })
        .catch((error) => {
          console.error(error);
          toast({
            title: "Error deleting repository.",
            description: "Please try again.",
            variant: "destructive",
          });
        })
    );
  };
  return (
    <Card className="mt-5 flex items-center justify-between p-6">
      <div>
        <CardTitle className=" mb-2.5">Delete Repository</CardTitle>
        <CardDescription>
          If you have any issues that are in progress, or under review, you will
          not be able to delete the repository.
        </CardDescription>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Delete</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="destructive" onClick={handleDelete}>
                {pending && (
                  <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />
                )}
                Delete
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
