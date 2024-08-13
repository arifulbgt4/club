"use client";
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import debounce from "lodash/debounce";
import {
  ArrowLeft,
  Check,
  CircleDot,
  Edit2,
  PlusCircle,
  Search,
  StepForward,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { type IntentType, IssueState } from "@prisma/client";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

import { Input } from "~/components/ui/input";
import Icons from "~/components/shared/icons";
import { cn, formatDate } from "~/lib/utils";
import { siteConfig } from "~/config/site";
import SearchTopics from "../SearchTopics";
import Payment from "../Payment";
import type { CollaboratorsType } from "./Types";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { ASSIGN_TYPE } from "~/types";

const PUBLISH_STEP = 5;

const IssueImportModalContent = ({
  repoId,
  setOpen,
  isPrivate,
}: {
  repoId: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isPrivate: boolean;
}) => {
  const [step, setStep] = useState<number>(1);
  const [issue, setIssue] = useState<any>({});
  const [afterText, setAfterText] = useState<string>("");
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [topics, setTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [collaborators, setCollaborators] = useState<CollaboratorsType[]>();
  const [collaborator, setCollaborator] = useState<CollaboratorsType>();
  const { register, watch } = useForm();
  const [price, setPrice] = useState<number>(0);
  const [searchResults, setSearchResults] = useState([]);
  const [publishType, setPublishType] = useState<IntentType>("open_source");
  const [assignType, setAssignType] = useState<
    ASSIGN_TYPE.collaborator | ASSIGN_TYPE.global
  >(ASSIGN_TYPE.global);
  const [draftLoading, setDraftLoading] = useState<boolean>(false);
  const [collaboratorLoading, setCollaboratorLoading] =
    useState<boolean>(false);
  const [publishLoading, setPublishLoading] = useState<boolean>(false);
  const searchQuery = watch("query");
  const router = useRouter();

  const fetchResults = async (query: string) => {
    setLoading(true);
    const response = await fetch(
      `/api/v1/search/issue?r=${repoId}&q=${query || ""}`
    );
    const data = await response.json();
    setAfterText(query);
    setSearchResults(data);
    setLoading(false);
  };

  const debouncedFetchResults = useCallback(debounce(fetchResults, 500), []);

  function goBack() {
    setStep((prevState) => prevState - 1);
  }

  async function stepForward(id: string) {
    setStep(1.5);
    const res = await fetch(`/api/v1/issue/exist?id=${id}`, {
      method: "GET",
    });
    if (!res.ok) {
      setStep(1);
      return;
    }
    const data = await res.json();
    if (!data?.is_exist) {
      setStep(2);
      return;
    }
    if (data?.is_exist && data?.issue?.state === IssueState.inactive) {
      setTopics(data?.issue?.topics);
      setStep(2);
      return;
    }
    if (data?.is_exist && data?.issue?.state !== IssueState.draft) {
      setStep(1.75);
      return;
    }
    if (data?.is_exist && data?.issue?.state === IssueState.draft) {
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
    }
  }

  function stepTwo() {
    if (isEdit) {
      setStep(PUBLISH_STEP);
      setIsEdit(false);
      return;
    }
    setStep(3);
  }

  async function stepThree() {
    await draftPublish();
    if (isEdit) {
      setStep(PUBLISH_STEP);
      setIsEdit(false);
      return;
    }
    router.refresh();

    if (!isPrivate) {
      setStep(PUBLISH_STEP);
    }
    setStep(4);
  }

  async function stepFour() {
    if (assignType === ASSIGN_TYPE.collaborator) {
      await getCollaborators();
      setStep(4.5);
    } else {
      await draftPublish();
      if (isEdit) {
        setIsEdit(false);
      }
      setStep(PUBLISH_STEP);
    }
  }

  async function stepFourAndHalf() {
    if (isEdit) {
      setIsEdit(false);
    }
    await draftPublish();
    setStep(PUBLISH_STEP);
  }

  async function draftPublish() {
    setDraftLoading(true);
    const res = await fetch("/api/v1/issue/draft_publish", {
      method: "POST",
      body: JSON.stringify({
        topics,
        issueNumber: issue?.number,
        type: publishType,
        repoId,
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
    const res = await fetch(`/api/v1/repo/collaborators?repoId=${repoId}`);
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
        issueNumber: issue?.number,
        type: publishType,
        repoId,
        price,
        assignType,
        collaborator,
      }),
    });
    if (!res.ok) {
      setPublishLoading(false);
      return;
    }
    // const data = await res.json();
    router.refresh();
    setPublishLoading(false);
    setOpen(false);
  }

  useEffect(() => {
    // if (searchQuery === undefined || searchQuery?.length > 0) {
    debouncedFetchResults(searchQuery);
    // }
  }, [searchQuery, debouncedFetchResults]);
  return (
    <>
      {step === 1 && (
        <>
          <DialogHeader>
            <DialogTitle>Publish an issue</DialogTitle>
            <DialogDescription>
              Search using the complete issue title
            </DialogDescription>
          </DialogHeader>
          <div className=" relative flex flex-nowrap items-center rounded-md border px-3">
            <Search className="h-5 w-5" />
            <Input
              className=" w-full border-0 !outline-none  !ring-offset-0 focus-visible:ring-0"
              type="search"
              {...register("query")}
              placeholder="Search by entire issue title"
            />
            {loading && (
              <div className=" absolute right-3">
                <Icons.spinner className=" animate-spin" />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            {!!searchResults?.length ? (
              searchResults?.map((result: any) => (
                <div
                  key={result?.id}
                  className="group flex cursor-pointer flex-nowrap items-center justify-between gap-2 rounded px-3 py-2 hover:bg-accent"
                  onClick={() => {
                    setIssue(result);
                    stepForward(result?.id);
                  }}
                >
                  <div className="flex flex-nowrap gap-2">
                    <span className="mt-1 h-5 w-5">
                      <CircleDot className="h-5 w-5 text-green-500" />
                    </span>
                    <div className="flex flex-col">
                      <span className="text-lg">{result?.title}</span>
                      <span className="text-sm text-muted-foreground">
                        last updated at {formatDate(result?.updated_at)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="h-5 w-5">
                      <StepForward className=" h-5 w-5 text-muted-foreground group-hover:text-inherit" />
                    </span>
                  </div>
                </div>
              ))
            ) : !loading ? (
              <div className=" p-3 text-center italic text-muted-foreground">
                No open issue found {afterText && ` for "${afterText}"`}
              </div>
            ) : (
              <div className="p-3 text-center italic text-muted-foreground">
                Searching...
              </div>
            )}
          </div>
        </>
      )}
      {step === 1.5 && (
        <div className="flex h-[204px] items-center justify-center">
          <Icons.spinner className=" animate-spin" />
        </div>
      )}
      {step === 1.75 && (
        <>
          <DialogHeader>
            <DialogTitle className="flex flex-col">
              <Button
                size="sm"
                variant="link"
                className=" mb-1 w-fit px-0"
                onClick={() => setStep(1)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <span> {issue?.title}</span>
            </DialogTitle>
            <DialogDescription className="text-base">
              The issue already in board
            </DialogDescription>
            <div>
              <DialogTrigger asChild>
                <Button size="sm" variant="destructive">
                  Close
                </Button>
              </DialogTrigger>
            </div>
          </DialogHeader>
        </>
      )}
      {step === 2 && (
        <>
          <DialogHeader>
            <DialogTitle className="flex flex-col">
              {!isEdit ? (
                <Button
                  size="sm"
                  variant="link"
                  className=" mb-1 w-fit px-0"
                  onClick={goBack}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
              ) : (
                <span className="mb-2 flex items-center text-sm">
                  <Edit2 className="mr-1 h-3 w-3" /> editing
                </span>
              )}

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
              {isEdit ? "Update" : "Next"}
            </Button>
          </div>
        </>
      )}
      {step === 3 && (
        <>
          <DialogHeader>
            <DialogTitle className="flex flex-col">
              {!isEdit ? (
                <Button
                  size="sm"
                  variant="link"
                  className=" mb-1 w-fit px-0"
                  onClick={goBack}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
              ) : (
                <span className="mb-2 flex items-center text-sm">
                  <Edit2 className="mr-1 h-3 w-3" /> editing
                </span>
              )}

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
                    setPrice(0);
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
              disabled={!topics?.length || draftLoading}
              className="mt-4"
              onClick={stepThree}
            >
              {!draftLoading ? (
                isEdit ? (
                  "Update"
                ) : (
                  "Next"
                )
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
              {!isEdit ? (
                <Button
                  size="sm"
                  variant="link"
                  className=" mb-1 w-fit px-0"
                  onClick={goBack}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
              ) : (
                <span className="mb-2 flex items-center text-sm">
                  <Edit2 className="mr-1 h-3 w-3" /> editing
                </span>
              )}

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
                isEdit ? (
                  "Update"
                ) : (
                  "Next"
                )
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
                isEdit ? (
                  "Update"
                ) : (
                  "Next"
                )
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
                setIsEdit(true);
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
                  setIsEdit(true);
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
                setIsEdit(true);
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

const IssueImportModal = ({
  repoId,
  isPrivate,
}: {
  repoId: string;
  isPrivate: boolean;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className=" min-w-[170px] text-green-500 xl:text-lg"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Publish an issue
        </Button>
      </DialogTrigger>
      <DialogContent>
        <IssueImportModalContent
          repoId={repoId}
          setOpen={setOpen}
          isPrivate={isPrivate}
        />
      </DialogContent>
    </Dialog>
  );
};

export default IssueImportModal;
