"use client";
import { type FC, useCallback, useEffect, useState } from "react";
import { type GitIssueItemProps } from "./Types";
import { Card } from "~/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "../ui/button";
import { PlusCircleIcon } from "lucide-react";
import Icons from "../shared/icons";
import { useRouter } from "next/navigation";

const GitIssueItem: FC<GitIssueItemProps> = ({
  id,
  title,
  body,
  labels,
  assignee,
  number,
  state,
  repoId,
}) => {
  const router = useRouter();
  const [isPublished, setIsPublished] = useState<boolean>();
  const [loading, setLoading] = useState(true);
  const [pubLoading, setPubLoading] = useState(false);
  const getCheck = useCallback(async () => {
    const res = await fetch(`/api/issue/check?id=${id}`, { method: "GET" });
    const data = await res.json();
    setIsPublished(data);
    setLoading(false);
  }, [id]);

  const onPublish = async () => {
    try {
      setPubLoading(true);
      const res = await fetch("/api/issue/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, issueNumber: number, state, repoId }),
      });
      const data = await res.json();
      router.push(`/issue/${data?.id}`);
    } catch (error) {
      console.log(error);
    }
  };
  const onUnPublish = async () => {
    try {
      setPubLoading(true);
      const res = await fetch("/api/issue/unpublish", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      setIsPublished(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCheck();
  }, []);
  return (
    <Card
      key={id}
      className="mb-2 flex items-center justify-between p-4 shadow-lg"
    >
      <div className="w-[70%]">
        <h2 className="mb-2 text-xl font-semibold">{title}</h2>
        <p className={`mb-4 text-gray-700 ${!body && " italic"}`}>
          {body ? body?.substring(0, 100) + " ..." : "No description provided."}
        </p>
        {labels?.length ? (
          <div className="flex flex-wrap">
            {labels?.map((label) => (
              <span
                key={label.id}
                className="mb-2 mr-2 rounded bg-gray-200 px-2.5 py-0.5 text-sm font-medium text-gray-800"
              >
                {label.name}
              </span>
            ))}
          </div>
        ) : (
          ""
        )}
      </div>

      {loading ? (
        <Button>
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        </Button>
      ) : isPublished ? (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            {pubLoading ? (
              <Button>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              </Button>
            ) : (
              <Button variant="outline">Unpublish</Button>
            )}
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              {/* <AlertDialogDescription>
                The issue will unlisted to get solution
              </AlertDialogDescription> */}
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>No</AlertDialogCancel>
              <AlertDialogAction onClick={onUnPublish}>Yes</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircleIcon className="mr-2 h-4 w-4" />
              Publish
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle className=" leading-snug">
                <span className="mb-2 mr-2 rounded bg-green-300 px-2 py-0.5 text-sm font-semibold text-gray-800">
                  Publish:
                </span>
                {title}
              </DialogTitle>
              <DialogDescription>
                After publish your issue the global developers will able to
                visit your issue. And they also able to indorse to solve the
                issue.
              </DialogDescription>
            </DialogHeader>
            {pubLoading ? (
              <Button>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              </Button>
            ) : (
              <Button onClick={onPublish}>Publish</Button>
            )}
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default GitIssueItem;
