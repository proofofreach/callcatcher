import { redirect } from 'next/navigation'
import { getServerUser } from '@/lib/auth-server'

export default async function PhoneProvisioningPage() {
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
            Get Your Business Number
          </h1>
          <p className="text-gray-600">
            This step will be implemented in US-007
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 text-center">
          <p className="text-gray-600 mb-4">
            Phone provisioning functionality coming soon...
          </p>
          <a
            href="/dashboard"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </a>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          Step 2 of 2: Phone Provisioning
        </div>
      </div>
    </main>
  )
}
