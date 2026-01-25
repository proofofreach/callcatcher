import { createClient } from '@/lib/supabase/client'
import { createClient as createServerClient } from '@/lib/supabase/server'

/**
 * Sign in with email using magic link (browser client)
 * @param email - User's email address
 * @param redirectTo - Optional redirect URL after magic link click (defaults to /auth/callback)
 */
export async function signInWithEmail(email: string, redirectTo?: string) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo ?? `${window.location.origin}/auth/callback`,
    },
  })

  return { data, error }
}

/**
 * Sign out the current user (browser client)
 */
export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  return { error }
}

/**
 * Get the current user from browser client
 */
export async function getUser() {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

/**
 * Get the current user from server-side
 * Use this in Server Components or API routes
 */
export async function getServerUser() {
  const supabase = await createServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

/**
 * Get the current session from browser client
 */
export async function getSession() {
  const supabase = createClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}
