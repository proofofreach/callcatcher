import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getServerUser } from '@/lib/auth-server'
import { createClient } from '@/lib/supabase/server'
import { formatPhoneNumber } from '@/lib/format'
import { format } from 'date-fns'

interface Message {
  id: string
  body: string
  direction: 'inbound' | 'outbound'
  is_auto_reply: boolean
  created_at: string
}

interface PageProps {
  params: Promise<{ phone: string }>
}

async function getMessages(userId: string, customerPhone: string): Promise<Message[]> {
  const supabase = await createClient()

  const { data: messages, error } = await supabase
    .from('messages')
    .select('id, body, direction, is_auto_reply, created_at')
    .eq('user_id', userId)
    .eq('customer_phone', customerPhone)
    .order('created_at', { ascending: true }) // Chronological order (oldest first)

  if (error || !messages) {
    return []
  }

  return messages as Message[]
}

function MessageBubble({ message }: { message: Message }) {
  const isOutbound = message.direction === 'outbound'
  const timestamp = format(new Date(message.created_at), 'MMM d, h:mm a')

  return (
    <div className={`flex ${isOutbound ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          isOutbound
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-900'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.body}</p>
        <div
          className={`flex items-center gap-2 mt-1 text-xs ${
            isOutbound ? 'text-blue-200' : 'text-gray-500'
          }`}
        >
          <span>{timestamp}</span>
          {message.is_auto_reply && (
            <span className={`${isOutbound ? 'text-blue-200' : 'text-gray-500'}`}>
              • Auto-reply
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default async function ConversationDetailPage({ params }: PageProps) {
  const { user, error } = await getServerUser()

  if (error || !user) {
    redirect('/')
  }

  const resolvedParams = await params
  const customerPhone = decodeURIComponent(resolvedParams.phone)

  // Validate phone format - should look like a phone number
  if (!customerPhone || customerPhone.length < 10) {
    notFound()
  }

  const messages = await getMessages(user.id, customerPhone)

  // If no messages found for this phone, show 404
  if (messages.length === 0) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="sr-only">Back to Dashboard</span>
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {formatPhoneNumber(customerPhone)}
              </h1>
              <p className="text-sm text-gray-500">
                {messages.length} message{messages.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>
      </main>
    </div>
  )
}
