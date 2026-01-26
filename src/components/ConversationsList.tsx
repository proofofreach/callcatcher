'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { MessageCircle, ChevronRight, Inbox } from 'lucide-react'

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
    <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
      <div className="bg-gray-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Inbox className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations yet</h3>
      <p className="text-gray-500 max-w-sm mx-auto">
        When customers respond to your auto-texts, their conversations will appear here.
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
      className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 group cursor-pointer ${
        conversation.isNew ? 'bg-teal-50/50' : ''
      }`}
    >
      {/* Avatar/Icon */}
      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
        conversation.isNew ? 'bg-teal-100' : 'bg-gray-100'
      }`}>
        <MessageCircle className={`w-5 h-5 ${conversation.isNew ? 'text-teal-600' : 'text-gray-500'}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-gray-900">
            {maskPhoneNumber(conversation.customerPhone)}
          </span>
          {conversation.isNew && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-700">
              New
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 truncate">
          {truncateMessage(conversation.lastMessageBody)}
        </p>
      </div>

      {/* Meta */}
      <div className="flex-shrink-0 text-right flex items-center gap-3">
        <div>
          <p className="text-xs text-gray-400">{timeAgo}</p>
          <p className="text-xs text-gray-400 mt-1">
            {conversation.messageCount} msg{conversation.messageCount !== 1 ? 's' : ''}
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
      </div>
    </Link>
  )
}

export function ConversationsList({ conversations }: ConversationsListProps) {
  if (conversations.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
        <span className="text-sm text-gray-500">{conversations.length} total</span>
      </div>
      <div>
        {conversations.map((conversation) => (
          <ConversationRow key={conversation.customerPhone} conversation={conversation} />
        ))}
      </div>
    </div>
  )
}
