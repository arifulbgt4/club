/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useMemo, useState } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  AddressElement,
} from "@stripe/react-stripe-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "../ui/button";
import Icons from "../shared/icons";
import { PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import getPaymentMethodIcon from "~/components/shared/payment-method-icons";

import { cn } from "~/lib/utils";

const AttachPaymentMethod = ({
  onUpdate,
}: {
  onUpdate?: (v: boolean) => void;
}) => {
  const [open, setOpen] = useState(false);
  const stripe = useStripe() as any;
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [cardType, setCardType] = useState("");
  const [addressError, setAddressError] = useState("");
  const [cardErrors, setCardErrors] = useState({
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });

  const router = useRouter();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setLoading(true);
    const cardNumber = elements.getElement(CardNumberElement);
    const addressElement = elements.getElement(AddressElement);

    const billingInfo = await addressElement?.getValue();

    // Create a payment method
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardNumber,
      billing_details: {
        address: billingInfo?.value?.address,
        name: billingInfo?.value?.name,
      },
    });

    if (error || !billingInfo?.complete) {
      setAddressError("Please complete the address form");
      setLoading(false);
      return;
    }

    await fetch("/api/v1/stripe/payment-method", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentMethodId: paymentMethod.id }),
    });
    addressElement?.clear();
    setAddressError("");
    setLoading(false);
    setOpen(false);
    setCardType("");
    onUpdate && onUpdate(true);
    router.refresh();
  };

  const handleCardNumberChange = (event: any) => {
    if (event.error) {
      setCardErrors((prevState) => ({
        ...prevState,
        cardNumber: event.error.message,
      }));
    } else {
      setCardErrors((prevState) => ({ ...prevState, cardNumber: "" }));
    }

    setCardType(event.brand);
  };

  const handleCardExpiryChange = (event: any) => {
    if (event.error) {
      setCardErrors((prevState) => ({
        ...prevState,
        cardExpiry: event.error.message,
      }));
    } else {
      setCardErrors((prevState) => ({ ...prevState, cardExpiry: "" }));
    }
  };

  const handleCardCvcChange = (event: any) => {
    if (event.error) {
      setCardErrors((prevState) => ({
        ...prevState,
        cardCvc: event.error.message,
      }));
    } else {
      setCardErrors((prevState) => ({ ...prevState, cardCvc: "" }));
    }
  };

  const inputStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  const methodIcon = useMemo(
    () => <span className=" w-6">{getPaymentMethodIcon(cardType)()}</span>,
    [cardType]
  );

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <PlusCircleIcon className="mr-2 h-5 w-5" /> Add a billing method
        </Button>
      </DialogTrigger>
      <DialogContent className=" liting max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Add a billing methode</DialogTitle>
          <DialogDescription>
            Visa, Mastercard, American Express, Discover, Diners
          </DialogDescription>
        </DialogHeader>
        <form className=" flex flex-1 flex-col" onSubmit={handleSubmit}>
          {/* {message && <div id="payment-message">{message}</div>} */}
          <div className=" mb-4 flex flex-col">
            <label
              htmlFor="card-number"
              className=" mb-1 text-sm font-semibold"
            >
              Card Number
            </label>
            <div
              className={cn(
                cardErrors.cardNumber && "border-destructive",
                " flex flex-nowrap items-center gap-3 rounded border p-2.5 shadow-sm"
              )}
            >
              {methodIcon}
              <CardNumberElement
                id="card-number"
                options={inputStyle}
                className="w-full"
                onChange={handleCardNumberChange}
              />
            </div>
            {cardErrors.cardNumber && (
              <div className=" text-sm text-destructive">
                {cardErrors.cardNumber}
              </div>
            )}
          </div>
          <div className="mb-6 flex">
            <div className=" flex w-[60%] flex-col">
              <label
                htmlFor="card-expiry"
                className=" mb-1 text-sm font-semibold"
              >
                Expiration Date
              </label>
              <CardExpiryElement
                id="card-expiry"
                options={inputStyle}
                onChange={handleCardExpiryChange}
                className={cn(
                  cardErrors.cardExpiry && "border-destructive",
                  " rounded border p-3 shadow-sm"
                )}
              />
              {cardErrors.cardExpiry && (
                <div className=" text-sm text-destructive">
                  {cardErrors.cardExpiry}
                </div>
              )}
            </div>
            <div className=" ml-3 flex w-[40%] flex-col">
              <label htmlFor="card-cvc" className=" mb-1 text-sm font-semibold">
                CVC
              </label>
              <CardCvcElement
                id="card-cvc"
                options={inputStyle}
                onChange={handleCardCvcChange}
                className={cn(
                  cardErrors.cardCvc && "border-destructive",
                  " rounded border p-3 shadow-sm"
                )}
              />
              {cardErrors.cardCvc && (
                <div className=" text-sm text-destructive">
                  {cardErrors.cardCvc}
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            {!!addressError && (
              <div className=" mb-1 text-sm text-destructive">
                {addressError}
              </div>
            )}
            <AddressElement options={{ ...inputStyle, mode: "billing" }} />
          </div>

          <Button
            type="submit"
            variant="secondary"
            disabled={!stripe || loading}
          >
            {!stripe || loading ? (
              <Icons.spinner className=" animate-spin" />
            ) : (
              "Save"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AttachPaymentMethod;
