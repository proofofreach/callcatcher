import { redirect } from 'next/navigation'
import { getServerUser } from '@/lib/auth-server'
import { createClient } from '@/lib/supabase/server'
import { DashboardContent } from '@/components/DashboardContent'

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

async function getStats(userId: string): Promise<StatsData> {
  const supabase = await createClient()

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const monthStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()

  // Get profile for business name
  const { data: profile } = await supabase
    .from('profiles')
    .select('business_name')
    .eq('user_id', userId)
    .single()

  // Get missed calls counts
  const { count: todayMissedCalls } = await supabase
    .from('calls')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'missed')
    .gte('created_at', todayStart)

  const { count: weekMissedCalls } = await supabase
    .from('calls')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'missed')
    .gte('created_at', weekStart)

  const { count: monthMissedCalls } = await supabase
    .from('calls')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'missed')
    .gte('created_at', monthStart)

  // Get texts sent counts (outbound messages)
  const { count: todayTexts } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('direction', 'outbound')
    .gte('created_at', todayStart)

  const { count: weekTexts } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('direction', 'outbound')
    .gte('created_at', weekStart)

  const { count: monthTexts } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('direction', 'outbound')
    .gte('created_at', monthStart)

  return {
    today: {
      missedCalls: todayMissedCalls ?? 0,
      textsSent: todayTexts ?? 0,
    },
    thisWeek: {
      missedCalls: weekMissedCalls ?? 0,
      textsSent: weekTexts ?? 0,
    },
    thisMonth: {
      missedCalls: monthMissedCalls ?? 0,
      textsSent: monthTexts ?? 0,
    },
    businessName: profile?.business_name ?? null,
  }
}

export default async function DashboardPage() {
  const { user, error } = await getServerUser()

  if (error || !user) {
    redirect('/')
  }

  const stats = await getStats(user.id)
  const hasActivity = stats.thisMonth.missedCalls > 0 || stats.thisMonth.textsSent > 0

  return <DashboardContent stats={stats} hasActivity={hasActivity} />
}
