'use server';

import { stripe, SUBSCRIPTION_PRICE_ID } from './stripe';
import { createClient } from './supabase/server';
import { createServiceClient } from './supabase/service';

/**
 * Creates a Stripe Checkout session for the $29/mo subscription
 * Returns the checkout URL for redirect
 */
export async function createCheckoutSession(): Promise<{
  success: boolean;
  url?: string;
  error?: string;
}> {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Check if price ID is configured
    if (!SUBSCRIPTION_PRICE_ID) {
      return { success: false, error: 'Subscription plan not configured' };
    }

    // Use service client to get/update user data (bypasses RLS)
    const serviceClient = createServiceClient();

    // Get user data including existing stripe_customer_id
    const { data: userData, error: userError } = await serviceClient
      .from('users')
      .select('stripe_customer_id, email')
      .eq('id', user.id)
      .single();

    if (userError) {
      return { success: false, error: 'Failed to get user data' };
    }

    let stripeCustomerId = userData.stripe_customer_id;

    // Create Stripe customer if doesn't exist
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: userData.email || user.email,
        metadata: {
          user_id: user.id,
        },
      });

      stripeCustomerId = customer.id;

      // Save customer ID to user record
      await serviceClient
        .from('users')
        .update({ stripe_customer_id: customer.id })
        .eq('id', user.id);
    }

    // Get base URL for redirects
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: SUBSCRIPTION_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/dashboard?subscription=success`,
      cancel_url: `${baseUrl}/dashboard?subscription=canceled`,
      subscription_data: {
        metadata: {
          user_id: user.id,
        },
      },
    });

    if (!session.url) {
      return { success: false, error: 'Failed to create checkout session' };
    }

    return { success: true, url: session.url };
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create checkout session'
    };
  }
}

/**
 * Creates a Stripe Billing Portal session for managing subscription
 * Returns the portal URL for redirect
 */
export async function createBillingPortalSession(): Promise<{
  success: boolean;
  url?: string;
  error?: string;
}> {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Use service client to get user's Stripe customer ID
    const serviceClient = createServiceClient();
    const { data: userData, error: userError } = await serviceClient
      .from('users')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (userError || !userData.stripe_customer_id) {
      return { success: false, error: 'No subscription found' };
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Create billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: userData.stripe_customer_id,
      return_url: `${baseUrl}/dashboard/settings`,
    });

    return { success: true, url: session.url };
  } catch (error) {
    console.error('Billing portal error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create billing session'
    };
  }
}
