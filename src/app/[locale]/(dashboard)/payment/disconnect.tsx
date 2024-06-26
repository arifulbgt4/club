"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Icons from "~/components/shared/icons";
import { Button } from "~/components/ui/button";

const DisConnection = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  async function connect() {
    setLoading(true);
    const res = await fetch("/api/v1/stripe/disconnect", { method: "GET" });
    if (res.ok) {
      router.refresh();
    }
    // setLoading(false)
  }
  return (
    <div>
      <Button onClick={connect}>
        {!loading ? "Disconnect" : <Icons.spinner className=" animate-spin" />}
      </Button>
    </div>
  );
};

export default DisConnection;
