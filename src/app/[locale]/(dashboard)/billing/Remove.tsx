"use client";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";

const Remove = ({ id }: { id: string }) => {
  const router = useRouter();
  async function removeMethod() {
    await fetch("/api/v1/stripe/remove", {
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
      className=" text-red-500 hover:text-red-600"
      onClick={removeMethod}
    >
      Remove
    </Button>
  );
};

export default Remove;
