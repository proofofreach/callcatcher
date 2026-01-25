import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Service client for API routes that don't have user context.
 * Uses service role key for admin access to database.
 * Only use in API routes/webhooks, never expose to client.
 */
export function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase service environment variables");
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey);
}
