"use server";

import { getServerSession } from "next-auth";
import { customAuthOptions } from "../../lib/customAuthOptions";
import { userInfoUpgrade, createUserSubscription } from "../users";
// import {
//   getStripeCustomer,
//   createStripeCustomer,
//   searchStripeCustomerByEmail,
// } from "../../api/stripe/customer/route";
import stripe from "../../utils/stripe";

export async function createCustomer(name: string) {
  const session = await getServerSession(customAuthOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }

  const email = session.user.email;
  if (!email) {
    throw new Error("Unauthorized");
  }
  const customer = await stripe.customers.create({
    email,
    name,
  });
  // await createStripeCustomer(email, name);

  userInfoUpgrade({ stripeCustomerId: customer.id });
  return customer;
}

export async function getCustomer() {
  const session = await getServerSession(customAuthOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }
  const customerId = session?.user.stripeCustomerId;
  if (!customerId) {
    return null;
  }

  const customerResponse = await stripe.customers.retrieve(customerId);
  //  await getStripeCustomer(customerId);

  return customerResponse;
}

export async function searchStripeCustomerByEmailAndName(
  email: string,
  name: string | null,
) {
  // Construct search query based on available parameters
  let query = "";
  if (email && typeof email === "string") query += `email:'${email}'`;
  if (name && typeof name === "string")
    query += (query ? " AND " : "") + `name:'${name}'`;

  try {
    const customers = await stripe.customers.search({
      query,
    });

    return customers.data;
  } catch (error) {
    console.error(error);
    throw new Error((error as Error).message);
  }
}

export async function searchCustomerByEmail() {
  const session = await getServerSession(customAuthOptions);
  const email = session?.user.email;
  if (!email) {
    throw new Error("Unauthorized");
  }

  const customers = await searchStripeCustomerByEmailAndName(email, null);
  if (!customers) {
    return null;
  }
  return customers.length > 0 ? customers[0] : null;
}

export async function checkAndCreateCustomer(name: string) {
  const existingCustomer = await searchCustomerByEmail();
  if (existingCustomer) {
    return existingCustomer;
  } else {
    const newCustomer = await createCustomer(name);
    return newCustomer;
  }
}
