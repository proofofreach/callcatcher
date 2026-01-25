'use client'

import { useState, useMemo } from 'react'
import { updateMessageTemplate } from '@/app/dashboard/settings/actions'

interface MessageTemplateFormProps {
  initialTemplate: string
  businessName: string | null
  businessHours: string | null
}

const DEFAULT_TEMPLATE = "Hi from {business_name}! Sorry we missed your call. We're open {hours}. How can we help?"
const MAX_SMS_LENGTH = 160

export function MessageTemplateForm({
  initialTemplate,
  businessName,
  businessHours,
}: MessageTemplateFormProps) {
  const [template, setTemplate] = useState(initialTemplate || DEFAULT_TEMPLATE)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Generate live preview with variables replaced
  const preview = useMemo(() => {
    let previewText = template
      .replace(/{business_name}/g, businessName || 'Your Business')

    // If hours not set, remove the hours sentence entirely
    if (businessHours) {
      previewText = previewText.replace(/{hours}/g, businessHours)
    } else {
      // Remove sentences containing {hours}
      // Common patterns: "We're open {hours}." or "Our hours are {hours}."
      previewText = previewText
        .replace(/\s*We're open \{hours\}\.?\s*/g, ' ')
        .replace(/\s*Our hours are \{hours\}\.?\s*/g, ' ')
        .replace(/\s*\{hours\}\.?\s*/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    }

    return previewText
  }, [template, businessName, businessHours])

  // Calculate characters remaining (based on preview, not template)
  const charsRemaining = MAX_SMS_LENGTH - preview.length
  const isOverLimit = charsRemaining < 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const result = await updateMessageTemplate({ messageTemplate: template })

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

  const handleReset = () => {
    setTemplate(DEFAULT_TEMPLATE)
    setError(null)
    setSuccess(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          Message template saved successfully!
        </div>
      )}

      {/* Template Editor */}
      <div>
        <label htmlFor="messageTemplate" className="block text-sm font-medium text-gray-700 mb-1">
          Auto-Reply Message Template
        </label>
        <textarea
          id="messageTemplate"
          value={template}
          onChange={(e) => {
            setTemplate(e.target.value)
            setError(null)
            setSuccess(false)
          }}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
          placeholder="Enter your auto-reply message..."
          disabled={isLoading}
        />
        <div className="mt-2 flex items-center justify-between text-sm">
          <div className="text-gray-500">
            Available variables: <code className="bg-gray-100 px-1 rounded">{'{business_name}'}</code>{' '}
            <code className="bg-gray-100 px-1 rounded">{'{hours}'}</code>
          </div>
          <div className={`font-medium ${isOverLimit ? 'text-red-600' : charsRemaining < 20 ? 'text-yellow-600' : 'text-gray-500'}`}>
            {charsRemaining}/{MAX_SMS_LENGTH} characters remaining
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Preview
        </label>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-gray-800 whitespace-pre-wrap">{preview}</p>
          {!businessHours && template.includes('{hours}') && (
            <p className="mt-2 text-sm text-yellow-600">
              Note: Hours will be omitted since you haven&apos;t set business hours.
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isLoading || isOverLimit}
          className="px-6 py-2 text-white font-medium bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={isLoading}
          className="px-4 py-2 text-gray-700 font-medium bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-all disabled:opacity-50"
        >
          Reset to Default
        </button>
      </div>
    </form>
  )
}
