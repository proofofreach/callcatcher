import { redirect } from 'next/navigation'
import { getServerUser } from '@/lib/auth-server'
import { OnboardingForm } from '@/components/OnboardingForm'

export default async function OnboardingPage() {
  const { user, error } = await getServerUser()

  // Redirect to home if not authenticated
  if (error || !user) {
    redirect('/')
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to CallCatcher!
          </h1>
          <p className="text-gray-600">
            Let&apos;s set up your business profile so we can personalize your auto-reply messages.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <OnboardingForm userId={user.id} />
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          Step 1 of 2: Business Profile
        </div>
      </div>
    </main>
  )
}
