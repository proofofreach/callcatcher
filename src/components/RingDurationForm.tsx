'use client'

import { useState } from 'react'
import { updateRingDuration } from '@/app/dashboard/settings/actions'

interface RingDurationFormProps {
  initialDuration: number
}

const DURATION_OPTIONS = [10, 15, 20, 25, 30]

export function RingDurationForm({ initialDuration }: RingDurationFormProps) {
  const [duration, setDuration] = useState(initialDuration)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const result = await updateRingDuration({ ringDuration: duration })

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
          Ring duration saved successfully!
        </div>
      )}

      {/* Duration Selector */}
      <div>
        <label htmlFor="ringDuration" className="block text-sm font-medium text-gray-700 mb-1">
          Ring Duration
        </label>
        <select
          id="ringDuration"
          value={duration}
          onChange={(e) => {
            setDuration(Number(e.target.value))
            setError(null)
            setSuccess(false)
          }}
          disabled={isLoading}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors bg-white"
        >
          {DURATION_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option} seconds{option === 20 ? ' (default)' : ''}
            </option>
          ))}
        </select>
        <p className="mt-2 text-sm text-gray-500">
          How long should we try to reach you before texting the caller?
        </p>
      </div>

      {/* Save Button */}
      <div>
        <button
          type="submit"
          disabled={isLoading || duration === initialDuration}
          className="px-6 py-2 text-white font-medium bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
