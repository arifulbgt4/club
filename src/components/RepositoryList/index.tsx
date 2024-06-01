"use client";
import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import { type RepositoryListProps } from "./Types";
import { type Repository } from "@prisma/client";
import RepositoryItem from "../RepositoryItem";
import Pagination from "../sections/pagination";
import { Skeleton } from "../ui/skeleton";

const RepositoryList: FC<RepositoryListProps> = ({ page, orgId }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [res, setRes] = useState<any>();
  const [loading, setLoading] = useState(false);
  const getRepositorys = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/v1/repo/list?page=${page}${orgId ? `&orgId=${orgId}` : ""}`
      );
      const data = await res.json();
      setRes(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, [orgId, page]);

  const totalPages = useMemo(
    () => Math.ceil(res?.total / res?.take),
    [res?.take, res?.total]
  );

  useEffect(() => {
    getRepositorys();
  }, [getRepositorys]);

  if (loading)
    return (
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
        <Skeleton className="h-36 rounded-lg" />
        <Skeleton className="h-36 rounded-lg" />
        <Skeleton className="h-36 rounded-lg" />
      </div>
    );

  return (
    <div>
      <div className="flex gap-2">
        {res?.repositorys.map((repo: Repository) => (
          <RepositoryItem key={repo.id} {...repo} />
        ))}
      </div>
      {totalPages >= 2 && (
        <Pagination page={Number(page) || 1} totalPages={totalPages} />
      )}
    </div>
  );
};

export default RepositoryList;
