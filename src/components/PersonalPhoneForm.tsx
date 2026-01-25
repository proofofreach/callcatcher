'use client'

import { useState, useEffect } from 'react'
import { updatePersonalPhone } from '@/app/dashboard/settings/actions'
import { formatPhoneNumber } from '@/lib/format'

interface PersonalPhoneFormProps {
  initialPhone: string | null
}

// Format phone as user types: XXX-XXX-XXXX
function formatPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 3) {
    return digits
  }
  if (digits.length <= 6) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`
  }
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`
}

// Extract just digits from formatted phone
function extractDigits(phone: string): string {
  return phone.replace(/\D/g, '')
}

export function PersonalPhoneForm({ initialPhone }: PersonalPhoneFormProps) {
  const [phone, setPhone] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Format the initial phone number on mount
  useEffect(() => {
    if (initialPhone) {
      const digits = extractDigits(initialPhone)
      setPhone(formatPhoneInput(digits))
    }
  }, [initialPhone])

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneInput(e.target.value)
    setPhone(formatted)
    setError(null)
    setSuccess(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    const digits = extractDigits(phone)

    // Client-side validation
    if (digits.length !== 10) {
      setError('Please enter a valid 10-digit US phone number')
      setIsLoading(false)
      return
    }

    try {
      const result = await updatePersonalPhone({ personalPhone: digits })

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Check if phone has changed from initial value
  const initialDigits = initialPhone ? extractDigits(initialPhone) : ''
  const currentDigits = extractDigits(phone)
  const hasChanged = currentDigits !== initialDigits && currentDigits.length === 10

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          Phone number updated! Changes take effect on the next incoming call.
        </div>
      )}

      {/* Current Number Display */}
      {initialPhone && (
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600">
            Current forwarding number: <span className="font-medium text-gray-900">{formatPhoneNumber(initialPhone)}</span>
          </p>
        </div>
      )}

      {/* Phone Input */}
      <div>
        <label htmlFor="personalPhone" className="block text-sm font-medium text-gray-700 mb-1">
          New Phone Number
        </label>
        <input
          type="tel"
          id="personalPhone"
          value={phone}
          onChange={handlePhoneChange}
          placeholder="555-123-4567"
          maxLength={12}
          disabled={isLoading}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />
        <p className="mt-2 text-sm text-gray-500">
          Incoming calls to your business number will be forwarded here.
        </p>
      </div>

      {/* Save Button */}
      <div>
        <button
          type="submit"
          disabled={isLoading || !hasChanged}
          className="px-6 py-2 text-white font-medium bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
