"use client";
import { Button } from "~/components/ui/button";

const DisConnection = () => {
  async function connect() {
    const res = await fetch("/api/v1/stripe/disconnect", { method: "GET" });
    const url = await res.json();
    console.log("first:dfg ", url);
  }
  return (
    <div>
      <Button onClick={connect}>Disconnect</Button>
    </div>
  );
};

export default DisConnection;
