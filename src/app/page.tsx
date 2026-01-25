import { EmailSignupForm } from '@/components/EmailSignupForm'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Never Lose a Lead to a Missed Call Again
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Automatically text customers when you miss their calls. Keep leads warm and conversations going, even when you&apos;re busy.
            </p>
            <div className="flex justify-center">
              <EmailSignupForm />
            </div>
            <p className="mt-4 text-sm text-blue-200">
              14-day free trial. No credit card required.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📞</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                1. Miss a Call
              </h3>
              <p className="text-gray-600">
                Customer calls your business number. You&apos;re busy with another job or can&apos;t get to your phone.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                2. Auto-Text Sent
              </h3>
              <p className="text-gray-600">
                CallCatcher automatically sends a personalized text to the caller within seconds.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                3. Continue the Conversation
              </h3>
              <p className="text-gray-600">
                Reply to texts right from your phone. The customer sees your business number, not your personal one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            Simple, Transparent Pricing
          </h2>
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="text-center">
                <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">
                  Everything Included
                </p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold text-gray-900">$29</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <p className="mt-4 text-gray-600">
                  100 SMS messages included
                </p>
              </div>
              <ul className="mt-8 space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-lg">✓</span>
                  <span className="text-gray-600">Dedicated business phone number</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-lg">✓</span>
                  <span className="text-gray-600">Automatic missed call texts</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-lg">✓</span>
                  <span className="text-gray-600">Two-way SMS conversations</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-lg">✓</span>
                  <span className="text-gray-600">Customizable message templates</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-lg">✓</span>
                  <span className="text-gray-600">Call forwarding to your phone</span>
                </li>
              </ul>
              <div className="mt-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <p className="text-blue-800 font-semibold">
                    14-day free trial
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    No credit card required to start
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <span className="text-2xl font-bold">CallCatcher</span>
              <p className="mt-4 text-gray-400 max-w-md">
                The easiest way to capture leads from missed calls. Perfect for service businesses, contractors, and small businesses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} CallCatcher. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
