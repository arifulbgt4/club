"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Icons from "~/components/shared/icons";

const OkPage = () => {
  const router = useRouter();
  useEffect(() => {
    if (window !== undefined) {
      if (!!window?.opener?.location) {
        window.opener.location.reload();
        window.close();
      }
      {
        router.push("/");
      }
    }
  }, []);
  return (
    <div className="flex flex-1 items-center justify-center">
      <Icons.spinner className=" h-9 w-9 animate-spin" />
    </div>
  );
};

export default OkPage;
