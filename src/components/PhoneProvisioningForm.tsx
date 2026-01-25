'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { provisionPhoneNumber } from '@/lib/twilio-actions'
import { formatPhoneNumber } from '@/lib/format'

interface PhoneProvisioningFormProps {
  userId: string
}

export function PhoneProvisioningForm({ userId }: PhoneProvisioningFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [provisionedNumber, setProvisionedNumber] = useState<string | null>(null)

  const [zipCode, setZipCode] = useState('')

  // Format ZIP code as user types (5 digits max)
  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 5)
    setZipCode(digits)
    // Clear error when user types
    if (error) {
      setError(null)
    }
  }

  const handleProvision = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate ZIP code
    if (zipCode.length !== 5) {
      setError('Please enter a valid 5-digit ZIP code')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await provisionPhoneNumber(zipCode, userId)

      if (!result.success) {
        setError(result.error || 'Failed to provision phone number')
        setIsLoading(false)
        return
      }

      // Success! Show the provisioned number
      setProvisionedNumber(result.phoneNumber!)
      setIsLoading(false)
    } catch {
      setError('Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  const handleContinue = () => {
    router.push('/dashboard')
  }

  // Success state - show the provisioned number
  if (provisionedNumber) {
    const formattedNumber = formatPhoneNumber(provisionedNumber)

    return (
      <div className="space-y-6 text-center">
        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        {/* Provisioned Number */}
        <div>
          <p className="text-sm text-gray-600 mb-2">Your new business number:</p>
          <p className="text-3xl font-bold text-gray-900">{formattedNumber}</p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div className="text-left">
              <p className="font-medium text-blue-900">Next step:</p>
              <p className="text-sm text-blue-800 mt-1">
                Update your Google Business listing with this number. When customers call it, we&apos;ll forward to your phone and auto-text if you miss the call.
              </p>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="w-full py-3 px-6 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-all"
        >
          Continue to Dashboard →
        </button>
      </div>
    )
  }

  // Form state - ZIP code input and provision button
  return (
    <form onSubmit={handleProvision} className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start">
          <svg className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <span>{error}</span>
            {/* Retry hint */}
            {error.includes('try again') && (
              <p className="mt-1 text-xs">Click the button below to try again.</p>
            )}
          </div>
        </div>
      )}

      {/* ZIP Code Input */}
      <div>
        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
          Your ZIP Code
        </label>
        <input
          type="text"
          id="zipCode"
          value={zipCode}
          onChange={handleZipChange}
          placeholder="12345"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-center text-2xl tracking-widest ${
            error ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
          maxLength={5}
          disabled={isLoading}
          inputMode="numeric"
          pattern="[0-9]*"
        />
        <p className="mt-1 text-xs text-gray-500 text-center">
          We&apos;ll get you a local number in your area
        </p>
      </div>

      {/* Provision Button */}
      <button
        type="submit"
        disabled={isLoading || zipCode.length !== 5}
        className="w-full py-3 px-6 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Getting your number...
          </span>
        ) : (
          'Get My Business Number'
        )}
      </button>

      {/* Info about what happens */}
      <p className="text-xs text-gray-500 text-center">
        This will provision a real phone number from Twilio. Standard carrier rates may apply.
      </p>
    </form>
  )
}
