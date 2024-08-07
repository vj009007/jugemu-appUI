"use client";

import { useState } from "react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "./Button";
import {
  createSubscription,
  getSubscriptionsWithPaymentByCustomerId,
  getStripeSubscriptionsByCustomerId,
  updateSubscription,
} from "../actions/stripe/supscription";
import { checkAndCreateCustomer } from "../actions/stripe/customer";
import { classNames } from "../utils/helper";
import Stripe from "stripe";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

type CheckoutFormProps = {
  priceId: string;
  onSuccess: () => void;
};

const CheckoutForm = ({ priceId, onSuccess }: CheckoutFormProps) => {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "success" | "error" | "existing"
  >("idle");

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setIsLoading(false);
      return;
    }

    try {
      const customerData = await checkAndCreateCustomer(name);
      const customerId = customerData.id;

      if (!customerId) {
        throw new Error("Customer ID not found");
      }

      const subscriptionsWithPayment =
        await getSubscriptionsWithPaymentByCustomerId(customerId);

      if (subscriptionsWithPayment) {
        setPaymentStatus("existing");
        return;
      }

      const existingSubscriptions =
        await getStripeSubscriptionsByCustomerId(customerId);

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card Element not found");

      const { paymentMethod, error: pmError } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
          billing_details: {
            name: customerData.name,
            email: customerData.email,
          },
        });

      if (pmError) throw pmError;

      const paymentMethodId = paymentMethod.id;
      if (existingSubscriptions.length > 0) {
        await updateSubscription(customerId, priceId, paymentMethodId);
        onSuccess();
      } else {
        const subscriptionData = await createSubscription(
          customerId,
          priceId,
          paymentMethodId,
        );
        const clientSecret = subscriptionData.clientSecret as Stripe.Invoice;
        const paymentIntent =
          clientSecret.payment_intent as Stripe.PaymentIntent;
        const intentSecret = paymentIntent.client_secret;

        if (clientSecret && intentSecret) {
          const { paymentIntent: confirmedPaymentIntent, error: confirmError } =
            await stripe.confirmCardPayment(intentSecret);

          if (confirmError) throw confirmError;

          if (
            confirmedPaymentIntent &&
            confirmedPaymentIntent.status === "succeeded"
          ) {
            onSuccess();
          }
        }
      }
    } catch (error: any) {
      setError(error.message);
      setPaymentStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form id="signup-form" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <input
          className="border-muted text-subtitle4 h-[52px] w-full rounded-[80px] border bg-transparent p-4 text-canvas focus:outline-none"
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="border-muted h-[52px] w-full rounded-[80px] border p-4">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "14px",
                  color: "#FFFFFF",
                  letterSpacing: "0.025em",
                  fontFamily: "Source Code Pro, monospace",
                  "::placeholder": {
                    color: "rgba(255, 255, 255, 0.4)",
                  },
                },
                complete: {
                  color: "#4caf50",
                },
                empty: {
                  color: "#ff9800",
                },
                invalid: {
                  color: "#f44336",
                },
              },
            }}
          />
        </div>
      </div>

      {paymentStatus !== "success" && paymentStatus !== "existing" && (
        <Button
          loading={isLoading}
          primary={true}
          type="submit"
          disabled={!stripe || isLoading}
          rightIcon="arrowTopRight"
          className="mt-8 h-12 w-full rounded-[80px] hover:border-2 hover:border-accent-foreground hover:bg-accent-muted"
        >
          <p className={classNames("mx-3 font-medium")}>Pay</p>
        </Button>
      )}

      {paymentStatus === "existing" && (
        <p className="flex-center mt-8 h-12 w-full rounded-[80px] text-canvas">
          You are already subscribed Jugemu
        </p>
      )}
      {paymentStatus === "error" && error && (
        <p className="flex-center mt-8 h-12 w-full rounded-[80px] text-[#f44336]">
          {error}
        </p>
      )}
    </form>
  );
};

const StripeCheckoutForm = ({
  priceId,
  onSuccess,
}: {
  priceId: string;
  onSuccess: () => void;
}) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm priceId={priceId} onSuccess={onSuccess} />
  </Elements>
);

export default StripeCheckoutForm;
