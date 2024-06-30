"use client";
import { useState, type FC } from "react";
import type { PublishFormProps } from "./Types";
import { useForm } from "react-hook-form";
import { cn } from "~/lib/utils";
import CurrencyInput from "react-currency-input-field";
import Payment from "../Payment";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { useRouter } from "next/navigation";
import { useStripe } from "@stripe/react-stripe-js";

type FormValues = {
  option: "free" | "paid";
  price?: string;
};

const pubSchema = z.object({
  option: z.string(),
  price: z.string({ required_error: "Pleasee" }),
});

const PublishForm: FC<PublishFormProps> = ({
  issueId,
  issueNumber,
  repoId,
  title,
}) => {
  const stripe = useStripe();
  const [minimum, setMinimum] = useState(false);
  const [payError, setPayError] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, watch, setValue, formState } =
    useForm<FormValues>({
      resolver: zodResolver(pubSchema),
      mode: "onChange",
    });
  const selectedOption = watch("option", "paid");
  const wPrice = watch("price", "0.00");
  const onSubmit = async (value: FormValues) => {
    if (value?.option === "paid") {
      if (!value.price) {
        setMinimum(true);
        return;
      }
      const ckPrice = value.price?.slice(1);
      if (
        ckPrice === "0.00" ||
        ckPrice === "0" ||
        !ckPrice ||
        Number(ckPrice) < 3
      ) {
        setMinimum(true);
        return;
      } else {
        if (minimum) {
          setMinimum(false);
        }
      }
    }
    const price = Number(value.price?.slice(1));
    try {
      console.log(price);
      if (value.option === "paid") {
        const paymentMethodRes = await fetch("/api/v1/stripe/primary", {
          method: "GET",
        });
        if (!paymentMethodRes.ok) {
          setPayError(true);
          return;
        }
        const paymentMethod = await paymentMethodRes.json();
        const intentRes = await fetch("/api/v1/stripe/intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ issueId, price }),
        });
        if (!intentRes.ok) {
          setPayError(true);
          return;
        }
        const intent = await intentRes.json();
        const payment = await stripe?.confirmCardPayment(intent.clientSecret, {
          payment_method: paymentMethod?.id,
        });
        if (payment?.error) {
          setPayError(true);
          return;
        }
        if (payment?.paymentIntent.status === "succeeded") {
          const pub = await fetch("/api/v1/issue/publish", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: issueId,
              issueNumber,
              repoId,
              title,
              price: price,
            }),
          });
          const data = await pub.json();
          router.push(`/issue/${data?.id}`);
        }
        return;
      }

      const res = await fetch("/api/v1/issue/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: issueId,
          issueNumber,
          repoId,
          title,
          price: 0,
        }),
      });
      const data = await res.json();
      router.push(`/issue/${data?.id}`);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={() => setValue("option", "paid")}
          className={`w-1/2 rounded-lg py-2 text-center ${
            selectedOption === "paid" ? "bg-blue-600" : "bg-gray-700"
          }`}
        >
          Paid
        </button>
        <button
          type="button"
          onClick={() => setValue("option", "free")}
          className={`w-1/2 rounded-lg py-2 text-center ${
            selectedOption === "free" ? "bg-blue-600" : "bg-gray-700"
          }`}
        >
          Free
        </button>
      </div>

      <input type="hidden" value={selectedOption} {...register("option")} />

      <div
        aria-disabled="true"
        className={cn(
          selectedOption === "free" &&
            "  pointer-events-none  opacity-80  grayscale filter",
          "my-2"
        )}
      >
        {selectedOption !== "free" && minimum && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Minimum $3 required</AlertTitle>
            <AlertDescription>
              A minimum of $3 is required to publish an issue
            </AlertDescription>
          </Alert>
        )}
        <div className=" rounded p-2">
          <div className="flex justify-between">
            <Payment />

            {selectedOption !== "free" ? (
              <CurrencyInput
                id="input-example"
                className=" flex w-40 rounded-md border border-gray-600 border-input bg-gray-700 px-3 py-2  text-lg font-medium ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-lg placeholder:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="$0.00"
                defaultValue={0}
                prefix="$"
                decimalsLimit={2}
                decimalScale={2}
                {...register("price", { required: selectedOption === "paid" })}
              />
            ) : (
              <CurrencyInput
                id="input-example"
                className=" flex w-40 rounded-md border border-gray-600 border-input bg-gray-700 px-3 py-2  text-lg font-medium ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-lg placeholder:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="$0.00"
                value="0.00"
                prefix="$"
                decimalsLimit={2}
                decimalScale={2}
              />
            )}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        disabled={
          (selectedOption !== "free" &&
            (wPrice === "$0.00" ||
              wPrice === "$0" ||
              !wPrice ||
              !formState.isDirty)) ||
          formState.isSubmitting
        }
      >
        Submit
      </button>
    </form>
  );
};

export default PublishForm;
