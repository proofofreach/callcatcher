import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Auth callback route that handles magic link redirects
 * Supabase sends users here after they click the magic link in their email
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // Redirect to this page after auth completes (defaults to onboarding for new users)
  const next = searchParams.get('next') ?? '/onboarding'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Check if user has a profile - if not, they need to complete onboarding
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .single()

        // If profile exists, go to dashboard; otherwise go to onboarding
        const redirectPath = profile ? '/dashboard' : '/onboarding'
        return NextResponse.redirect(`${origin}${redirectPath}`)
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // If there's an error or no code, redirect to homepage with error
  return NextResponse.redirect(`${origin}/?error=auth_callback_error`)
}
