"use client";
import React, { type FC, memo, useCallback, useEffect, useState } from "react";
import Icons from "../shared/icons";
import AttachPaymentMethod from "../AttachPaymentMethod";
import getPaymentMethodIcon from "../shared/payment-method-icons";
import { Info } from "lucide-react";
import Link from "next/link";
import type { PaymentProps } from "./Types";
import CurrencyInput from "react-currency-input-field";
import { siteConfig } from "~/config/site";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const Payment: FC<PaymentProps> = ({ value, onChange }) => {
  const [price, setPrice] = useState<number>(value || 0);
  const [haveMethod, setHaveMethod] = useState<boolean>(false);
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
    if (data?.status === 401) {
      setLoading(false);
      return;
    }
    if (data?.status === 301) {
      setHaveMethod(false);
      setPrice(0);
      !!onChange && onChange(0);
      setLoading(false);
      return;
    }
    setHaveMethod(true);
    setCard(data);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update]);

  const changePrice = useCallback((v: string) => {
    let p = 0;
    if (v.includes("$")) {
      const s = v.split("$");
      p = Number(s[1]);
    } else {
      p = Number(v);
    }
    if (!Number.isNaN(p)) {
      setPrice(p);
      !!onChange && onChange(p);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getCard();
  }, [getCard]);

  if (loading)
    return (
      <div className=" flex h-[70px] items-center justify-center rounded">
        <Icons.spinner className=" animate-spin" />
      </div>
    );

  return (
    <div className=" flex w-full  flex-col">
      {haveMethod ? (
        <div className=" flex flex-col py-2 pl-1">
          <div className="mb-1 flex items-center">
            <div className=" scale-125">
              {getPaymentMethodIcon(card?.brand as string)()}
            </div>

            <span className=" ml-4 font-mono text-sm tracking-wide">
              <span className=" mr-3 uppercase"> {card?.brand}</span> ••••{" "}
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
        </div>
      ) : (
        <Elements stripe={stripePromise}>
          <AttachPaymentMethod onUpdate={setUpdate} />
        </Elements>
      )}
      <div className=" mt-1 flex flex-col gap-1">
        <span className=" font-mono font-semibold">Price</span>
        <CurrencyInput
          id="input-amount"
          className=" flex w-40 rounded-md border border-gray-600 border-input bg-accent px-3 py-2  font-mono text-lg font-medium ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-lg placeholder:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="$0.00"
          defaultValue={price}
          disabled={!haveMethod}
          prefix="$"
          decimalsLimit={2}
          decimalScale={2}
          onChange={(e) => changePrice(e?.target?.value)}
        />
        {price !== 0 && price < siteConfig().minimumAmount && (
          <p className=" text-destructive">
            The minimum required amount is ${siteConfig().minimumAmount}
          </p>
        )}
      </div>
    </div>
  );
};

export default memo(Payment);
