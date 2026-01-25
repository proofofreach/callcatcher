'use client'

import { useState } from 'react'
import { createCheckoutSession, createBillingPortalSession } from '@/lib/stripe-actions'
import type { SubscriptionStatus } from '@/types/database'

interface TrialBannerProps {
  trialEndsAt: string | null
  subscriptionStatus: SubscriptionStatus
}

function calculateDaysLeft(trialEndsAt: string | null): number {
  if (!trialEndsAt) return 0
  const now = new Date()
  const endDate = new Date(trialEndsAt)
  const diffTime = endDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}

export function TrialBanner({ trialEndsAt, subscriptionStatus }: TrialBannerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpgrade = async () => {
    setIsLoading(true)
    setError(null)

    const result = await createCheckoutSession()

    if (result.success && result.url) {
      window.location.href = result.url
    } else {
      setError(result.error || 'Failed to start checkout')
      setIsLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    setIsLoading(true)
    setError(null)

    const result = await createBillingPortalSession()

    if (result.success && result.url) {
      window.location.href = result.url
    } else {
      setError(result.error || 'Failed to open billing portal')
      setIsLoading(false)
    }
  }

  // Don't show banner for active subscriptions
  if (subscriptionStatus === 'active') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-green-600 text-lg">✓</span>
            <span className="text-green-800 font-medium">Active Subscription</span>
          </div>
          <button
            onClick={handleManageSubscription}
            disabled={isLoading}
            className="text-sm text-green-700 hover:text-green-900 font-medium underline disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Manage Subscription'}
          </button>
        </div>
        {error && (
          <p className="text-red-600 text-sm mt-2">{error}</p>
        )}
      </div>
    )
  }

  // Show past_due warning
  if (subscriptionStatus === 'past_due') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-red-600 text-lg">⚠️</span>
            <span className="text-red-800 font-medium">Payment Past Due</span>
            <span className="text-red-600 text-sm">- Please update your payment method</span>
          </div>
          <button
            onClick={handleManageSubscription}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Update Payment'}
          </button>
        </div>
        {error && (
          <p className="text-red-600 text-sm mt-2">{error}</p>
        )}
      </div>
    )
  }

  // Show canceled state
  if (subscriptionStatus === 'canceled') {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-lg">○</span>
            <span className="text-gray-800 font-medium">Subscription Canceled</span>
          </div>
          <button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Resubscribe'}
          </button>
        </div>
        {error && (
          <p className="text-red-600 text-sm mt-2">{error}</p>
        )}
      </div>
    )
  }

  // Show trial banner
  const daysLeft = calculateDaysLeft(trialEndsAt)
  const isExpiringSoon = daysLeft <= 3
  const bannerBg = isExpiringSoon ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-200'
  const textColor = isExpiringSoon ? 'text-orange-800' : 'text-blue-800'
  const secondaryColor = isExpiringSoon ? 'text-orange-600' : 'text-blue-600'
  const buttonBg = isExpiringSoon ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'

  return (
    <div className={`${bannerBg} border rounded-lg px-4 py-3 mb-6`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`${secondaryColor} text-lg`}>⏱️</span>
          <span className={`${textColor} font-medium`}>
            Trial: {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left
          </span>
          {isExpiringSoon && (
            <span className={`${secondaryColor} text-sm`}>- Upgrade now to keep your number!</span>
          )}
        </div>
        <button
          onClick={handleUpgrade}
          disabled={isLoading}
          className={`px-4 py-2 ${buttonBg} text-white text-sm font-medium rounded-md disabled:opacity-50`}
        >
          {isLoading ? 'Loading...' : 'Upgrade - $29/mo'}
        </button>
      </div>
      {error && (
        <p className="text-red-600 text-sm mt-2">{error}</p>
      )}
    </div>
  )
}
