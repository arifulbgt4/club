/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowLeft, CircleDot, Search, StepForward, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import debounce from "lodash/debounce";
import { Input } from "~/components/ui/input";
import Icons from "~/components/shared/icons";
import Select from "react-select/async";

const IssueImportModal = ({ repoId }: { repoId: string }) => {
  const [step, setStep] = useState<number>(1);
  const [issue, setIssue] = useState<any>({});
  const [inputValue, setInputValue] = useState("");
  const [afterText, setAfterText] = useState<string>("");
  const [topics, setTopics] = useState<string[]>([]);
  const [stepLoading, setStepLoading] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { register, watch } = useForm();
  const [searchResults, setSearchResults] = useState([]);

  const searchQuery = watch("query");

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

  useEffect(() => {
    debouncedFetchResults(searchQuery);
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
                    setStep(2);
                  }}
                >
                  <div className="flex flex-nowrap gap-2">
                    <span className="mt-1 h-5 w-5">
                      <CircleDot className="h-5 w-5 text-green-500" />
                    </span>
                    <span className="text-lg">{result?.title}</span>
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
            <div>
              <div className="flex min-h-12 w-full items-center gap-2 rounded-lg border px-2 py-1">
                <div className="flex">
                  {topics?.map((p, i) => (
                    <Button
                      key={i}
                      size="sm"
                      onClick={() => removeTopic(p)}
                      className="mx-1 h-6 px-2 hover:text-destructive"
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

              <Button className="mt-4">Next</Button>
            </div>
          </DialogHeader>
        </>
      )}
    </>
  );
};

export default IssueImportModal;
