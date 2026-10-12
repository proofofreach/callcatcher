import { EmailSignupForm } from '@/components/EmailSignupForm'
import { PhoneMockup } from '@/components/PhoneMockup'
import {
  Phone,
  MessageSquare,
  DollarSign,
  Clock,
  Shield,
  Zap,
  Check,
  ArrowRight,
  PhoneMissed,
  TrendingUp
} from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                <Phone className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">CallCatcher</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <a href="#faq" className="text-gray-600 hover:text-gray-900 transition-colors">FAQ</a>
            </div>
            <a
              href="#signup"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors cursor-pointer"
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 sm:pt-32 sm:pb-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left: Copy */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-[1.1] mb-6">
                That Missed Call Just Cost You{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                  $500
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
                You&apos;re on a job. Phone rings. Can&apos;t answer. Customer calls your competitor instead.
                <span className="font-medium text-gray-900"> CallCatcher texts them instantly—so they wait for you.</span>
              </p>

              {/* CTA */}
              <div id="signup" className="mb-6">
                <EmailSignupForm />
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-teal-600" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-teal-600" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-teal-600" />
                  <span>Setup in 5 minutes</span>
                </div>
              </div>
            </div>

            {/* Right: Phone Mockup */}
            <div className="flex justify-center lg:justify-end">
              <PhoneMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Problem Agitation Section */}
      <section className="py-16 sm:py-24 bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Every Missed Call Is Money Walking Out the Door
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              You&apos;re great at your job. But you can&apos;t answer the phone when you&apos;re elbow-deep in a project.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Pain point 1 */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center mb-4">
                <PhoneMissed className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Calls come in while you work</h3>
              <p className="text-gray-400">
                Service businesses miss calls during working hours—because they&apos;re actually working.
              </p>
            </div>

            {/* Pain point 2 */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Most callers won&apos;t wait</h3>
              <p className="text-gray-400">
                Customers don&apos;t leave voicemails anymore. If you don&apos;t answer, they move on to the next contractor.
              </p>
            </div>

            {/* Pain point 3 */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Missed calls become their jobs</h3>
              <p className="text-gray-400">
                Every unanswered call is a lead your competitor can book first.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-xl text-teal-400 font-medium">
              What if every missed call got an instant response—automatically?
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Never Lose a Lead Again
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              CallCatcher responds to missed calls in seconds—not hours. Here&apos;s how it works.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mb-6 shadow-lg shadow-teal-500/25">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <div className="absolute top-8 left-[60%] hidden md:block w-[calc(100%-2rem)] h-0.5 bg-gradient-to-r from-teal-500 to-transparent" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  1. Customer calls you
                </h3>
                <p className="text-gray-600">
                  They find your business on Google, call your CallCatcher number. You&apos;re on a job and can&apos;t answer.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-6 shadow-lg shadow-orange-500/25">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <div className="absolute top-8 left-[60%] hidden md:block w-[calc(100%-2rem)] h-0.5 bg-gradient-to-r from-orange-500 to-transparent" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  2. Instant auto-text
                </h3>
                <p className="text-gray-600">
                  Within seconds, they get a friendly text: &quot;Hey! Sorry we missed you. How can we help?&quot;
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mb-6 shadow-lg shadow-teal-500/25">
                  <MessageSquare className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  3. Conversation starts
                </h3>
                <p className="text-gray-600">
                  They reply. You text back when you&apos;re free. Lead captured, job booked, money in your pocket.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features → Benefits */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Capture Every Lead
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
                <Phone className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Dedicated business number</h3>
                <p className="text-gray-600 text-sm">Local area code. Customers see a professional number, not your personal cell.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Instant auto-text</h3>
                <p className="text-gray-600 text-sm">Missed call? Text goes out in seconds. Customize your message to match your brand.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Two-way texting</h3>
                <p className="text-gray-600 text-sm">Reply from your phone. Customer sees your business number, not your personal one.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Call forwarding</h3>
                <p className="text-gray-600 text-sm">Calls ring your phone first. Only texts when you don&apos;t answer.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
                <Shield className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Privacy protected</h3>
                <p className="text-gray-600 text-sm">Your personal number stays private. Customers only see your business line.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Business hours</h3>
                <p className="text-gray-600 text-sm">Set your availability. After-hours calls get a different message.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              One Plan. Everything Included.
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              No tiers. No upsells. No hidden fees. Just one simple price that pays for itself with a single saved lead.
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
              {/* Price header */}
              <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6 text-center text-white">
                <p className="text-teal-100 font-medium mb-2">Complete Package</p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold">$29</span>
                  <span className="text-teal-200">/month</span>
                </div>
                <p className="mt-2 text-teal-100">100 SMS messages included</p>
              </div>

              {/* Features */}
              <div className="px-8 py-8">
                <ul className="space-y-4">
                  {[
                    'Dedicated local business number',
                    'Automatic missed call texts',
                    'Two-way SMS conversations',
                    'Custom message templates',
                    'Call forwarding to your phone',
                    'Business hours settings',
                    'Conversation dashboard',
                    'Opt-out management',
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center">
                        <Check className="w-3 h-3 text-teal-600" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* ROI callout */}
                <div className="mt-8 bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <p className="text-center">
                    <span className="font-semibold text-orange-800">$29 pays for itself with ONE saved lead.</span>
                    <br />
                    <span className="text-sm text-orange-700">If one saved lead is a $500 job, that&apos;s 17x the monthly price.</span>
                  </p>
                </div>

                {/* CTA */}
                <div className="mt-8">
                  <a
                    href="#signup"
                    className="block w-full py-4 bg-teal-600 text-white text-center font-semibold rounded-xl hover:bg-teal-700 transition-colors cursor-pointer"
                  >
                    Start Your 14-Day Free Trial
                  </a>
                  <p className="mt-3 text-center text-sm text-gray-500">
                    No credit card required. Cancel anytime.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: 'How fast does the auto-text go out?',
                a: 'Within seconds of a missed call. The customer gets your text before they even think about calling someone else.',
              },
              {
                q: 'Do I need to change my business number?',
                a: 'Nope! You get a new dedicated number from CallCatcher. Just update your Google Business listing and marketing materials. Your personal number stays private.',
              },
              {
                q: 'What happens if I go over 100 texts?',
                a: 'Additional texts are just $0.05 each. No surprise charges—you\'ll see your usage in your dashboard.',
              },
              {
                q: 'Can I customize the auto-text message?',
                a: 'Absolutely. Make it sound like you. Include your business name, hours, whatever you want.',
              },
              {
                q: 'Does it work with my existing phone?',
                a: 'Yes! Calls are forwarded to your cell. When you miss one, CallCatcher sends the text. You reply from your phone like normal—customer just sees your business number.',
              },
              {
                q: 'What if I want to cancel?',
                a: 'Cancel anytime from your dashboard. No contracts, no cancellation fees. We\'re confident you\'ll love it.',
              },
            ].map((faq, i) => (
              <div key={i} className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-teal-600 to-teal-700">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Stop Losing Leads. Start Catching Calls.
          </h2>
          <p className="text-lg text-teal-100 mb-8 max-w-2xl mx-auto">
            Every missed call is money on the table. Get CallCatcher and never lose a lead to a missed call again.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-teal-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Start Your Free Trial
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
          <p className="mt-4 text-sm text-teal-200">
            14 days free. No credit card required. Setup in 5 minutes.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold">CallCatcher</span>
              </div>
              <p className="text-gray-400 max-w-md">
                The easiest way to capture leads from missed calls. Built for contractors, plumbers, electricians, HVAC techs, and service businesses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-gray-400 hover:text-white transition-colors">
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
