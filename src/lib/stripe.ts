import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-12-15.clover',
  typescript: true,
});

// Price ID for the $29/mo subscription plan
// This should be created in Stripe Dashboard and set in environment variables
export const SUBSCRIPTION_PRICE_ID = process.env.STRIPE_PRICE_ID || '';
