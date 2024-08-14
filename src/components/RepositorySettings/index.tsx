"use client";
import React from "react";
import DeleteRepository from "./DeleteRepository";
import type { RepositorySettingsProps } from "./Types";

export default function RepositorySettings({
  repoId,
}: RepositorySettingsProps) {
  return (
    <div className="h-[calc(100vh - 168px)] overflow-y-scroll border-t py-3">
      <DeleteRepository repoId={repoId} />
    </div>
  );
}
