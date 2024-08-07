"use client";

import { useState } from "react";
import { Modal, ModalBody, ModalButtons, ModalHeader } from "../Modal";
import { SvgIcon } from "../SvgIcon";
import { Button } from "../Button";
import StripeCheckoutForm from "../CheckoutForm";
import { usePayment } from "../../lib/hooks/usePayment";

const premiumFeatures = [
  "Can use any premium generative AI models",
  "Multiple models at the same time",
  "Full text search for chat history",
  "No API key required",
  "Priority customer support",
];

const PaymentModal = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPrice, setSelectedPrice] = useState(
    process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID,
  );

  const { isOpen, onClose } = usePayment();

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const previousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handlePaymentSuccess = () => {
    setCurrentStep(2);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[448px] w-full">
      {currentStep === 0 && (
        <>
          <ModalHeader title="Payment" titleAlign="left" />
          <ModalBody className="mb-8 mt-6">
            <div className="flex w-full flex-col gap-4">
              <div className="w-full rounded-2xl bg-foreground-subtle px-4 py-5">
                <div className="flex gap-4">
                  <div className="flex-center h-14 w-14 rounded-xl bg-foreground-inset">
                    <SvgIcon
                      name="ticketStar"
                      className="text-accent-foreground"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-subtitle2 text-canvas">
                      Generative AI subscription
                    </p>
                    <p className="text-subtitle4 text-border-muted">
                      Become a premium user
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full rounded-2xl bg-foreground-subtle p-4">
                <div className="flex flex-col gap-4">
                  {premiumFeatures.map((feature, index) => (
                    <div className="flex gap-3" key={index}>
                      <SvgIcon
                        name="checkCircle"
                        className="text-accent-foreground"
                      />
                      <p className="text-subtitle4 flex-center text-border-muted">
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex h-[116px] w-full flex-col gap-4 rounded-2xl bg-foreground-subtle p-4">
                <p className="text-subtitle5 text-canvas">
                  Select the period of use
                </p>
                <div className="flex-center h-[52px] w-full gap-4">
                  <Button
                    className={`h-full w-full rounded-lg ${
                      selectedPrice ===
                      process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID
                        ? "border border-accent-foreground bg-accent-emphasis text-accent-foreground"
                        : "bg-foreground-subtle text-border-muted"
                    }`}
                    onClick={() =>
                      setSelectedPrice(
                        process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID,
                      )
                    }
                  >
                    $9.99 / month
                  </Button>
                  <Button
                    className={`h-full w-full rounded-lg ${
                      selectedPrice ===
                      process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID
                        ? "border border-accent-foreground bg-accent-emphasis text-accent-foreground"
                        : "bg-foreground-subtle text-border-muted"
                    }`}
                    onClick={() =>
                      setSelectedPrice(
                        process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID,
                      )
                    }
                  >
                    $99.99 / year
                  </Button>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalButtons
            modalButtonClassName="w-full h-12 flex-center"
            buttons={[
              {
                text: "Confirm",
                onClick: nextStep,
                iconRight: "arrowTopRight",
                className:
                  "flex-center w-full rounded-[40px] h-full hover:bg-accent-muted hover:border-accent-foreground hover:border-2 ",
                childrenClassName: "text-foreground hover",
                primary: true,
              },
            ]}
          />
        </>
      )}
      {currentStep === 1 && (
        <>
          <ModalHeader
            title="Card details"
            subtitle="Enter the card details"
            titleAlign="left"
            subtitleAlign="left"
            icon={
              <button
                className="flex-center h-5 w-[66px] gap-3"
                onClick={previousStep}
              >
                <SvgIcon name="arrowLeft" className="text-accent-foreground" />
                <p className="text-subtitle4 text-accent-foreground">Back</p>
              </button>
            }
          />
          <ModalBody className="mt-6">
            <StripeCheckoutForm priceId={selectedPrice!} onSuccess={handlePaymentSuccess} />
          </ModalBody>
        </>
      )}
      {currentStep === 2 && (
        <>
          <ModalHeader title="Thank You!" titleAlign="center" titleClassName="text-4xl font-bold"/>
          <ModalBody className="mt-6">
            <div className="flex flex-col items-center gap-4">
              <SvgIcon name="checkCircle" className="text-green-500 h-200 w-200" />
              <p className="text-center text-subtitle2 text-canvas">
                Your payment was successful
              </p>
              <Button
                onClick={onClose}
                className="mt-8 w-full h-12 rounded-[80px] bg-accent-muted"
              >
                Close
              </Button>
            </div>
          </ModalBody>
        </>
      )}
    </Modal>
  );
};

export default PaymentModal;
