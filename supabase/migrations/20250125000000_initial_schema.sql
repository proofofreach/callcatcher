-- CallCatcher Initial Database Schema
-- Creates tables for users, profiles, messages, calls, and opt_outs

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- Users table: Core user data and subscription info
create table users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  created_at timestamp with time zone default now() not null,
  trial_ends_at timestamp with time zone default (now() + interval '14 days') not null,
  subscription_status text default 'trial' not null check (subscription_status in ('trial', 'active', 'canceled', 'past_due'))
);

-- Profiles table: Business settings and Twilio configuration
create table profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid unique not null references users(id) on delete cascade,
  business_name text,
  business_hours text,
  personal_phone text,
  twilio_number text,
  ring_duration integer default 20 not null check (ring_duration >= 10 and ring_duration <= 30),
  message_template text default 'Hi from {business_name}! Sorry we missed your call. We''re open {hours}. How can we help?',
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Messages table: SMS message log (inbound and outbound)
create table messages (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  customer_phone text not null,
  direction text not null check (direction in ('inbound', 'outbound')),
  body text not null,
  is_auto_reply boolean default false not null,
  created_at timestamp with time zone default now() not null
);

-- Calls table: Call log with status tracking
create table calls (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  customer_phone text not null,
  status text not null check (status in ('missed', 'answered')),
  duration integer default 0,
  created_at timestamp with time zone default now() not null
);

-- Opt-outs table: Track customers who have opted out of auto-texts
create table opt_outs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  phone_number text not null,
  created_at timestamp with time zone default now() not null,
  unique (user_id, phone_number)
);

-- Indexes for common queries
create index idx_profiles_user_id on profiles(user_id);
create index idx_messages_user_id on messages(user_id);
create index idx_messages_customer_phone on messages(customer_phone);
create index idx_messages_created_at on messages(created_at);
create index idx_calls_user_id on calls(user_id);
create index idx_calls_created_at on calls(created_at);
create index idx_calls_status on calls(status);
create index idx_opt_outs_user_id_phone on opt_outs(user_id, phone_number);
create index idx_profiles_twilio_number on profiles(twilio_number);

-- Row Level Security (RLS) policies
alter table users enable row level security;
alter table profiles enable row level security;
alter table messages enable row level security;
alter table calls enable row level security;
alter table opt_outs enable row level security;

-- Users can only see their own data
create policy "Users can view own data" on users
  for select using (auth.uid() = id);

create policy "Users can update own data" on users
  for update using (auth.uid() = id);

-- Profiles policies
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = user_id);

create policy "Users can insert own profile" on profiles
  for insert with check (auth.uid() = user_id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = user_id);

-- Messages policies
create policy "Users can view own messages" on messages
  for select using (auth.uid() = user_id);

create policy "Users can insert own messages" on messages
  for insert with check (auth.uid() = user_id);

-- Calls policies
create policy "Users can view own calls" on calls
  for select using (auth.uid() = user_id);

create policy "Users can insert own calls" on calls
  for insert with check (auth.uid() = user_id);

-- Opt-outs policies
create policy "Users can view own opt_outs" on opt_outs
  for select using (auth.uid() = user_id);

create policy "Users can insert own opt_outs" on opt_outs
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own opt_outs" on opt_outs
  for delete using (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to auto-update profiles.updated_at
create trigger update_profiles_updated_at
  before update on profiles
  for each row
  execute function update_updated_at_column();
