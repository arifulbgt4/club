"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Icons from "~/components/shared/icons";
import { Button } from "~/components/ui/button";
import { toast } from "~/components/ui/use-toast";

const Remove = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  async function removeMethod() {
    setLoading(true);
    const res = await fetch("/api/v1/stripe/remove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentMethodId: id }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.log("text", text);
      toast({
        title:
          "If you have unpaid issues, please ensure you have a valid payment method on file",
        description: text,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    router.refresh();
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      className=" text-red-500 hover:text-red-600"
      onClick={removeMethod}
    >
      {loading ? <Icons.spinner className="animate-spin" /> : "Remove"}
    </Button>
  );
};

export default Remove;
