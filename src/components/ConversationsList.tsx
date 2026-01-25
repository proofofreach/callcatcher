'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

export interface Conversation {
  customerPhone: string
  lastMessageBody: string
  lastMessageAt: string
  isNew: boolean
  messageCount: number
}

interface ConversationsListProps {
  conversations: Conversation[]
}

/**
 * Mask a phone number for privacy
 * Shows only last 4 digits: ***-***-1234
 */
function maskPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  const lastFour = digits.slice(-4)
  return `***-***-${lastFour}`
}

/**
 * Truncate message body for preview
 */
function truncateMessage(message: string, maxLength: number = 50): string {
  if (message.length <= maxLength) {
    return message
  }
  return message.slice(0, maxLength).trim() + '...'
}

function EmptyState() {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
      <div className="text-4xl mb-4">💬</div>
      <h3 className="text-lg font-semibold text-gray-800">No conversations yet</h3>
      <p className="text-gray-600 mt-2">
        Conversations will appear here after your first missed call.
      </p>
    </div>
  )
}

function ConversationRow({ conversation }: { conversation: Conversation }) {
  const timeAgo = formatDistanceToNow(new Date(conversation.lastMessageAt), { addSuffix: true })

  // Encode phone number for URL (remove + sign for URL safety)
  const phoneParam = encodeURIComponent(conversation.customerPhone)

  return (
    <Link
      href={`/dashboard/conversations/${phoneParam}`}
      className={`block p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
        conversation.isNew ? 'bg-blue-50' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">
              {maskPhoneNumber(conversation.customerPhone)}
            </span>
            {conversation.isNew && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                New
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1 truncate">
            {truncateMessage(conversation.lastMessageBody)}
          </p>
        </div>
        <div className="ml-4 text-right flex-shrink-0">
          <p className="text-xs text-gray-400">{timeAgo}</p>
          <p className="text-xs text-gray-400 mt-1">
            {conversation.messageCount} message{conversation.messageCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </Link>
  )
}

export function ConversationsList({ conversations }: ConversationsListProps) {
  if (conversations.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {conversations.map((conversation) => (
          <ConversationRow key={conversation.customerPhone} conversation={conversation} />
        ))}
      </div>
    </div>
  )
}
