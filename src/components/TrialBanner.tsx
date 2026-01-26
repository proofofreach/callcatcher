'use client'

import { useState } from 'react'
import { createCheckoutSession, createBillingPortalSession } from '@/lib/stripe-actions'
import type { SubscriptionStatus } from '@/types/database'
import { Check, Clock, AlertTriangle, Circle } from 'lucide-react'

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
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-1.5 rounded-lg">
              <Check className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-emerald-800 font-medium">Active Subscription</span>
          </div>
          <button
            onClick={handleManageSubscription}
            disabled={isLoading}
            className="text-sm text-emerald-700 hover:text-emerald-900 font-medium underline disabled:opacity-50 cursor-pointer"
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
      <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-1.5 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <span className="text-red-800 font-medium">Payment Past Due</span>
              <span className="text-red-600 text-sm ml-2">Please update your payment method</span>
            </div>
          </div>
          <button
            onClick={handleManageSubscription}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors cursor-pointer"
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
      <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gray-200 p-1.5 rounded-lg">
              <Circle className="w-4 h-4 text-gray-500" />
            </div>
            <span className="text-gray-800 font-medium">Subscription Canceled</span>
          </div>
          <button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors cursor-pointer"
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

  return (
    <div className={`rounded-xl px-4 py-3 mb-6 border ${
      isExpiringSoon
        ? 'bg-orange-50 border-orange-200'
        : 'bg-teal-50 border-teal-200'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-lg ${
            isExpiringSoon ? 'bg-orange-100' : 'bg-teal-100'
          }`}>
            <Clock className={`w-4 h-4 ${
              isExpiringSoon ? 'text-orange-600' : 'text-teal-600'
            }`} />
          </div>
          <div>
            <span className={`font-medium ${
              isExpiringSoon ? 'text-orange-800' : 'text-teal-800'
            }`}>
              Trial: {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left
            </span>
            {isExpiringSoon && (
              <span className="text-orange-600 text-sm ml-2">
                Upgrade now to keep your number!
              </span>
            )}
          </div>
        </div>
        <button
          onClick={handleUpgrade}
          disabled={isLoading}
          className={`px-4 py-2 text-white text-sm font-medium rounded-lg disabled:opacity-50 transition-colors cursor-pointer ${
            isExpiringSoon
              ? 'bg-orange-600 hover:bg-orange-700'
              : 'bg-teal-600 hover:bg-teal-700'
          }`}
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
