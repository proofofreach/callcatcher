import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createServiceClient } from '@/lib/supabase/service';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature || !webhookSecret) {
      return NextResponse.json(
        { error: 'Missing signature or webhook secret' },
        { status: 400 }
      );
    }

    // Verify the webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Get user_id from subscription metadata or customer
        const customerId = session.customer as string;

        // Update user's subscription status to active
        const { error } = await supabase
          .from('users')
          .update({ subscription_status: 'active' })
          .eq('stripe_customer_id', customerId);

        if (error) {
          console.error('Failed to activate subscription:', error);
          return NextResponse.json(
            { error: 'Failed to update subscription status' },
            { status: 500 }
          );
        }

        console.log(`Subscription activated for customer: ${customerId}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Mark subscription as canceled
        const { error } = await supabase
          .from('users')
          .update({ subscription_status: 'canceled' })
          .eq('stripe_customer_id', customerId);

        if (error) {
          console.error('Failed to cancel subscription:', error);
          return NextResponse.json(
            { error: 'Failed to update subscription status' },
            { status: 500 }
          );
        }

        console.log(`Subscription canceled for customer: ${customerId}`);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Map Stripe subscription status to our status
        let subscriptionStatus: 'active' | 'canceled' | 'past_due' = 'active';

        if (subscription.status === 'past_due') {
          subscriptionStatus = 'past_due';
        } else if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
          subscriptionStatus = 'canceled';
        }

        const { error } = await supabase
          .from('users')
          .update({ subscription_status: subscriptionStatus })
          .eq('stripe_customer_id', customerId);

        if (error) {
          console.error('Failed to update subscription:', error);
          return NextResponse.json(
            { error: 'Failed to update subscription status' },
            { status: 500 }
          );
        }

        console.log(`Subscription updated for customer: ${customerId}, status: ${subscriptionStatus}`);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        // Mark as past due when payment fails
        const { error } = await supabase
          .from('users')
          .update({ subscription_status: 'past_due' })
          .eq('stripe_customer_id', customerId);

        if (error) {
          console.error('Failed to mark subscription as past_due:', error);
        }

        console.log(`Payment failed for customer: ${customerId}`);
        break;
      }

      default:
        // Unhandled event type - log but don't error
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
