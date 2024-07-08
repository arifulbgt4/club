"use client";
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowLeft, Edit2, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import React, { useState, useEffect, useCallback } from "react";
import Icons from "~/components/shared/icons";
import Select from "react-select/async";
import { cn } from "~/lib/utils";
import { type Issue, type IssueType } from "@prisma/client";
import { useRouter } from "next/navigation";

const UPDATE_STEP = 4;

const IssueImportModalContent = ({
  setOpen,
  issueId,
}: {
  issueId: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [step, setStep] = useState<number>(1);
  const [issue, setIssue] = useState<Issue>();
  const [inputValue, setInputValue] = useState<string>("");
  const [topics, setTopics] = useState<string[]>([]);
  const [price, setPrice] = useState<number>(0);
  const [publishType, setPublishType] = useState<IssueType>("free");
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const router = useRouter();

  const fetchResults = async () => {
    const response = await fetch(`/api/v1/issue/exist?id=${issueId}`, {
      method: "GET",
    });
    const data = await response.json();
    setIssue(data?.issue);
    setPublishType(data?.issue?.type as IssueType);
    setTopics(data?.issue?.topics);
    setStep(UPDATE_STEP);
  };

  const fetchIssue = useCallback(fetchResults, []);

  function goBack() {
    setStep(UPDATE_STEP);
  }

  const loadOptions = async (inputValue: string) => {
    if (!inputValue) return [];
    const res = await fetch(`/api/v1/search/topics?q=${inputValue}`, {
      method: "GET",
    });
    if (!res.ok) {
      return;
    }
    const topics = await res.json();
    return topics?.map((topic: { name: string }) => ({
      label: topic.name,
      value: topic.name,
    }));
  };

  const removeTopic = (t: string) => {
    if (topics?.length <= 1) {
      return setTopics([]);
    }
    setTopics((pre) => pre.filter((v) => v !== t));
  };

  function stepTwo() {
    setStep(UPDATE_STEP);
  }

  async function stepThree() {
    setStep(UPDATE_STEP);
  }

  async function onUpdate() {
    setUpdateLoading(true);
    const res = await fetch("/api/v1/issue/publish", {
      method: "POST",
      body: JSON.stringify({
        topics,
        issueNumber: issue?.issueNumber,
        type: publishType,
        repoId: issue?.repositoryId,
        price,
      }),
    });
    if (!res.ok) {
      setUpdateLoading(false);
      return;
    }
    router.refresh();
    setUpdateLoading(false);
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

          <div className="flex min-h-12 w-full flex-wrap items-center gap-2 rounded-lg border px-2 py-1">
            <div className="flex flex-wrap gap-1">
              {topics?.map((p, i) => (
                <Button
                  key={i}
                  size="sm"
                  onClick={() => removeTopic(p)}
                  className="h-6 px-2 hover:text-destructive"
                >
                  {p}
                  <X className="ml-1 h-4 w-4" />
                </Button>
              ))}
            </div>
            <Select
              value=""
              className="  bg-transparent"
              classNames={{
                indicatorsContainer: () => "w-0 !hidden",
                control: () =>
                  "!bg-transparent !border-0 !shadow-none !cursor-text",
                valueContainer: () => "!p-0",
                input: () => "!text-inherit !p-0",
                menu: () => "!bg-accent !text-inherit !w-[240px]",
                option: ({ isFocused }) =>
                  isFocused
                    ? "!bg-accent-foreground !text-accent"
                    : "!bg-transparent !text-inherit",
              }}
              onChange={(v: any) => setTopics([...topics, v?.value])}
              inputValue={inputValue}
              placeholder="Search topics"
              noOptionsMessage={() => <p>Search topics</p>}
              loadingMessage={() => (
                <div className=" flex justify-center">
                  <Icons.spinner className=" animate-spin" />
                </div>
              )}
              onInputChange={(newValue) => setInputValue(newValue)}
              loadOptions={loadOptions}
              defaultOptions={false}
              cacheOptions
            />
          </div>
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
                    setPublishType("free");
                  }
                }}
                className={cn(
                  publishType === "free" && "pointer-events-none bg-accent",
                  "flex cursor-pointer flex-nowrap items-center gap-2 rounded-md border p-3 hover:bg-accent"
                )}
              >
                <span className=" flex h-5 w-5 items-center justify-center rounded-full border-2 border-accent-foreground">
                  {publishType === "free" && (
                    <span className=" h-3 w-3 rounded-full bg-accent-foreground"></span>
                  )}
                </span>
                <span className="text-lg font-semibold">Free</span>
              </div>
              <div
                onClick={() => {
                  if (publishType === "free") {
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
              disabled={!topics?.length}
              className="mt-4"
              onClick={stepThree}
            >
              Update
            </Button>
          </div>
        </>
      )}
      {step === UPDATE_STEP && (
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
            {publishType === "free" ? (
              <div className="pointer-events-none flex cursor-pointer flex-nowrap items-center gap-2 rounded-md border bg-accent p-3">
                <span className=" flex h-5 w-5 items-center justify-center rounded-full border-2 border-accent-foreground">
                  <span className=" h-3 w-3 rounded-full bg-accent-foreground"></span>
                </span>
                <span className="text-lg font-semibold">Free</span>
              </div>
            ) : (
              <div className="pointer-events-none flex cursor-pointer flex-nowrap items-center gap-2 rounded-md border bg-accent p-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-accent-foreground">
                  <span className=" h-3 w-3 rounded-full bg-accent-foreground"></span>
                </span>
                <span className="text-lg font-semibold">Paid</span>
              </div>
            )}
          </div>

          <Button
            disabled={updateLoading || (publishType === "paid" && price < 3)}
            onClick={onUpdate}
          >
            {!updateLoading ? (
              "Update & Refresh"
            ) : (
              <Icons.spinner className=" animate-spin" />
            )}
          </Button>
        </>
      )}
    </>
  );
};

const EditModal = ({ issueId }: { issueId: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className=" rounded-full">
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <IssueImportModalContent issueId={issueId} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;
