'use client'

import { signOut } from '@/lib/auth-client'
import { ConversationsList, type Conversation } from './ConversationsList'

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

interface DashboardContentProps {
  stats: StatsData
  hasActivity: boolean
  conversations: Conversation[]
}

function StatCard({ title, missedCalls, textsSent }: { title: string; missedCalls: number; textsSent: number }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">{title}</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-3xl font-bold text-gray-900">{missedCalls}</p>
          <p className="text-sm text-gray-500">Missed Calls</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-blue-600">{textsSent}</p>
          <p className="text-sm text-gray-500">Texts Sent</p>
        </div>
      </div>
    </div>
  )
}

function ZeroState() {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
      <div className="text-4xl mb-4">🎉</div>
      <h3 className="text-lg font-semibold text-green-800">No missed calls yet - that&apos;s good!</h3>
      <p className="text-green-600 mt-2">
        When you miss a call, CallCatcher will automatically text the caller for you.
      </p>
    </div>
  )
}

export function DashboardContent({ stats, hasActivity, conversations }: DashboardContentProps) {
  const handleLogout = async () => {
    await signOut()
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {stats.businessName || 'Dashboard'}
              </h1>
              <p className="text-sm text-gray-500">CallCatcher Dashboard</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Today" missedCalls={stats.today.missedCalls} textsSent={stats.today.textsSent} />
          <StatCard title="This Week" missedCalls={stats.thisWeek.missedCalls} textsSent={stats.thisWeek.textsSent} />
          <StatCard title="This Month" missedCalls={stats.thisMonth.missedCalls} textsSent={stats.thisMonth.textsSent} />
        </div>

        {/* Zero State or Conversations List */}
        {!hasActivity && conversations.length === 0 && <ZeroState />}

        {/* Conversations List */}
        <ConversationsList conversations={conversations} />
      </div>
    </div>
  )
}
