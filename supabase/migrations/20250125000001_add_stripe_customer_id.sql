-- Add Stripe customer ID to users table for subscription management
alter table users add column stripe_customer_id text unique;

-- Index for looking up users by Stripe customer ID (webhook lookups)
create index idx_users_stripe_customer_id on users(stripe_customer_id);
