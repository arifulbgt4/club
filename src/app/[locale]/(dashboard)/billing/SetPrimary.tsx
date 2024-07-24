"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Icons from "~/components/shared/icons";
import { Button } from "~/components/ui/button";

export default function SetPrimary({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  async function removeMethod() {
    setLoading(true);
    await fetch("/api/v1/stripe/primary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentMethodId: id }),
    });
    router.refresh();
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      className=" text-green-500 hover:text-green-600"
      onClick={removeMethod}
    >
      {loading ? <Icons.spinner className="animate-spin" /> : "Set as primary"}
    </Button>
  );
}
