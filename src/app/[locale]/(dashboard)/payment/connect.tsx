"use client";
import { Button } from "~/components/ui/button";

const Connection = () => {
  async function connect() {
    const res = await fetch("/api/auth/stripe/link", { method: "GET" });
    const url = await res.json();
    window.location.href = url;
  }
  return (
    <div>
      <Button onClick={connect}>Connect Stripe account</Button>
    </div>
  );
};

export default Connection;
