"use server";

import { createUserSubscription } from "../users";
import stripe from "../../utils/stripe";

export async function createSubscription(
  customerId: string,
  priceId: string,
  paymentMethodId: string,
) {
  try {
    const stripeSubscription = await createStripeSubscription(
      customerId,
      priceId,
      paymentMethodId,
    );
    createUserSubscription(stripeSubscription.subscriptionId);
    return stripeSubscription;
  } catch (error) {
    throw new Error("Failed to create subscription");
  }
}

export async function getSubscriptionsWithPaymentByCustomerId(
  customerId: string,
): Promise<boolean> {
  try {
    const subscriptions = await getStripeSubscriptionsByCustomerId(customerId);

    if (subscriptions.length === 0) {
      return false;
    }

    for (const subscription of subscriptions) {
      try {
        const invoices = await getInvoicesBySubscriptionId(subscription.id);

        if (invoices.data.length === 0) {
          continue;
        }

        for (const invoice of invoices.data) {
          if (typeof invoice.charge === "string") {
            const charge = await getChargeById(invoice.charge);
            if (!charge.refunded && charge.paid) {
              return true; // Subscription with valid charge found
            }
          }
        }
      } catch (error) {
        console.error(
          `Error retrieving invoice or charge for subscription ${subscription.id}:`,
          error,
        );
      }
    }

    return false; // No valid subscriptions found
  } catch (error) {
    console.error("Error retrieving subscriptions or related data:", error);
    throw new Error((error as Error).message);
  }
}

export async function updateSubscription(
  customerId: string,
  priceId: string,
  paymentMethodId: string,
) {
  const updateSubscription = await updateStripeSubscription(
    customerId,
    priceId,
    paymentMethodId,
  );
  return updateSubscription;
}

export async function createStripeSubscription(
  customerId: string,
  priceId: string,
  paymentMethodId: string,
) {
  console.log("Creating subscription with price ID", customerId);
  try {
    // Attach the payment method to the customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
    // Set the default payment method for the customer
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Create the subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      default_payment_method: paymentMethodId,
      expand: ["latest_invoice.payment_intent"],
    });
    return {
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice,
    };
  } catch (error) {
    console.error("Error creating subscription:", error);
    throw new Error((error as Error).message);
  }
}

export async function getStripeSubscriptionsByCustomerId(customerId: string) {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
    });
    // Filter subscriptions by product ID
    const filteredSubscriptions = subscriptions.data.filter((subscription) =>
      subscription.items.data.some(
        (item) => item.price.product === process.env.STRIPE_PRODUCT_ID,
      ),
    );
    return filteredSubscriptions;
  } catch (error) {
    console.error("Error retrieving subscriptions:", error);
    throw new Error((error as Error).message);
  }
}

export async function getInvoicesBySubscriptionId(subscriptionId: string) {
  try {
    const invoices = await stripe.invoices.list({
      subscription: subscriptionId,
    });
    return invoices;
  } catch (error) {
    console.error("Error retrieving invoices:", error);
    throw new Error((error as Error).message);
  }
}

export async function getChargeById(chargeId: string) {
  try {
    const charge = await stripe.charges.retrieve(chargeId);
    return charge;
  } catch (error) {
    console.error("Error retrieving charge:", error);
    throw new Error((error as Error).message);
  }
}

export async function updateStripeSubscription(
  customerId: string,
  priceId: string,
  paymentMethodId: string,
) {
  try {
    // Attach the payment method to the customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    // Set the default payment method for the customer
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Retrieve the customer's subscriptions
    const subscriptions = await getStripeSubscriptionsByCustomerId(customerId);
    if (subscriptions.length === 0) {
      throw new Error("No subscriptions found for this customer.");
    }

    // Assume we're updating the first subscription found
    const subscription = subscriptions[0];

    // Update the subscription with the new price ID
    const updatedSubscription = await stripe.subscriptions.update(
      subscription.id,
      {
        items: [
          {
            id: subscription.items.data[0].id,
            price: priceId,
          },
        ],
        default_payment_method: paymentMethodId,
        proration_behavior: "create_prorations",
      },
    );

    // Create a one-time invoice item to charge immediately
    const price = subscription.items.data[0].price;
    await stripe.invoiceItems.create({
      customer: customerId,
      amount: price.unit_amount!,
      currency: price.currency,
      description: `Charge for Jugemu subscription fee`,
      subscription: subscription.id,
    });

    // Create an invoice for the updated subscription to trigger an immediate charge
    const invoice = await stripe.invoices.create({
      customer: customerId,
      subscription: subscription.id,
      collection_method: "charge_automatically",
    });

    // Finalize and pay the invoice
    const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);
    await stripe.invoices.pay(finalizedInvoice.id);

    return updatedSubscription;
  } catch (error) {
    console.error("Error updating subscription:", error);
    throw new Error((error as Error).message);
  }
}
