"use client";
import React, { cache, memo, useCallback, useEffect, useState } from "react";
import Icons from "../shared/icons";
import AttachPaymentMethod from "../AttachPaymentMethod";
import getPaymentMethodIcon from "../shared/payment-method-icons";
import { Info } from "lucide-react";
import Link from "next/link";

const Payment = () => {
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [card, setCard] = useState<{ brand?: string; last4?: string }>();
  const getCard = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/v1/stripe/primary", { method: "GET" });
    if (!res.ok) {
      setLoading(false);
      return;
    }
    const data = await res.json();
    setCard(data);
    setLoading(false);
  }, [update]);

  useEffect(() => {
    getCard();
  }, [getCard]);

  if (loading)
    return (
      <div className=" flex h-[70px] w-64 items-center justify-center rounded border">
        <Icons.spinner className=" animate-spin" />
      </div>
    );

  return (
    <div className=" flex w-fit max-w-96  flex-col rounded border p-2.5 pl-4">
      {card?.last4 ? (
        <>
          <div className="mb-2 flex items-center">
            <div className=" scale-150">
              {getPaymentMethodIcon(card?.brand as string)()}
            </div>

            <span className=" ml-4 font-medium">
              <span className=" capitalize"> {card?.brand}</span> ending in{" "}
              {card?.last4}
            </span>
          </div>
          <span className=" -ml-1 flex items-center text-xs text-muted-foreground">
            <Info className="mr-1 h-3 w-3" />
            Update payment methods in
            <Link href="/billing" className=" ml-1 text-blue-500 underline">
              Billing page
            </Link>
          </span>
        </>
      ) : (
        <AttachPaymentMethod onUpdate={setUpdate} />
      )}
    </div>
  );
};

export default memo(Payment);
