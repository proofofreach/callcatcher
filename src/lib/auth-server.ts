import { createClient as createServerClient } from '@/lib/supabase/server'

/**
 * Get the current user from server-side
 * Use this in Server Components or API routes
 */
export async function getServerUser() {
  const supabase = await createServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}
