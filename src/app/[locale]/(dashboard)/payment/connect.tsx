"use client";
import { useState } from "react";
import Icons from "~/components/shared/icons";
import { Button } from "~/components/ui/button";

const Connection = () => {
  const [loading, setLoading] = useState(false);
  async function connect() {
    setLoading(true);
    const res = await fetch("/api/auth/stripe/link", { method: "GET" });
    const url = await res.json();
    window.location.href = url;
  }
  return (
    <div>
      <Button onClick={connect}>
        {!loading ? (
          "Connect Stripe account"
        ) : (
          <Icons.spinner className=" animate-spin" />
        )}
      </Button>
    </div>
  );
};

export default Connection;
