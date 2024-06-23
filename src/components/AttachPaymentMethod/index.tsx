/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const AttachPaymentMethod = () => {
  const stripe = useStripe() as any;
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setLoading(true);

    // Create a payment method
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements?.getElement(CardElement),
    });

    if (error) {
      console.error(error.message);
      setLoading(false);
      return;
    }

    await fetch("/api/v1/stripe/payment-method", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentMethodId: paymentMethod.id }),
    });

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              iconColor: "#c4f0ff",
              color: "#fff",
              fontWeight: "500",
              fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
              fontSize: "16px",
              fontSmoothing: "antialiased",
              ":-webkit-autofill": {
                color: "#fce883",
              },
              "::placeholder": {
                color: "#87BBFD",
              },
            },
            invalid: {
              iconColor: "#FFC7EE",
              color: "#FFC7EE",
            },
          },
        }}
      />
      <button type="submit" disabled={!stripe || loading}>
        Pay
      </button>
    </form>
  );
};

export default AttachPaymentMethod;
