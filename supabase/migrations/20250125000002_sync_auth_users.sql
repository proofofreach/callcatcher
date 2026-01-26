-- Sync auth.users with public.users table
-- Creates a user record when someone signs up via Supabase Auth

-- Function to create a user record when auth user is created
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger on auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill: Create user records for any existing auth users
insert into public.users (id, email)
select id, email from auth.users
on conflict (id) do nothing;
