import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getServerUser } from '@/lib/auth-server'
import { createClient } from '@/lib/supabase/server'
import { MessageTemplateForm } from '@/components/MessageTemplateForm'
import { RingDurationForm } from '@/components/RingDurationForm'
import { PersonalPhoneForm } from '@/components/PersonalPhoneForm'

async function getProfile(userId: string) {
  const supabase = await createClient()

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('business_name, business_hours, message_template, ring_duration, personal_phone')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Failed to fetch profile:', error)
    return null
  }

  return profile
}

export default async function SettingsPage() {
  const { user, error } = await getServerUser()

  if (error || !user) {
    redirect('/')
  }

  const profile = await getProfile(user.id)

  if (!profile) {
    // If no profile, redirect to onboarding
    redirect('/onboarding')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Settings Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Back to dashboard"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-sm text-gray-500">Customize your CallCatcher experience</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Personal Phone Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Forwarding Phone Number</h2>
          <p className="text-gray-600 mb-6">
            This is where your business calls get forwarded to.
          </p>
          <PersonalPhoneForm
            initialPhone={profile.personal_phone}
          />
        </div>

        {/* Ring Duration Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ring Duration</h2>
          <p className="text-gray-600 mb-6">
            Control how long incoming calls ring before triggering an auto-text.
          </p>
          <RingDurationForm
            initialDuration={profile.ring_duration}
          />
        </div>

        {/* Message Template Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Auto-Reply Message</h2>
          <p className="text-gray-600 mb-6">
            Customize the message that gets sent automatically when you miss a call.
          </p>
          <MessageTemplateForm
            initialTemplate={profile.message_template}
            businessName={profile.business_name}
            businessHours={profile.business_hours}
          />
        </div>
      </div>
    </div>
  )
}
