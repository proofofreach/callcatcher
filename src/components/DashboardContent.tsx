'use client'

import Link from 'next/link'
import { signOut } from '@/lib/auth-client'
import { ConversationsList, type Conversation } from './ConversationsList'
import { TrialBanner } from './TrialBanner'
import type { SubscriptionStatus } from '@/types/database'
import { Phone, MessageSquare, Settings, LogOut, PhoneOff, Zap, DollarSign, ArrowUpRight, Sparkles } from 'lucide-react'

interface Stats {
  missedCalls: number
  textsSent: number
}

interface StatsData {
  today: Stats
  thisWeek: Stats
  thisMonth: Stats
  businessName: string | null
}

interface SubscriptionData {
  trialEndsAt: string | null
  subscriptionStatus: SubscriptionStatus
}

interface DashboardContentProps {
  stats: StatsData
  hasActivity: boolean
  conversations: Conversation[]
  subscription: SubscriptionData
}

// Estimate $500 per saved lead (conservative)
const ESTIMATED_LEAD_VALUE = 500

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accentColor = 'teal'
}: {
  title: string
  value: number | string
  subtitle: string
  icon: React.ElementType
  trend?: string
  accentColor?: 'teal' | 'orange' | 'green'
}) {
  const colorMap = {
    teal: {
      bg: 'bg-teal-50',
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600',
      valueColor: 'text-teal-700',
      trendColor: 'text-teal-600'
    },
    orange: {
      bg: 'bg-orange-50',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      valueColor: 'text-orange-700',
      trendColor: 'text-orange-600'
    },
    green: {
      bg: 'bg-emerald-50',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      valueColor: 'text-emerald-700',
      trendColor: 'text-emerald-600'
    }
  }

  const colors = colorMap[accentColor]

  return (
    <div className={`${colors.bg} rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-200 cursor-default`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`${colors.iconBg} p-3 rounded-xl`}>
          <Icon className={`w-6 h-6 ${colors.iconColor}`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 ${colors.trendColor} text-sm font-medium`}>
            <ArrowUpRight className="w-4 h-4" />
            {trend}
          </div>
        )}
      </div>
      <p className={`text-3xl font-bold ${colors.valueColor} mb-1`}>{value}</p>
      <p className="text-sm text-gray-600">{subtitle}</p>
      <p className="text-xs text-gray-400 mt-2 uppercase tracking-wider font-medium">{title}</p>
    </div>
  )
}

function RevenueCard({ textsSent }: { textsSent: number }) {
  const estimatedRevenue = textsSent * ESTIMATED_LEAD_VALUE

  return (
    <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            Estimated
          </div>
        </div>
        <p className="text-4xl font-bold mb-1">
          ${estimatedRevenue.toLocaleString()}
        </p>
        <p className="text-teal-100">Revenue Protected</p>
        <p className="text-xs text-teal-200 mt-2">
          Based on {textsSent} leads saved × $500 avg value
        </p>
      </div>
    </div>
  )
}

function ZeroState() {
  return (
    <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100 rounded-2xl p-8 text-center">
      <div className="bg-teal-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Zap className="w-8 h-8 text-teal-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">You&apos;re All Set!</h3>
      <p className="text-gray-600 max-w-md mx-auto">
        CallCatcher is actively monitoring your line. When you miss a call, we&apos;ll
        automatically text the customer so you never lose a lead.
      </p>
      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-teal-600">
        <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
        Monitoring active
      </div>
    </div>
  )
}

function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Link
        href="/dashboard/settings"
        className="bg-white border border-gray-200 rounded-xl p-4 hover:border-teal-300 hover:shadow-md transition-all duration-200 group cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 group-hover:bg-teal-100 p-2 rounded-lg transition-colors">
            <MessageSquare className="w-5 h-5 text-gray-600 group-hover:text-teal-600 transition-colors" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Edit Message</p>
            <p className="text-xs text-gray-500">Customize auto-reply</p>
          </div>
        </div>
      </Link>
      <Link
        href="/dashboard/settings"
        className="bg-white border border-gray-200 rounded-xl p-4 hover:border-teal-300 hover:shadow-md transition-all duration-200 group cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 group-hover:bg-teal-100 p-2 rounded-lg transition-colors">
            <Phone className="w-5 h-5 text-gray-600 group-hover:text-teal-600 transition-colors" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Call Settings</p>
            <p className="text-xs text-gray-500">Ring duration & more</p>
          </div>
        </div>
      </Link>
    </div>
  )
}

export function DashboardContent({ stats, hasActivity, conversations, subscription }: DashboardContentProps) {
  const handleLogout = async () => {
    await signOut()
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Logo mark */}
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-2 rounded-xl shadow-lg shadow-teal-500/20">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {stats.businessName || 'Dashboard'}
                </h1>
                <p className="text-sm text-gray-500">CallCatcher</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard/settings"
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trial/Subscription Banner */}
        <TrialBanner
          trialEndsAt={subscription.trialEndsAt}
          subscriptionStatus={subscription.subscriptionStatus}
        />

        {/* Hero Stats - This Month Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <RevenueCard textsSent={stats.thisMonth.textsSent} />
          <StatCard
            title="This Month"
            value={stats.thisMonth.missedCalls}
            subtitle="Missed Calls Caught"
            icon={PhoneOff}
            accentColor="orange"
          />
          <StatCard
            title="This Month"
            value={stats.thisMonth.textsSent}
            subtitle="Auto-Texts Sent"
            icon={MessageSquare}
            accentColor="teal"
          />
        </div>

        {/* Detailed Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Today"
            value={stats.today.missedCalls}
            subtitle="Missed Calls"
            icon={PhoneOff}
            accentColor="orange"
          />
          <StatCard
            title="Today"
            value={stats.today.textsSent}
            subtitle="Texts Sent"
            icon={MessageSquare}
            accentColor="teal"
          />
          <StatCard
            title="This Week"
            value={stats.thisWeek.missedCalls}
            subtitle="Missed Calls"
            icon={PhoneOff}
            accentColor="orange"
          />
          <StatCard
            title="This Week"
            value={stats.thisWeek.textsSent}
            subtitle="Texts Sent"
            icon={MessageSquare}
            accentColor="teal"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Quick Actions</h2>
          <QuickActions />
        </div>

        {/* Zero State or Conversations List */}
        {!hasActivity && conversations.length === 0 ? (
          <ZeroState />
        ) : (
          <ConversationsList conversations={conversations} />
        )}
      </main>
    </div>
  )
}
