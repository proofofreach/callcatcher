'use client'

export function PhoneMockup() {
  return (
    <div className="phone-mockup w-[280px] sm:w-[320px]">
      <div className="phone-screen">
        {/* Status bar */}
        <div className="bg-gray-100 px-6 py-2 flex justify-between items-center text-xs text-gray-600">
          <span>9:41</span>
          <div className="flex gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3C7.46 3 3.34 4.78.29 7.67c-.18.18-.29.43-.29.71 0 .28.11.53.29.71l2.48 2.48c.18.18.43.29.71.29.27 0 .52-.11.7-.28.79-.74 1.69-1.36 2.66-1.85.33-.16.56-.5.56-.9v-3.1c1.45-.48 3-.73 4.6-.73s3.15.25 4.6.73v3.1c0 .4.23.74.56.9.98.49 1.87 1.12 2.67 1.85.18.18.43.28.7.28.28 0 .53-.11.71-.29l2.48-2.48c.18-.18.29-.43.29-.71 0-.28-.11-.53-.29-.71C20.66 4.78 16.54 3 12 3z"/>
            </svg>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/>
            </svg>
          </div>
        </div>

        {/* Messages header */}
        <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-semibold">
              AC
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Acme Plumbing</p>
              <p className="text-xs text-gray-500">(555) 123-4567</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="bg-white p-4 min-h-[280px] flex flex-col justify-end gap-3">
          {/* Missed call indicator */}
          <div className="animate-slide-up text-center">
            <span className="inline-flex items-center gap-1.5 text-xs text-red-600 bg-red-50 px-3 py-1 rounded-full">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
              </svg>
              Missed call • 2 min ago
            </span>
          </div>

          {/* Auto-text message */}
          <div className="animate-slide-up-delay flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[85%]">
              <p className="text-sm text-gray-800">
                Hey! Thanks for calling Acme Plumbing. Sorry we missed you—we&apos;re on another job. How can we help? 🔧
              </p>
              <p className="text-[10px] text-gray-400 mt-1">Just now</p>
            </div>
          </div>

          {/* Customer reply */}
          <div className="animate-slide-up-delay-2 flex justify-end">
            <div className="bg-teal-600 rounded-2xl rounded-br-md px-4 py-2.5 max-w-[85%]">
              <p className="text-sm text-white">
                Hi! I have a leaky faucet. Can you come out today?
              </p>
              <p className="text-[10px] text-teal-200 mt-1">Just now</p>
            </div>
          </div>
        </div>

        {/* Input bar */}
        <div className="bg-gray-100 px-4 py-3 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white rounded-full px-4 py-2 text-sm text-gray-400">
              iMessage
            </div>
            <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
