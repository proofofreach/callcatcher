'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveBusinessProfile } from '@/app/onboarding/actions'

interface FormErrors {
  businessName?: string
  personalPhone?: string
  general?: string
}

interface OnboardingFormProps {
  userId: string
}

export function OnboardingForm({ userId }: OnboardingFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const [businessName, setBusinessName] = useState('')
  const [businessHours, setBusinessHours] = useState('')
  const [personalPhone, setPersonalPhone] = useState('')

  // Format phone number as user types (XXX-XXX-XXXX)
  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 10)
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersonalPhone(formatPhoneNumber(e.target.value))
    // Clear phone error when user types
    if (errors.personalPhone) {
      setErrors(prev => ({ ...prev, personalPhone: undefined }))
    }
  }

  const handleBusinessNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusinessName(e.target.value)
    // Clear business name error when user types
    if (errors.businessName) {
      setErrors(prev => ({ ...prev, businessName: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Business name validation (2-100 chars)
    if (!businessName.trim()) {
      newErrors.businessName = 'Business name is required'
    } else if (businessName.trim().length < 2) {
      newErrors.businessName = 'Business name must be at least 2 characters'
    } else if (businessName.trim().length > 100) {
      newErrors.businessName = 'Business name must be 100 characters or less'
    }

    // Personal phone validation (10 digits)
    const phoneDigits = personalPhone.replace(/\D/g, '')
    if (!phoneDigits) {
      newErrors.personalPhone = 'Phone number is required'
    } else if (phoneDigits.length !== 10) {
      newErrors.personalPhone = 'Phone number must be 10 digits'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      const phoneDigits = personalPhone.replace(/\D/g, '')

      const result = await saveBusinessProfile({
        userId,
        businessName: businessName.trim(),
        businessHours: businessHours.trim() || null,
        personalPhone: phoneDigits,
      })

      if (result.error) {
        setErrors({ general: result.error })
        setIsLoading(false)
        return
      }

      // Redirect to phone provisioning step
      router.push('/onboarding/phone')
    } catch {
      setErrors({ general: 'Something went wrong. Please try again.' })
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General Error */}
      {errors.general && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {errors.general}
        </div>
      )}

      {/* Business Name */}
      <div>
        <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
          Business Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="businessName"
          value={businessName}
          onChange={handleBusinessNameChange}
          placeholder="Acme Plumbing"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
            errors.businessName ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
          maxLength={100}
          disabled={isLoading}
        />
        {errors.businessName && (
          <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          This will be used in your auto-reply messages
        </p>
      </div>

      {/* Business Hours */}
      <div>
        <label htmlFor="businessHours" className="block text-sm font-medium text-gray-700 mb-1">
          Business Hours <span className="text-gray-400">(optional)</span>
        </label>
        <input
          type="text"
          id="businessHours"
          value={businessHours}
          onChange={(e) => setBusinessHours(e.target.value)}
          placeholder="Mon-Fri 9am-5pm"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          disabled={isLoading}
        />
        <p className="mt-1 text-xs text-gray-500">
          If set, this will be included in your auto-reply messages
        </p>
      </div>

      {/* Personal Phone */}
      <div>
        <label htmlFor="personalPhone" className="block text-sm font-medium text-gray-700 mb-1">
          Your Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="personalPhone"
          value={personalPhone}
          onChange={handlePhoneChange}
          placeholder="555-123-4567"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
            errors.personalPhone ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
          disabled={isLoading}
        />
        {errors.personalPhone && (
          <p className="mt-1 text-sm text-red-600">{errors.personalPhone}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          We&apos;ll forward incoming calls to this number
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-6 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </span>
        ) : (
          'Continue →'
        )}
      </button>
    </form>
  )
}
