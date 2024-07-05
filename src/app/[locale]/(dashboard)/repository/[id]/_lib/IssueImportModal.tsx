/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CircleDot, PlusCircle, Search, StepForward } from "lucide-react";
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
import { useForm } from "react-hook-form";
import debounce from "lodash/debounce";
import { Input } from "~/components/ui/input";
import Icons from "~/components/shared/icons";

const IssueImportModal = ({ repoId }: { repoId: string }) => {
  const [loading, setLoading] = useState(false);
  const { register, watch } = useForm();
  const [searchResults, setSearchResults] = useState([]);

  const searchQuery = watch("query");

  const fetchResults = async (query: string) => {
    setLoading(true);
    const response = await fetch(
      `/api/v1/search/issue?r=${repoId}&q=${query || ""}`
    );
    const data = await response.json();
    setSearchResults(data);
    setLoading(false);
  };

  const debouncedFetchResults = useCallback(debounce(fetchResults, 300), []);

  useEffect(() => {
    debouncedFetchResults(searchQuery);
  }, [searchQuery, debouncedFetchResults]);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" variant="ghost" className="text-lg text-green-500">
          <PlusCircle className="mr-2 h-5 w-5" />
          Publish an issue
        </Button>
      </DialogTrigger>
      <DialogContent>
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
          ) : (
            <div className=" p-3 text-center italic text-muted-foreground">
              No open issue found {searchQuery && ` for "${searchQuery}"`}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IssueImportModal;
