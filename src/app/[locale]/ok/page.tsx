"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
  return null;
};

export default OkPage;
