/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Icons from "~/components/shared/icons";

const RefreshPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const location = searchParams.get("l");
  useEffect(() => {
    if (window !== undefined && !!location) {
      window.location.reload();
      window.location.href = location;
    } else {
      router.push("/");
    }
  }, []);
  return (
    <div className="flex flex-1 items-center justify-center">
      <Icons.spinner className=" h-9 w-9 animate-spin" />
    </div>
  );
};

export default RefreshPage;
