import type { IntentType, Issue } from "@prisma/client";
import { ArrowLeft, Check, Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import Payment from "~/components/Payment";
import SearchTopics from "~/components/SearchTopics";
import Icons from "~/components/shared/icons";
import { Button } from "~/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { siteConfig } from "~/config/site";
import { cn } from "~/lib/utils";
import type { CollaboratorsType } from "../Types";
import { ASSIGN_TYPE } from "~/types";
import { Avatar, AvatarImage } from "~/components/ui/avatar";

const PUBLISH_STEP = 5;

const Update = ({
  setOpen,
  isPrivate,
  issueId,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isPrivate: boolean;
  issueId: string;
}) => {
  const [step, setStep] = useState<number>(1);
  const [issue, setIssue] = useState<Issue>();
  const [topics, setTopics] = useState<string[]>([]);
  const [collaborators, setCollaborators] = useState<CollaboratorsType[]>();
  const [collaborator, setCollaborator] = useState<CollaboratorsType>();
  const [assignType, setAssignType] = useState<
    ASSIGN_TYPE.collaborator | ASSIGN_TYPE.global
  >(ASSIGN_TYPE.global);
  const [draftLoading, setDraftLoading] = useState<boolean>(false);
  const [collaboratorLoading, setCollaboratorLoading] =
    useState<boolean>(false);
  const [price, setPrice] = useState<number>(0);
  const [publishType, setPublishType] = useState<IntentType>("open_source");
  const [publishLoading, setPublishLoading] = useState<boolean>(false);
  const router = useRouter();

  const fetchResults = async () => {
    const response = await fetch(`/api/v1/issue/exist?id=${issueId}`, {
      method: "GET",
    });
    const data = await response.json();
    setIssue(data?.issue);
    setPublishType(data?.issue?.intent[0]?.type as IntentType);
    setTopics(data?.issue?.topics);
    setStep(PUBLISH_STEP);
    if (isPrivate && !!data?.assign) {
      setAssignType(ASSIGN_TYPE.collaborator);
      setCollaborator({
        id: String(data?.assign?.githubId),
        avatar_url: String(data?.assign?.picture),
        login: String(data?.assign?.username),
      });
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchIssue = useCallback(fetchResults, []);

  function goBack() {
    setStep(PUBLISH_STEP);
  }

  function stepTwo() {
    setStep(PUBLISH_STEP);
  }

  async function stepThree() {
    await draftPublish();
    setStep(PUBLISH_STEP);
  }

  async function stepFour() {
    if (assignType === ASSIGN_TYPE.collaborator) {
      await getCollaborators();
      setStep(4.5);
    } else {
      await draftPublish();
      setStep(PUBLISH_STEP);
    }
  }

  async function stepFourAndHalf() {
    await draftPublish();
    setStep(PUBLISH_STEP);
  }

  async function draftPublish() {
    setDraftLoading(true);
    const res = await fetch("/api/v1/issue/draft_publish", {
      method: "POST",
      body: JSON.stringify({
        topics,
        issueNumber: issue?.issueNumber,
        type: publishType,
        repoId: issue?.repositoryId,
        assignType,
        collaborator,
      }),
    });
    if (!res.ok) {
      setDraftLoading(false);
      return false;
    }
    setDraftLoading(false);
    return true;
  }

  async function getCollaborators() {
    setCollaboratorLoading(true);
    const res = await fetch(
      `/api/v1/repo/collaborators?repoId=${issue?.repositoryId}`
    );
    const data = await res.json();
    setCollaborators(data);
    setCollaboratorLoading(false);
  }

  async function onPublish() {
    setPublishLoading(true);
    const res = await fetch("/api/v1/issue/publish", {
      method: "POST",
      body: JSON.stringify({
        topics,
        issueNumber: issue?.issueNumber,
        type: publishType,
        repoId: issue?.repositoryId,
        price,
        assignType,
        collaborator,
      }),
    });
    if (!res.ok) {
      setPublishLoading(false);
      return;
    }
    router.refresh();
    setPublishLoading(false);
    setOpen(false);
  }

  useEffect(() => {
    fetchIssue();
  }, [fetchIssue]);

  return (
    <>
      {step === 1 && (
        <div className="flex h-[204px] items-center justify-center">
          <Icons.spinner className=" animate-spin" />
        </div>
      )}
      {step === 2 && (
        <>
          <DialogHeader>
            <DialogTitle className="flex flex-col">
              <Button
                size="sm"
                variant="link"
                className=" mb-1 w-fit px-0"
                onClick={goBack}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>

              <span>{issue?.title}</span>
            </DialogTitle>
            <DialogDescription>
              Add topics related to the issue to reach out to developers
            </DialogDescription>
          </DialogHeader>
          <SearchTopics value={topics} onChange={setTopics} />
          <div>
            <Button
              disabled={!topics?.length}
              className="mt-4"
              onClick={stepTwo}
            >
              Update
            </Button>
          </div>
        </>
      )}
      {step === 3 && (
        <>
          <DialogHeader>
            <DialogTitle className="flex flex-col">
              <Button
                size="sm"
                variant="link"
                className=" mb-1 w-fit px-0"
                onClick={goBack}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>

              <span>{issue?.title}</span>
            </DialogTitle>
            <DialogDescription>
              Publish the issue to global developers
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <span className=" font-medium">How you want to publish?</span>
            <div className="flex flex-col gap-2">
              <div
                onClick={() => {
                  if (publishType === "paid") {
                    setPublishType("open_source");
                  }
                }}
                className={cn(
                  publishType === "open_source" &&
                    "pointer-events-none bg-accent",
                  "flex cursor-pointer flex-nowrap items-center gap-2 rounded-md border p-3 hover:bg-accent"
                )}
              >
                <span className=" flex h-5 w-5 items-center justify-center rounded-full border-2 border-accent-foreground">
                  {publishType === "open_source" && (
                    <span className=" h-3 w-3 rounded-full bg-accent-foreground"></span>
                  )}
                </span>
                <span className="text-lg font-semibold">Open source</span>
              </div>
              <div
                onClick={() => {
                  if (publishType === "open_source") {
                    setPublishType("paid");
                  }
                }}
                className={cn(
                  publishType === "paid" && "pointer-events-none bg-accent",
                  "flex cursor-pointer flex-nowrap items-center gap-2 rounded-md border p-3 hover:bg-accent"
                )}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-accent-foreground">
                  {publishType === "paid" && (
                    <span className=" h-3 w-3 rounded-full bg-accent-foreground"></span>
                  )}
                </span>
                <span className="text-lg font-semibold">Paid</span>
              </div>
            </div>
          </div>
          <div>
            <Button
              disabled={draftLoading}
              className="mt-4"
              onClick={stepThree}
            >
              {!draftLoading ? (
                "Update"
              ) : (
                <Icons.spinner className=" animate-spin" />
              )}
            </Button>
          </div>
        </>
      )}
      {step === 4 && (
        <>
          <DialogHeader>
            <DialogTitle className="flex flex-col">
              <Button
                size="sm"
                variant="link"
                className=" mb-1 w-fit px-0"
                onClick={goBack}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>

              <span>{issue?.title}</span>
            </DialogTitle>
            <DialogDescription>Assign</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <span className=" font-medium">How you want to assign?</span>
            <div className="flex flex-col gap-2">
              <div
                onClick={() => {
                  if (assignType === ASSIGN_TYPE.collaborator) {
                    setAssignType(ASSIGN_TYPE.global);
                  }
                }}
                className={cn(
                  assignType === ASSIGN_TYPE.global &&
                    "pointer-events-none bg-accent",
                  "flex cursor-pointer flex-nowrap items-center gap-2 rounded-md border p-3 hover:bg-accent"
                )}
              >
                <span className=" flex h-5 w-5 items-center justify-center rounded-full border-2 border-accent-foreground">
                  {assignType === ASSIGN_TYPE.global && (
                    <span className=" h-3 w-3 rounded-full bg-accent-foreground"></span>
                  )}
                </span>
                <span className="text-lg font-semibold">
                  For Global Developers
                </span>
              </div>
              <div
                onClick={() => {
                  if (assignType === ASSIGN_TYPE.global) {
                    setAssignType(ASSIGN_TYPE.collaborator);
                  }
                }}
                className={cn(
                  assignType === ASSIGN_TYPE.collaborator &&
                    "pointer-events-none bg-accent",
                  "flex cursor-pointer flex-nowrap items-center gap-2 rounded-md border p-3 hover:bg-accent"
                )}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-accent-foreground">
                  {assignType === ASSIGN_TYPE.collaborator && (
                    <span className=" h-3 w-3 rounded-full bg-accent-foreground"></span>
                  )}
                </span>
                <span className="text-lg font-semibold">For Collaborator</span>
              </div>
            </div>
          </div>
          <div>
            <Button
              disabled={collaboratorLoading || draftLoading}
              className="mt-4"
              onClick={stepFour}
            >
              {!collaboratorLoading && !draftLoading ? (
                "Update"
              ) : (
                <Icons.spinner className=" animate-spin" />
              )}
            </Button>
          </div>
        </>
      )}
      {step === 4.5 && (
        <>
          <DialogHeader>
            <DialogTitle className="flex flex-col">
              <Button
                size="sm"
                variant="link"
                className=" mb-1 w-fit px-0"
                onClick={() => setStep(4)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>

              <span>{issue?.title}</span>
            </DialogTitle>
            <DialogDescription>Assign collaborator</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <span className=" font-medium">Assign to a collaborator</span>
            <div className=" flex max-h-52 flex-col gap-2 overflow-y-scroll">
              {!!collaborators?.length &&
                collaborators.map((d) => (
                  <div
                    key={d?.id}
                    className={cn(
                      d?.permissions?.admin &&
                        "pointer-events-none border hover:bg-transparent",
                      String(d?.id) === collaborator?.id &&
                        "pointer-events-none bg-accent hover:bg-transparent",
                      "flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-accent"
                    )}
                    onClick={() => {
                      if (
                        !d?.permissions?.admin &&
                        String(d?.id) !== collaborator?.id
                      ) {
                        setCollaborator({ ...d, id: String(d?.id) });
                      }
                    }}
                  >
                    <Avatar className="h-8  w-8 border">
                      <AvatarImage src={d?.avatar_url} />
                    </Avatar>
                    <div className="flex flex-1 gap-3">
                      <span className=" font-semibold">{d?.login}</span>
                      <span className="text-sm">{d?.role_name}</span>
                    </div>
                    {String(d?.id) === collaborator?.id && (
                      <div>
                        <Check />
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
          <div>
            <Button
              disabled={!collaborator?.id || draftLoading}
              className="mt-4"
              onClick={stepFourAndHalf}
            >
              {!draftLoading ? (
                "Update"
              ) : (
                <Icons.spinner className=" animate-spin" />
              )}
            </Button>
          </div>
        </>
      )}
      {step === PUBLISH_STEP && (
        <>
          <DialogHeader>
            <DialogTitle>{issue?.title}</DialogTitle>
            <DialogDescription>
              Publish the issue to global developers
            </DialogDescription>
          </DialogHeader>
          <div className="relative mt-3 flex flex-wrap gap-1 rounded-md border p-3">
            <Button
              size="icon"
              variant="ghost"
              className=" absolute -top-5 right-3"
              onClick={() => {
                setStep(2);
              }}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <span className="mb-2 w-full font-semibold">Topics</span>
            {topics?.map((p, i) => (
              <Button
                key={i}
                size="sm"
                className="pointer-events-none h-6 px-2"
              >
                {p}
              </Button>
            ))}
          </div>
          {isPrivate && (
            <div className="relative mt-3 flex flex-col rounded-md border p-3">
              <Button
                size="icon"
                variant="ghost"
                className=" absolute -top-5 right-3"
                onClick={() => {
                  setStep(4);
                }}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <span className="mb-2 font-semibold">Assigned</span>
              {assignType === ASSIGN_TYPE.collaborator ? (
                <div className="flex  items-center gap-2">
                  <Avatar className="h-6  w-6 border">
                    <AvatarImage src={collaborator?.avatar_url} />
                  </Avatar>
                  <div className="flex flex-1 gap-3">
                    <span className=" font-semibold">
                      {collaborator?.login}
                    </span>
                    <span className="text-sm">{collaborator?.role_name}</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="pointer-events-none flex cursor-pointer flex-nowrap items-center gap-2 rounded-md border bg-accent p-3">
                    <span className=" flex h-5 w-5 items-center justify-center rounded-full border-2 border-accent-foreground">
                      <span className=" h-3 w-3 rounded-full bg-accent-foreground"></span>
                    </span>
                    <span className="text-lg font-semibold">
                      For Global Developer
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="relative mt-3 flex flex-col rounded-md border p-3">
            <Button
              size="icon"
              variant="ghost"
              className=" absolute -top-5 right-3"
              onClick={() => {
                setStep(3);
              }}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <span className="mb-2 font-semibold">Type</span>
            {publishType === "open_source" ? (
              <div className="pointer-events-none flex cursor-pointer flex-nowrap items-center gap-2 rounded-md border bg-accent p-3">
                <span className=" flex h-5 w-5 items-center justify-center rounded-full border-2 border-accent-foreground">
                  <span className=" h-3 w-3 rounded-full bg-accent-foreground"></span>
                </span>
                <span className="text-lg font-semibold">Open source</span>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Payment value={price} onChange={setPrice} />
              </div>
            )}
          </div>

          <Button
            disabled={
              publishLoading ||
              (publishType === "paid" && price < siteConfig().minimumAmount)
            }
            onClick={onPublish}
          >
            {!publishLoading ? (
              "Publish"
            ) : (
              <Icons.spinner className=" animate-spin" />
            )}
          </Button>
        </>
      )}
    </>
  );
};

export default Update;
