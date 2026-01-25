import { redirect } from 'next/navigation'
import { getServerUser } from '@/lib/auth-server'
import { PhoneProvisioningForm } from '@/components/PhoneProvisioningForm'

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
            We&apos;ll get you a local phone number in your area that customers can call.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <PhoneProvisioningForm userId={user.id} />
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          Step 2 of 2: Phone Number
        </div>
      </div>
    </main>
  )
}
