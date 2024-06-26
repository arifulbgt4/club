"use client";
import { Button } from "~/components/ui/button";

const PaymentPage = () => {
  async function connect() {
    const res = await fetch("/api/auth/stripe/link", { method: "GET" });
    const url = await res.json();
    console.log("first:1", url);
    window.location.href = url;
  }
  return (
    <div>
      <Button onClick={connect}>Connect Stripe account</Button>
    </div>
  );
};

export default PaymentPage;
