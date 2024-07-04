"use client";
import { useEffect } from "react";

const OkPage = () => {
  useEffect(() => {
    if (window !== undefined) {
      window.opener.location.reload();
      window.close();
    }
  }, []);
  return null;
};

export default OkPage;
